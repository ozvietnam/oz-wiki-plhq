// Dựng chỉ mục & các đoạn (chunks) từ wiki/ (summary, concepts, sources) cho Cổng MCP hỏi đáp PLHQ.
// Bỏ qua wiki/graph, index.md, log.md, chuan-mau-wiki-source.md.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import yaml from 'js-yaml';
import { ROOT, khoa, bacNguon, dungDoThi, homNay, LUOC_DO_PHIEN_BAN } from './registry.mjs';
import { LOP_DU_LIEU } from './van-tay.mjs';

export const GIAY_PHEP = 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/';
export const MIEN_TRU = 'Tham khảo, không phải tư vấn pháp lý. Xem và đối chiếu văn bản gốc nguồn bậc A trước khi áp dụng.';
export const LOAI_TRANG = ['summary', 'concepts', 'sources'];
const BO_QUA_TEP = new Set(['index.md', 'log.md', 'chuan-mau-wiki-source.md']);
const MAX_CHUNK_LEN = 2000;

// Số hiệu văn bản trong chữ — khớp tools/diem-mu.mjs dòng 16.
export const RE_SO_HIEU_WIKI = /\b\d{1,4}\/(?:\d{4}\/)?(?:TT|NĐ|ND|QĐ|QD|NQ|TTLT|CT)-[A-ZĐa-z]+(?:-[A-ZĐ]+)?\b|\b\d{1,3}\/\d{4}\/QH\d{2}\b/g;

// Ngữ cảnh lịch sử / hết hiệu lực trên dòng (khớp luật D16 trong tools/diem-mu.mjs).
const RE_NGU_CANH_LICH_SU = /hết hiệu lực|bị thay|bị bãi bỏ|bãi bỏ bởi|thay thế bởi|tiền thân|trước đây|lịch sử|tạm ngưng|không còn áp dụng/i;

export function ghiNguonChuan(today = homNay()) {
  return `Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0, bản ${today}).`;
}

/** Parse YAML frontmatter bằng js-yaml CORE_SCHEMA; lỗi parse không crash. */
export function phanTichFrontmatter(raw) {
  const s = String(raw || '').replace(/^\uFEFF/, '');
  const m = s.match(/^---\r?\n(?:([\s\S]*?)\r?\n)?---(?:\r?\n|$)([\s\S]*)$/);
  if (!m) return { meta: {}, body: s, loi: null };
  const yamlText = m[1] || '';
  const body = m[2] || '';
  if (!yamlText.trim()) return { meta: {}, body, loi: null };
  try {
    const parsed = yaml.load(yamlText, { schema: yaml.CORE_SCHEMA });
    const meta = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    return { meta, body, loi: null };
  } catch (e) {
    return { meta: {}, body, loi: e?.message ? e.message.split('\n')[0] : String(e) };
  }
}

/** Tách body thành các đoạn theo heading `## `; mục > 2000 ký tự tách tiếp theo `### ` giữ tên mục cha. */
export function tachChunks(body, maxLen = MAX_CHUNK_LEN) {
  const text = String(body || '').trim();
  if (!text) return [];

  const sections = [];
  let curTitle = '';
  let curLines = [];
  let inFence = false;

  for (const line of text.split(/\r?\n/)) {
    if (/^(?:```|~~~)/.test(line.trim())) inFence = !inFence;
    const h2 = !inFence && line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      sections.push({ muc: curTitle, lines: curLines });
      curTitle = h2[1].trim();
      curLines = [];
    } else {
      curLines.push(line);
    }
  }
  sections.push({ muc: curTitle, lines: curLines });

  const chunks = [];
  for (const sec of sections) {
    const secBody = sec.lines.join('\n').trim();
    if (!secBody) continue;
    if (secBody.length <= maxLen) {
      chunks.push({ muc: sec.muc, noi_dung: secBody });
      continue;
    }

    // Mục > 2000 ký tự → tách tiếp theo `### ` giữ tên mục cha.
    const subs = [];
    let subTitle = '';
    let subLines = [];
    let fence = false;
    for (const line of sec.lines) {
      if (/^(?:```|~~~)/.test(line.trim())) fence = !fence;
      const h3 = !fence && line.match(/^###\s+(.+?)\s*$/);
      if (h3) {
        subs.push({ sub: subTitle, lines: subLines });
        subTitle = h3[1].trim();
        subLines = [];
      } else {
        subLines.push(line);
      }
    }
    subs.push({ sub: subTitle, lines: subLines });

    // Nếu không có `### ` thực sự, giữ nguyên 1 chunk.
    if (subs.length === 1 && !subs[0].sub) {
      chunks.push({ muc: sec.muc, noi_dung: secBody });
      continue;
    }
    for (const s of subs) {
      const subBody = s.lines.join('\n').trim();
      if (!subBody) continue;
      const muc = s.sub ? (sec.muc ? `${sec.muc} > ${s.sub}` : s.sub) : sec.muc;
      chunks.push({ muc, noi_dung: subBody });
    }
  }
  return chunks;
}

function nguonADauTien(d, nguonMap) {
  return (d.nguon || []).find((n) => bacNguon(n.url, nguonMap) === 'A')?.url || null;
}

function trichVanBanLienQuan(text, so, nguoc) {
  const seen = new Set();
  const out = [];
  for (const m of String(text || '').match(RE_SO_HIEU_WIKI) || []) {
    const d = so.theoKhoa.get(khoa(m))?.[0];
    if (!d) continue;
    const kd = khoa(d.so_hieu);
    if (seen.has(kd)) continue;
    seen.add(kd);
    const ng = nguoc.get(kd) || {};
    out.push({
      so_hieu: d.so_hieu,
      tinh_trang: d.tinh_trang || null,
      hieu_luc_tu: d.hieu_luc_tu || null,
      het_hieu_luc_tu: d.het_hieu_luc_tu || null,
      hieu_luc_da_doi_chieu: d.xac_minh?.hieu_luc_da_doi_chieu === true,
      bi_thay_the_boi: [...new Set((ng.bi_thay_the_boi || []).map((e) => e.tu))],
      bi_bai_bo_boi: [...new Set((ng.bi_bai_bo_boi || []).map((e) => e.tu))],
      nguon_a: nguonADauTien(d, so.nguon),
    });
  }
  return out;
}

function coCanhBaoHieuLuc(loaiTrang, chunkText, tapTrang, so, nguoc) {
  if (loaiTrang === 'sources') return false;
  for (const line of String(chunkText || '').split(/\r?\n/)) {
    const hits = line.match(RE_SO_HIEU_WIKI);
    if (!hits) continue;
    for (const m of hits) {
      const d = so.theoKhoa.get(khoa(m))?.[0];
      if (!d || d.tinh_trang !== 'HET_HIEU_LUC' || d.loai === 'THONG_BAO') continue;
      const ng = nguoc.get(khoa(d.so_hieu)) || {};
      const thayBai = [...(ng.bi_thay_the_boi || []), ...(ng.bi_bai_bo_boi || [])].map((e) => khoa(e.tu));
      if (thayBai.some((k) => tapTrang.has(k))) continue;
      if (RE_NGU_CANH_LICH_SU.test(line)) continue;
      return true;
    }
  }
  return false;
}

function tieuDeMacDinh(meta, body, slug) {
  if (typeof meta.title === 'string' && meta.title.trim()) return meta.title.trim();
  const h1 = String(body || '').match(/^#\s+(.+?)\s*$/m);
  return h1 ? h1[1].trim() : slug;
}

export function dungWikiDist(so, root = ROOT, today = homNay()) {
  const { nguoc } = dungDoThi(so);
  const trang = [];
  const allChunks = [];

  for (const loaiTrang of LOAI_TRANG) {
    const dir = join(root, 'wiki', loaiTrang);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir)
      .filter((f) => f.endsWith('.md') && !BO_QUA_TEP.has(f))
      .sort();

    for (const f of files) {
      const slug = basename(f, '.md');
      const duongDan = `wiki/${loaiTrang}/${f}`;
      const raw = readFileSync(join(dir, f), 'utf8');
      const { meta, body } = phanTichFrontmatter(raw);
      const tieuDe = tieuDeMacDinh(meta, body, slug);
      const tags = Array.isArray(meta.tags) ? meta.tags.map(String) : [];
      const confidence = meta.confidence ? String(meta.confidence) : null;

      const pageText = `${tieuDe}\n${body}`;
      const tapTrang = new Set();
      for (const m of pageText.match(RE_SO_HIEU_WIKI) || []) {
        const d = so.theoKhoa.get(khoa(m))?.[0];
        tapTrang.add(d ? khoa(d.so_hieu) : khoa(m));
      }
      const pageRefs = trichVanBanLienQuan(pageText, so, nguoc);

      const rawChunks = tachChunks(body);
      let pageCanhBao = false;
      rawChunks.forEach((c, idx) => {
        const chunkText = c.muc ? `${c.muc}\n${c.noi_dung}` : c.noi_dung;
        const canhBao = coCanhBaoHieuLuc(loaiTrang, chunkText, tapTrang, so, nguoc);
        if (canhBao) pageCanhBao = true;
        allChunks.push({
          chunk_id: `${slug}#${idx + 1}`,
          slug,
          duong_dan: duongDan,
          loai_trang: loaiTrang,
          tieu_de: tieuDe,
          muc: c.muc,
          noi_dung: c.noi_dung,
          tags,
          confidence,
          van_ban_lien_quan: trichVanBanLienQuan(chunkText, so, nguoc),
          canh_bao_hieu_luc: canhBao,
        });
      });

      trang.push({
        slug,
        duong_dan: duongDan,
        loai_trang: loaiTrang,
        tieu_de: tieuDe,
        created: meta.created ? String(meta.created) : null,
        updated: meta.updated ? String(meta.updated) : null,
        tags,
        confidence,
        so_chunks: rawChunks.length,
        van_ban_lien_quan: pageRefs,
        canh_bao_hieu_luc: pageCanhBao,
      });
    }
  }

  const chung = {
    phien_ban: today,
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    lop_du_lieu: LOP_DU_LIEU.BO_TRO,
    giay_phep: GIAY_PHEP,
    ghi_nguon_chuan: ghiNguonChuan(today),
    mien_tru: MIEN_TRU,
  };

  return {
    index: { ...chung, tong: trang.length, trang },
    chunks: { ...chung, tong: allChunks.length, chunks: allChunks },
  };
}
