#!/usr/bin/env node
// Phân loại hàng đợi đối chiếu hiệu lực (HS_API) để agent không săn lặp vào tường.
//   node tools/san-hieu-luc.mjs           → in bảng: làm được / đã chặn / gợi ý việc tiếp
//   node tools/san-hieu-luc.mjs --json
//   node tools/san-hieu-luc.mjs --probe   → HEAD thử vài URL datafiles thường gặp (cần mạng)
import { napSo, khoa, bacNguon, homNay, ROOT, CHAN_HIEU_LUC } from './lib/registry.mjs';
import { docNhuCau } from './diem-mu.mjs';

const NGAY_LAM_LAI = 14; // sau N ngày mới nên săn lại mục đã chan

function cong(ngay, soNgay) {
  const d = new Date(`${ngay}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + soNgay);
  return d.toISOString().slice(0, 10);
}

/** Gợi ý URL datafiles thường gặp để --probe (không phải danh sách đủ). */
export function goiYDatafiles(soHieu, ngayBanHanh) {
  const m = String(soHieu).match(/^(\d+)\/(?:(\d{4})\/)?(?:QĐ|QD|TT|NĐ|ND)-([A-ZĐ]+)/i);
  if (!m) return [];
  const so = m[1];
  const nam = m[2] || String(ngayBanHanh || '').slice(0, 4);
  const cq = m[3].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  if (!nam) return [];
  const thang = String(ngayBanHanh || '').slice(5, 7);
  const outs = [];
  const base = `https://datafiles.chinhphu.vn/cpp/files/vbpq/${nam}`;
  if (thang) {
    outs.push(`${base}/${Number(thang)}/${so}-${cq}.signed.pdf`);
    outs.push(`${base}/${thang}/${so}-${cq}.signed.pdf`);
  }
  for (const t of ['1', '01', '7', '07', '10', '12']) {
    outs.push(`${base}/${t}/${so}-${cq}.signed.pdf`);
  }
  return [...new Set(outs)].slice(0, 8);
}

async function probe(urls) {
  const out = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'oz-wiki-plhq/san-hieu-luc' } });
      const ct = res.headers.get('content-type') || '';
      out.push({ url, status: res.status, pdf: /pdf/i.test(ct) || res.status === 200 && Number(res.headers.get('content-length') || 0) > 1000 });
    } catch (e) {
      out.push({ url, status: 0, error: e.cause?.code || e.message });
    }
  }
  return out;
}

function phanLoaiVoiNguon(d, today, bangNguon) {
  const xm = d.xac_minh || {};
  if (xm.hieu_luc_da_doi_chieu === true) return { nhom: 'xong', lyDo: 'đã đối chiếu' };
  const chan = xm.chan;
  if (chan?.ma) {
    const hetHan = chan.ngay && chan.ngay < cong(today, -NGAY_LAM_LAI);
    return {
      nhom: hetHan ? 'chan-het-han' : 'chan',
      lyDo: `${chan.ma} (${chan.ngay})`,
      viecTiep: chan.viec_tiep,
      hetHan,
    };
  }
  const coA = (d.nguon || []).some((n) => bacNguon(n.url, bangNguon) === 'A');
  if (!coA && !d.toan_van) return { nhom: 'lam-duoc', lyDo: 'chưa có nguồn/toàn văn A — truy vết trước' };
  if (coA || d.toan_van) return { nhom: 'lam-duoc', lyDo: 'có A hoặc toan_van — đọc điều khoản + kiểm tình trạng hiện tại' };
  return { nhom: 'lam-duoc', lyDo: 'chưa chan' };
}

export function xepHangDoi(so = napSo(), { today = homNay(), nhuCau = docNhuCau() } = {}) {
  const theoKhoa = (s) => so.theoKhoa.get(khoa(s))?.[0];
  const rows = [];
  for (const v of nhuCau?.vanBanDuocDan || []) {
    const d = theoKhoa(v.soHieu);
    if (!d || d.xac_minh?.hieu_luc_da_doi_chieu) continue;
    const pl = phanLoaiVoiNguon(d, today, so.nguon);
    rows.push({
      so_hieu: d.so_hieu,
      soMaHs: v.soMaHs || 0,
      tinh_trang: d.tinh_trang,
      muc: d.xac_minh?.muc,
      nhom: pl.nhom,
      lyDo: pl.lyDo,
      viecTiep: pl.viecTiep || null,
      chan: d.xac_minh?.chan || null,
      toan_van: !!d.toan_van,
    });
  }
  rows.sort((a, b) => {
    const thu = { 'lam-duoc': 0, 'chan-het-han': 1, chan: 2, xong: 3 };
    return (thu[a.nhom] - thu[b.nhom]) || (b.soMaHs - a.soMaHs);
  });
  return rows;
}

async function main() {
  const json = process.argv.includes('--json');
  const doProbe = process.argv.includes('--probe');
  const so = napSo();
  const today = homNay();
  const rows = xepHangDoi(so, { today });
  const lam = rows.filter((r) => r.nhom === 'lam-duoc');
  const chan = rows.filter((r) => r.nhom === 'chan' || r.nhom === 'chan-het-han');

  if (json) {
    console.log(JSON.stringify({ today, lam_duoc: lam.length, da_chan: chan.length, rows, ma_chan: CHAN_HIEU_LUC }, null, 2));
    return;
  }

  console.log(`# Hàng đợi săn hiệu lực — ${today}`);
  console.log(`Làm được: ${lam.length} · Đã chặn (đừng săn lặp): ${chan.length} · Tổng chưa đối chiếu trong nhu-cầu: ${rows.length}`);
  console.log('');
  if (lam.length) {
    console.log('## Làm được ngay (ưu tiên theo số mã HS)');
    for (const r of lam) {
      console.log(`- ${r.so_hieu} (${r.soMaHs} mã) — ${r.lyDo}`);
    }
    console.log('');
  } else {
    console.log('## Làm được ngay: không còn');
    console.log('Không săn lại mục đã chặn. Chuyển luồng khác (danh-muc-hs, do-tham, doc-hieu) hoặc mở chặn theo `viec_tiep`.');
    console.log('');
  }
  if (chan.length) {
    console.log('## Đã chặn — chỉ săn lại khi có tín hiệu mới hoặc quá 14 ngày');
    for (const r of chan) {
      const flag = r.nhom === 'chan-het-han' ? ' [hết hạn — được săn lại]' : '';
      console.log(`- ${r.so_hieu} (${r.soMaHs} mã) ${r.lyDo}${flag}`);
      if (r.viecTiep) console.log(`  → ${r.viecTiep}`);
    }
    console.log('');
  }
  console.log('Mã chan hợp lệ:', CHAN_HIEU_LUC.join(', '));
  console.log('Ghi chan: thêm xac_minh.chan.{ma,ngay,viec_tiep} rồi npm test — điểm mù chuyển sang HS_API_CHO_MO_CHAN (Thấp).');

  if (doProbe) {
    console.log('\n## Probe datafiles (HEAD)');
    const targets = lam.length ? lam.slice(0, 5) : chan.filter((r) => r.nhom === 'chan-het-han').slice(0, 3);
    for (const r of targets) {
      const d = so.theoKhoa.get(khoa(r.so_hieu))?.[0];
      const urls = goiYDatafiles(r.so_hieu, d?.ngay_ban_hanh);
      if (!urls.length) continue;
      const ket = await probe(urls);
      const hit = ket.filter((k) => k.status === 200);
      console.log(`${r.so_hieu}: ${hit.length ? hit.map((h) => h.url).join(' | ') : '0 hit / ' + ket.length + ' thử'}`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
