/* oz-wiki-plhq | schema: v{{LUOC_DO_PHIEN_BAN}} | data: {{PHIEN_BAN}} | built: {{THOI_DIEM_DUNG}} */
(function () {
  'use strict';

  const PAGE_SIZE = {
    reg: 25,
    wiki: 20,
    dk: 10,
    cas: 50,
  };

  const TEN_TINH_TRANG = {
    CON_HIEU_LUC: 'Còn hiệu lực',
    HET_HIEU_LUC: 'Hết hiệu lực',
    HET_HIEU_LUC_MOT_PHAN: 'Hết HL một phần',
    TAM_NGUNG_HIEU_LUC: 'Tạm ngưng HL',
    CHUA_CO_HIEU_LUC: 'Chưa có hiệu lực',
    CHUA_XAC_MINH: 'Chưa xác minh',
  };

  const CLASS_TINH_TRANG = {
    CON_HIEU_LUC: 'badge-ok',
    HET_HIEU_LUC: 'badge-expired',
    HET_HIEU_LUC_MOT_PHAN: 'badge-partial',
    TAM_NGUNG_HIEU_LUC: 'badge-partial',
    CHUA_CO_HIEU_LUC: 'badge-pending',
    CHUA_XAC_MINH: 'badge-unknown',
  };

  const TEN_MUC_XAC_MINH = {
    NGUON_A: 'Nguồn bậc A',
    NGUON_B: 'Nguồn bậc B',
    NGUON_THU_CAP: 'Nguồn thứ cấp',
    CHUA_XAC_MINH: 'Chưa xác minh',
  };

  const TEN_LOAI_VB = {
    HIEN_PHAP: 'Hiến pháp',
    LUAT: 'Luật',
    NGHI_QUYET: 'Nghị quyết',
    PHAP_LENH: 'Pháp lệnh',
    NGHI_DINH: 'Nghị định',
    QUYET_DINH: 'Quyết định',
    THONG_TU: 'Thông tư',
    THONG_TU_LIEN_TICH: 'Thông tư liên tịch',
    CHI_THI: 'Chỉ thị',
    CONG_VAN: 'Công văn',
    THONG_BAO: 'Thông báo',
    VAN_BAN_HOP_NHAT: 'Văn bản hợp nhất',
    DIEU_UOC: 'Điều ước quốc tế',
    TIEU_CHUAN: 'Tiêu chuẩn / QCVN',
    KHAC: 'Khác',
  };

  const TEN_QUAN_HE_DI = {
    thay_the: 'Thay thế',
    sua_doi: 'Sửa đổi, bổ sung',
    bai_bo: 'Bãi bỏ',
    tam_ngung: 'Tạm ngưng',
    huong_dan: 'Hướng dẫn',
    hop_nhat: 'Hợp nhất',
  };

  const TEN_QUAN_HE_NGUOC = {
    bi_thay_the_boi: 'Bị thay thế bởi',
    bi_sua_doi_boi: 'Bị sửa đổi bởi',
    bi_bai_bo_boi: 'Bị bãi bỏ bởi',
    bi_tam_ngung_boi: 'Bị tạm ngưng bởi',
    duoc_huong_dan_boi: 'Được hướng dẫn bởi',
    duoc_hop_nhat_boi: 'Được hợp nhất bởi',
  };

  const TEN_LOAI_WIKI = {
    summary: 'Tổng hợp nghiệp vụ',
    concepts: 'Khái niệm & quy định',
    sources: 'Tài liệu nguồn',
  };

  const THU_TU_PHU_LUC = { I: 1, II: 2, III: 3, IV: 4 };

  const state = {
    activeTab: 'hieu-luc',
    cache: {},
    loading: {},
    reg: { q: '', tinhTrang: '', muc: '', loai: '', nhanh: '', onlyRel: false, page: 1, highlightDoc: '' },
    wiki: { q: '', loai: '', mode: 'auto', onlyOld: false, slugFilter: '', page: 1, expanded: {} },
    dk: { q: '', tier: '', docKey: '', page: 1, expandedDocs: {} },
    cas: { q: '', phuLuc: '', casMode: 'all', page: 1 },
  };

  function esc(v) {
    return String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return null;
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.href;
    } catch {
      return null;
    }
    return null;
  }

  function tachUrlVaGhiChu(raw) {
    const s = String(raw || '').trim();
    if (!s) return { url: null, note: '' };
    const m = s.match(/^(https?:\/\/\S+)(?:\s+(.*))?$/i);
    if (!m) return { url: null, note: s };
    return { url: safeUrl(m[1]), note: (m[2] || '').trim() };
  }

  function normText(s) {
    return String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .trim();
  }

  function normDocNo(s) {
    return String(s || '')
      .normalize('NFC')
      .toUpperCase()
      .replace(/Đ/g, 'D')
      .replace(/\s+/g, '')
      .replace(/[.,;:]$/, '');
  }

  function fmtNum(n) {
    return Number(n || 0).toLocaleString('vi-VN');
  }

  function badgeTinhTrang(tt) {
    const label = TEN_TINH_TRANG[tt] || tt || 'Chưa xác minh';
    const cls = CLASS_TINH_TRANG[tt] || 'badge-unknown';
    return `<span class="badge ${cls}">${esc(label)}</span>`;
  }

  function badgeMucXacMinh(muc) {
    const label = TEN_MUC_XAC_MINH[muc] || muc || 'Chưa xác minh';
    const cls = muc === 'NGUON_A' ? 'badge-tier-a' : muc === 'NGUON_B' ? 'badge-pending' : 'badge-soft';
    return `<span class="badge ${cls}">${esc(label)}</span>`;
  }

  function domainTuUrl(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  function showGlobalAlert(msg) {
    const box = document.getElementById('global-alert');
    if (!box) return;
    if (!msg) {
      box.classList.add('hidden');
      box.textContent = '';
      return;
    }
    box.textContent = msg;
    box.classList.remove('hidden');
  }

  async function fetchJson(key, path) {
    if (state.cache[key]) return state.cache[key];
    if (state.loading[key]) return state.loading[key];

    state.loading[key] = fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${path}`);
        return res.json();
      })
      .then((data) => {
        state.cache[key] = data;
        delete state.loading[key];
        return data;
      })
      .catch((err) => {
        delete state.loading[key];
        throw err;
      });
    return state.loading[key];
  }

  function thongBaoLoiTaiDuLieu(err) {
    const isFileProto = window.location.protocol === 'file:';
    const goiY = isFileProto
      ? 'Trình duyệt chặn fetch() trên giao thức file://. Hãy mở thư mục site/ qua máy chủ tĩnh (ví dụ: python3 -m http.server -d site hoặc npx serve site).'
      : 'Kiểm tra thư mục data/ nằm cùng cấp với index.html.';
    return `Không tải được dữ liệu (${err?.message || err}). ${goiY}`;
  }

  function renderPager(el, page, totalItems, pageSize, onPage) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    if (totalItems <= pageSize) {
      el.innerHTML = '';
      return;
    }
    el.innerHTML = `
      <button type="button" class="btn-secondary" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>← Trước</button>
      <span class="meta-pill">Trang <strong>${page}</strong> / ${totalPages} (${fmtNum(totalItems)} mục)</span>
      <button type="button" class="btn-secondary" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>Sau →</button>
    `;
    el.querySelectorAll('button[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = Number(btn.getAttribute('data-page'));
        if (next >= 1 && next <= totalPages) onPage(next);
      });
    });
  }

  function jumpToDoc(soHieu) {
    if (!soHieu) return;
    state.reg.q = soHieu;
    state.reg.tinhTrang = '';
    state.reg.muc = '';
    state.reg.loai = '';
    state.reg.nhanh = '';
    state.reg.onlyRel = false;
    state.reg.page = 1;
    state.reg.highlightDoc = normDocNo(soHieu);

    const qEl = document.getElementById('reg-q');
    if (qEl) qEl.value = soHieu;
    ['reg-tinh-trang', 'reg-muc', 'reg-loai', 'reg-nhanh'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const relEl = document.getElementById('reg-only-rel');
    if (relEl) relEl.checked = false;

    activateTab('hieu-luc');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==================== TAB 1: HIỆU LỰC VĂN BẢN ====================
  function prepareRegistry(raw) {
    if (raw._prepared) return raw;
    const docs = raw.van_ban || [];
    const nhanhSet = new Set();
    const byKey = new Map();

    for (const d of docs) {
      const keys = [d.so_hieu, ...(d.so_hieu_khac || [])].map(normDocNo).filter(Boolean);
      for (const k of keys) {
        if (!byKey.has(k)) byKey.set(k, d);
      }
      for (const n of d.nhanh || []) {
        nhanhSet.add(n);
        if (n.includes('/')) nhanhSet.add(n.split('/')[0]);
      }
      const cqTen = (raw.co_quan_ten && d.co_quan && raw.co_quan_ten[d.co_quan]) || '';
      const nhanhText = (d.nhanh || [])
        .map((n) => `${n} ${(raw.nhanh_ten && raw.nhanh_ten[n]) || ''}`)
        .join(' ');
      d._docKey = normDocNo(d.so_hieu);
      d._altKeys = (d.so_hieu_khac || []).map(normDocNo);
      d._search = normText([
        d.so_hieu,
        ...(d.so_hieu_khac || []),
        d.ten,
        d.co_quan,
        cqTen,
        nhanhText,
        ...(d.tu_khoa || []),
      ].join(' '));
      d._hasRel = Boolean(
        (d.quan_he && Object.values(d.quan_he).some((a) => Array.isArray(a) && a.length))
        || (d.quan_he_nguoc && Object.values(d.quan_he_nguoc).some((a) => Array.isArray(a) && a.length))
      );
    }

    raw._byKey = byKey;
    raw._nhanhList = [...nhanhSet].sort();
    raw._prepared = true;

    const selNhanh = document.getElementById('reg-nhanh');
    if (selNhanh && selNhanh.options.length <= 1) {
      const nhanhTen = raw.nhanh_ten || {};
      for (const path of raw._nhanhList) {
        const opt = document.createElement('option');
        opt.value = path;
        opt.textContent = nhanhTen[path] ? `${nhanhTen[path]} (${path})` : path;
        selNhanh.appendChild(opt);
      }
    }
    return raw;
  }

  function renderQuanHeItem(soHieu, meta = {}) {
    const parts = [];
    if (meta.pham_vi) parts.push(esc(meta.pham_vi));
    if (meta.tu_ngay) parts.push(`từ ${esc(meta.tu_ngay)}`);
    if (meta.can_cu) parts.push(`căn cứ: ${esc(meta.can_cu)}`);
    const extra = parts.length ? ` <span class="text-soft">(${parts.join(' · ')})</span>` : '';
    return `<li><button type="button" class="btn-link" data-jump-doc="${esc(soHieu)}">${esc(soHieu)}</button>${extra}</li>`;
  }

  function renderTabRegistry() {
    const listEl = document.getElementById('reg-list');
    const summaryEl = document.getElementById('reg-summary');
    const pagerEl = document.getElementById('reg-pager');
    const statsEl = document.getElementById('reg-stats');

    const raw = state.cache.registry;
    if (!raw) return;
    prepareRegistry(raw);
    const docs = raw.van_ban || [];

    const total = docs.length;
    const conHL = docs.filter((d) => d.tinh_trang === 'CON_HIEU_LUC').length;
    const hetHL = docs.filter((d) => d.tinh_trang === 'HET_HIEU_LUC').length;
    const nguonA = docs.filter((d) => d.xac_minh?.muc === 'NGUON_A').length;

    statsEl.innerHTML = `
      <button type="button" class="stat-tile stat-tile-btn" data-reg-quick="all">
        <div class="stat-num">${fmtNum(total)}</div>
        <div class="stat-label">Tổng số văn bản</div>
      </button>
      <button type="button" class="stat-tile stat-tile-btn" data-reg-quick="CON_HIEU_LUC">
        <div class="stat-num">${fmtNum(conHL)}</div>
        <div class="stat-label">Còn hiệu lực</div>
      </button>
      <button type="button" class="stat-tile stat-tile-btn" data-reg-quick="HET_HIEU_LUC">
        <div class="stat-num">${fmtNum(hetHL)}</div>
        <div class="stat-label">Hết hiệu lực</div>
      </button>
      <button type="button" class="stat-tile stat-tile-btn" data-reg-quick="NGUON_A">
        <div class="stat-num">${fmtNum(nguonA)}</div>
        <div class="stat-label">Xác minh nguồn bậc A</div>
      </button>
    `;
    statsEl.querySelectorAll('[data-reg-quick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-reg-quick');
        state.reg.page = 1;
        if (mode === 'all') {
          state.reg.tinhTrang = '';
          state.reg.muc = '';
        } else if (mode === 'NGUON_A') {
          state.reg.muc = 'NGUON_A';
        } else {
          state.reg.tinhTrang = mode;
        }
        document.getElementById('reg-tinh-trang').value = state.reg.tinhTrang;
        document.getElementById('reg-muc').value = state.reg.muc;
        renderTabRegistry();
      });
    });

    const qNorm = normText(state.reg.q);
    const qDoc = normDocNo(state.reg.q);
    const { tinhTrang, muc, loai, nhanh, onlyRel } = state.reg;

    let filtered = docs.filter((d) => {
      if (tinhTrang && d.tinh_trang !== tinhTrang) return false;
      if (muc && (d.xac_minh?.muc || 'CHUA_XAC_MINH') !== muc) return false;
      if (loai === '__VBQPPL__' && d.loai === 'THONG_BAO') return false;
      if (loai && loai !== '__VBQPPL__' && d.loai !== loai) return false;
      if (nhanh && !(d.nhanh || []).some((n) => n === nhanh || n.startsWith(`${nhanh}/`))) return false;
      if (onlyRel && !d._hasRel) return false;
      if (qNorm) {
        const matchSearch = d._search.includes(qNorm)
          || (qDoc && (d._docKey.includes(qDoc) || d._altKeys.some((k) => k.includes(qDoc))));
        if (!matchSearch) return false;
      }
      return true;
    });

    if (qDoc) {
      filtered = [...filtered].sort((a, b) => {
        const aExact = a._docKey === qDoc || a._altKeys.includes(qDoc) ? 2 : a._docKey.startsWith(qDoc) ? 1 : 0;
        const bExact = b._docKey === qDoc || b._altKeys.includes(qDoc) ? 2 : b._docKey.startsWith(qDoc) ? 1 : 0;
        return bExact - aExact;
      });
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE.reg));
    if (state.reg.page > totalPages) state.reg.page = totalPages;
    const start = (state.reg.page - 1) * PAGE_SIZE.reg;
    const slice = filtered.slice(start, start + PAGE_SIZE.reg);

    summaryEl.innerHTML = `<span>Tìm thấy <strong>${fmtNum(filtered.length)}</strong> / ${fmtNum(total)} văn bản</span>`
      + (filtered.length ? `<span>Hiển thị ${start + 1}–${Math.min(start + PAGE_SIZE.reg, filtered.length)}</span>` : '');

    if (!slice.length) {
      const missingNotice = state.reg.highlightDoc
        ? `<p>Văn bản <code>${esc(state.reg.q)}</code> chưa có bản ghi riêng trong sổ đăng ký (hoặc đang bị ẩn bởi bộ lọc).</p>`
        : '<p>Không có văn bản nào khớp điều kiện lọc hiện tại. Thử xóa bớt bộ lọc hoặc đổi từ khóa.</p>';
      listEl.innerHTML = `<div class="empty-state">${missingNotice}</div>`;
      pagerEl.innerHTML = '';
      return;
    }

    const cqTenMap = raw.co_quan_ten || {};
    const nhanhTenMap = raw.nhanh_ten || {};

    listEl.innerHTML = slice.map((d) => {
      const cqLabel = cqTenMap[d.co_quan] ? `${d.co_quan} (${cqTenMap[d.co_quan]})` : (d.co_quan || '—');
      const doiChieu = d.xac_minh?.hieu_luc_da_doi_chieu
        ? '<span class="badge badge-ok">Đã đối chiếu hiệu lực</span>'
        : '<span class="badge badge-soft">Chưa đối chiếu</span>';

      const qhDiHtml = [];
      for (const [k, label] of Object.entries(TEN_QUAN_HE_DI)) {
        const arr = d.quan_he?.[k];
        if (!Array.isArray(arr) || !arr.length) continue;
        const items = arr.map((rawItem) => {
          if (typeof rawItem === 'string') return renderQuanHeItem(rawItem);
          return renderQuanHeItem(rawItem.so_hieu, rawItem);
        }).join('');
        qhDiHtml.push(`<div><strong>${esc(label)}:</strong><ul class="rel-list">${items}</ul></div>`);
      }

      const qhNguocHtml = [];
      for (const [k, label] of Object.entries(TEN_QUAN_HE_NGUOC)) {
        const arr = d.quan_he_nguoc?.[k];
        if (!Array.isArray(arr) || !arr.length) continue;
        const items = arr.map((e) => renderQuanHeItem(e.tu || e.so_hieu, e)).join('');
        qhNguocHtml.push(`<div><strong>${esc(label)}:</strong><ul class="rel-list">${items}</ul></div>`);
      }

      const relBlock = (qhDiHtml.length || qhNguocHtml.length) ? `
        <div class="rel-grid">
          ${qhDiHtml.length ? `<div class="rel-box"><div class="rel-heading">Quan hệ chiều đi (văn bản này tác động)</div>${qhDiHtml.join('')}</div>` : ''}
          ${qhNguocHtml.length ? `<div class="rel-box rel-box-reverse"><div class="rel-heading">Quan hệ ngược (bị văn bản khác tác động)</div>${qhNguocHtml.join('')}</div>` : ''}
        </div>
      ` : '';

      const nguonLinks = (d.nguon || []).map((n) => {
        const u = safeUrl(n.url);
        if (!u) return '';
        const tc = n.truy_cap ? ` (truy cập ${esc(n.truy_cap)})` : '';
        return `<a class="source-link" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(domainTuUrl(u))} ↗${tc}</a>`;
      }).filter(Boolean).join('');

      const nhanhChips = (d.nhanh || []).map((n) => {
        const title = nhanhTenMap[n] ? ` title="${esc(nhanhTenMap[n])}"` : '';
        return `<span class="tag-chip"${title}>${esc(n)}</span>`;
      }).join('');

      return `
        <article class="card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="doc-code">${esc(d.so_hieu)}</span>
              <span class="badge badge-soft">${esc(TEN_LOAI_VB[d.loai] || d.loai || 'Văn bản')}</span>
            </div>
            <div class="card-badges">
              ${badgeTinhTrang(d.tinh_trang)}
              ${badgeMucXacMinh(d.xac_minh?.muc)}
              ${doiChieu}
            </div>
          </div>
          <h2 class="card-title">${esc(d.ten)}</h2>
          <div class="meta-row">
            <span><strong>Cơ quan:</strong> ${esc(cqLabel)}</span>
            ${d.ngay_ban_hanh ? `<span><strong>Ban hành:</strong> ${esc(d.ngay_ban_hanh)}</span>` : ''}
            ${d.hieu_luc_tu ? `<span><strong>Hiệu lực từ:</strong> ${esc(d.hieu_luc_tu)}</span>` : ''}
            ${d.het_hieu_luc_tu ? `<span><strong>Hết hiệu lực từ:</strong> ${esc(d.het_hieu_luc_tu)}</span>` : ''}
            ${d.bac_nguon_cao_nhat ? `<span><strong>Nguồn cao nhất:</strong> Bậc ${esc(d.bac_nguon_cao_nhat)}</span>` : ''}
          </div>
          ${nhanhChips ? `<div class="tag-row">${nhanhChips}</div>` : ''}
          ${d.ghi_chu ? `<div class="card-note">${esc(d.ghi_chu)}</div>` : ''}
          ${relBlock}
          <div class="source-row">
            <strong>Nguồn gốc:</strong>
            ${nguonLinks || '<span>Chưa gắn URL nguồn</span>'}
          </div>
        </article>
      `;
    }).join('');

    listEl.querySelectorAll('[data-jump-doc]').forEach((btn) => {
      btn.addEventListener('click', () => jumpToDoc(btn.getAttribute('data-jump-doc')));
    });

    renderPager(pagerEl, state.reg.page, filtered.length, PAGE_SIZE.reg, (p) => {
      state.reg.page = p;
      renderTabRegistry();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== TAB 2: WIKI & HỎI ĐÁP ====================
  function laVanBanCu(vb) {
    return vb?.tinh_trang === 'HET_HIEU_LUC'
      || vb?.tinh_trang === 'HET_HIEU_LUC_MOT_PHAN'
      || vb?.tinh_trang === 'TAM_NGUNG_HIEU_LUC';
  }

  function prepareWiki(wikiIndex, wikiChunks) {
    if (!wikiIndex._prepared) {
      for (const p of wikiIndex.trang || []) {
        const refs = (p.van_ban_lien_quan || []).map((v) => v.so_hieu).join(' ');
        p._hasExpiredRef = Boolean(
          p.canh_bao_hieu_luc
          || (p.van_ban_lien_quan || []).some(laVanBanCu)
        );
        p._search = normText([p.tieu_de, p.slug, p.duong_dan, ...(p.tags || []), refs].join(' '));
      }
      wikiIndex._prepared = true;
    }
    if (!wikiChunks._prepared) {
      for (const c of wikiChunks.chunks || []) {
        const refs = (c.van_ban_lien_quan || []).map((v) => v.so_hieu).join(' ');
        c._hasExpiredRef = Boolean(
          c.canh_bao_hieu_luc
          || (c.van_ban_lien_quan || []).some(laVanBanCu)
        );
        c._titleSearch = normText([c.tieu_de, c.muc, ...(c.tags || []), refs].join(' '));
        c._bodySearch = normText(c.noi_dung);
      }
      wikiChunks._prepared = true;
    }
  }

  function renderVanBanLienQuan(refs) {
    if (!Array.isArray(refs) || !refs.length) return '';
    return `<div class="ref-list">${refs.map((vb) => {
      const isOld = laVanBanCu(vb);
      const cls = isOld ? 'ref-pill ref-pill-expired' : 'ref-pill';
      const u = safeUrl(vb.nguon_a);
      const thay = [...(vb.bi_thay_the_boi || []), ...(vb.bi_bai_bo_boi || [])];
      const oldHint = isOld
        ? (thay.length
          ? `<span class="badge badge-warn">Dẫn chiếu cũ → ${esc(thay.join(', '))}</span>`
          : `<span class="badge badge-warn">${vb.tinh_trang === 'TAM_NGUNG_HIEU_LUC' ? 'Văn bản đang tạm ngưng' : 'Dẫn chiếu văn bản hết hiệu lực'}</span>`)
        : '';
      const srcLink = u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">Nguồn A ↗</a>` : '';
      return `
        <span class="${cls}">
          <button type="button" class="btn-link" data-jump-doc="${esc(vb.so_hieu)}">${esc(vb.so_hieu)}</button>
          ${badgeTinhTrang(vb.tinh_trang)}
          ${oldHint}
          ${srcLink}
        </span>
      `;
    }).join('')}</div>`;
  }

  function renderTabWiki() {
    const wikiIndex = state.cache.wikiIndex;
    const wikiChunks = state.cache.wikiChunks;
    if (!wikiIndex || !wikiChunks) return;
    prepareWiki(wikiIndex, wikiChunks);

    const statsEl = document.getElementById('wiki-stats');
    const listEl = document.getElementById('wiki-list');
    const summaryEl = document.getElementById('wiki-summary');
    const pagerEl = document.getElementById('wiki-pager');
    const slugRow = document.getElementById('wiki-slug-filter');

    const pages = wikiIndex.trang || [];
    const chunks = wikiChunks.chunks || [];
    const warnCount = chunks.filter((c) => c.canh_bao_hieu_luc).length;

    statsEl.innerHTML = `
      <div class="stat-tile"><div class="stat-num">${fmtNum(pages.length)}</div><div class="stat-label">Trang Wiki</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(chunks.length)}</div><div class="stat-label">Đoạn trích mục</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(pages.filter((p) => p.loai_trang === 'summary').length)}</div><div class="stat-label">Trang tổng hợp</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(warnCount)}</div><div class="stat-label">Cảnh báo dẫn chiếu cũ</div></div>
    `;

    if (state.wiki.slugFilter) {
      const foundPage = pages.find((p) => p.slug === state.wiki.slugFilter);
      slugRow.classList.remove('hidden');
      slugRow.innerHTML = `
        <span>Đang xem các đoạn trích thuộc trang: <strong>${esc(foundPage?.tieu_de || state.wiki.slugFilter)}</strong></span>
        <button type="button" class="btn-small" id="wiki-clear-slug">Quay lại danh sách trang</button>
      `;
      document.getElementById('wiki-clear-slug')?.addEventListener('click', () => {
        state.wiki.slugFilter = '';
        state.wiki.page = 1;
        renderTabWiki();
      });
    } else {
      slugRow.classList.add('hidden');
      slugRow.innerHTML = '';
    }

    const qNorm = normText(state.wiki.q);
    const { loai, mode, onlyOld, slugFilter } = state.wiki;
    const effectiveMode = slugFilter ? 'chunks' : (mode === 'auto' ? (qNorm ? 'chunks' : 'pages') : mode);

    let items;
    if (effectiveMode === 'pages') {
      items = pages.filter((p) => {
        if (loai && p.loai_trang !== loai) return false;
        if (onlyOld && !p._hasExpiredRef) return false;
        if (qNorm && !p._search.includes(qNorm)) return false;
        return true;
      });
    } else {
      items = chunks.filter((c) => {
        if (slugFilter && c.slug !== slugFilter) return false;
        if (loai && c.loai_trang !== loai) return false;
        if (onlyOld && !c._hasExpiredRef) return false;
        if (qNorm && !c._titleSearch.includes(qNorm) && !c._bodySearch.includes(qNorm)) return false;
        return true;
      });
      if (qNorm) {
        items = [...items].sort((a, b) => {
          const aScore = a._titleSearch.includes(qNorm) ? 1 : 0;
          const bScore = b._titleSearch.includes(qNorm) ? 1 : 0;
          return bScore - aScore;
        });
      }
    }

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE.wiki));
    if (state.wiki.page > totalPages) state.wiki.page = totalPages;
    const start = (state.wiki.page - 1) * PAGE_SIZE.wiki;
    const slice = items.slice(start, start + PAGE_SIZE.wiki);

    const modeLabel = effectiveMode === 'pages' ? 'trang wiki' : 'đoạn trích';
    summaryEl.innerHTML = `<span>Tìm thấy <strong>${fmtNum(items.length)}</strong> ${modeLabel}</span>`
      + (items.length ? `<span>Hiển thị ${start + 1}–${Math.min(start + PAGE_SIZE.wiki, items.length)}</span>` : '');

    if (!slice.length) {
      listEl.innerHTML = '<div class="empty-state"><p>Không tìm thấy trang hoặc đoạn trích Wiki phù hợp.</p></div>';
      pagerEl.innerHTML = '';
      return;
    }

    if (effectiveMode === 'pages') {
      listEl.innerHTML = slice.map((p) => `
        <article class="card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="badge badge-pending">${esc(TEN_LOAI_WIKI[p.loai_trang] || p.loai_trang)}</span>
              ${p.confidence ? `<span class="badge badge-soft">Độ tin cậy: ${esc(p.confidence)}</span>` : ''}
            </div>
            <div class="card-badges">
              ${p.canh_bao_hieu_luc ? '<span class="badge badge-warn">⚠️ Có cảnh báo hiệu lực</span>' : ''}
              <button type="button" class="btn-small" data-open-slug="${esc(p.slug)}">Xem ${fmtNum(p.so_chunks)} đoạn trích</button>
            </div>
          </div>
          <h2 class="card-title">${esc(p.tieu_de)}</h2>
          <div class="meta-row">
            <span><code>${esc(p.duong_dan)}</code></span>
            ${p.updated ? `<span><strong>Cập nhật:</strong> ${esc(p.updated)}</span>` : ''}
          </div>
          ${(p.tags || []).length ? `<div class="tag-row">${p.tags.map((t) => `<span class="tag-chip">${esc(t)}</span>`).join('')}</div>` : ''}
          ${renderVanBanLienQuan(p.van_ban_lien_quan)}
        </article>
      `).join('');

      listEl.querySelectorAll('[data-open-slug]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.wiki.slugFilter = btn.getAttribute('data-open-slug');
          state.wiki.page = 1;
          renderTabWiki();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    } else {
      listEl.innerHTML = slice.map((c) => {
        const isExpanded = Boolean(state.wiki.expanded[c.chunk_id]);
        const bodyText = String(c.noi_dung || '');
        const isLong = bodyText.length > 650;
        const shownBody = !isLong || isExpanded ? bodyText : `${bodyText.slice(0, 650)}…`;
        const warnBanner = c.canh_bao_hieu_luc
          ? '<div class="notice notice-danger">⚠️ Cảnh báo hiệu lực: Đoạn trích có dẫn chiếu văn bản đã hết hiệu lực chưa rõ bối cảnh thay thế — cần đối chiếu lại văn bản hiện hành.</div>'
          : '';
        return `
          <article class="card">
            <div class="card-header">
              <div class="card-title-group">
                <span class="badge badge-pending">${esc(TEN_LOAI_WIKI[c.loai_trang] || c.loai_trang)}</span>
                <span class="badge badge-soft">${esc(c.chunk_id)}</span>
              </div>
              <div class="card-badges">
                ${c.canh_bao_hieu_luc ? '<span class="badge badge-warn">⚠️ Dẫn chiếu cũ</span>' : ''}
                ${!slugFilter ? `<button type="button" class="btn-small" data-open-slug="${esc(c.slug)}">Cả trang này</button>` : ''}
              </div>
            </div>
            <h2 class="card-title">${esc(c.tieu_de)}${c.muc ? ` — <span class="doc-code">${esc(c.muc)}</span>` : ''}</h2>
            <div class="meta-row"><span><code>${esc(c.duong_dan)}</code></span></div>
            ${warnBanner}
            <div class="wiki-body">${esc(shownBody)}</div>
            ${isLong ? `<button type="button" class="btn-small" data-toggle-chunk="${esc(c.chunk_id)}">${isExpanded ? 'Thu gọn' : 'Xem toàn bộ đoạn trích'}</button>` : ''}
            ${renderVanBanLienQuan(c.van_ban_lien_quan)}
          </article>
        `;
      }).join('');

      listEl.querySelectorAll('[data-open-slug]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.wiki.slugFilter = btn.getAttribute('data-open-slug');
          state.wiki.page = 1;
          renderTabWiki();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
      listEl.querySelectorAll('[data-toggle-chunk]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-toggle-chunk');
          state.wiki.expanded[id] = !state.wiki.expanded[id];
          renderTabWiki();
        });
      });
    }

    listEl.querySelectorAll('[data-jump-doc]').forEach((btn) => {
      btn.addEventListener('click', () => jumpToDoc(btn.getAttribute('data-jump-doc')));
    });

    renderPager(pagerEl, state.wiki.page, items.length, PAGE_SIZE.wiki, (p) => {
      state.wiki.page = p;
      renderTabWiki();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== TAB 3: ĐIỀU KHOẢN BẬC A ====================
  function prepareDieuKhoan(dk) {
    if (dk._prepared) return dk;
    const allDocs = [];

    for (const doc of dk.nguyen_van_nguon_a || []) {
      const items = doc.dieu_khoan || [];
      items.forEach((it) => {
        it._search = normText([
          it.dieu != null ? `dieu ${it.dieu}` : '',
          it.khoan != null ? `khoan ${it.khoan}` : '',
          it.diem != null ? `diem ${it.diem}` : '',
          it.noi_dung,
        ].join(' '));
      });
      allDocs.push({
        ...doc,
        _tier: 'NGUYEN_VAN_NGUON_A',
        _key: `A:${doc.slug || doc.so_hieu}`,
        _docSearch: normText([doc.so_hieu, doc.slug, doc.ten].join(' ')),
      });
    }

    for (const doc of dk.tom_tat_nhap || []) {
      const items = doc.dieu_khoan || [];
      items.forEach((it) => {
        it._search = normText([
          it.dieu,
          it.ten,
          it.tom_tat,
          ...(it.nghia_vu_xnk || []),
        ].join(' '));
      });
      allDocs.push({
        ...doc,
        _tier: 'TOM_TAT_NHAP',
        _key: `B:${doc.slug || doc.so_hieu}`,
        _docSearch: normText([doc.so_hieu, doc.slug].join(' ')),
      });
    }

    dk._allDocs = allDocs;
    dk._prepared = true;

    const selDoc = document.getElementById('dk-doc');
    if (selDoc && selDoc.options.length <= 1) {
      const grpA = document.createElement('optgroup');
      grpA.label = 'Tầng 1: Nguyên văn nguồn A (NGUYEN_VAN_NGUON_A)';
      for (const doc of allDocs.filter((d) => d._tier === 'NGUYEN_VAN_NGUON_A')) {
        const opt = document.createElement('option');
        opt.value = doc._key;
        opt.textContent = `${doc.so_hieu} (${(doc.dieu_khoan || []).length} mục)`;
        grpA.appendChild(opt);
      }
      const grpB = document.createElement('optgroup');
      grpB.label = 'Tầng 2: Tóm tắt nháp — chưa đối chiếu nguyên văn (TOM_TAT_NHAP)';
      for (const doc of allDocs.filter((d) => d._tier === 'TOM_TAT_NHAP')) {
        const opt = document.createElement('option');
        opt.value = doc._key;
        opt.textContent = `${doc.so_hieu || doc.slug} (${(doc.dieu_khoan || []).length} mục nháp)`;
        grpB.appendChild(opt);
      }
      selDoc.appendChild(grpA);
      selDoc.appendChild(grpB);
    }

    if (dk.canh_bao_tang_nhap) {
      const warnEl = document.getElementById('dk-warn-text');
      if (warnEl) warnEl.textContent = dk.canh_bao_tang_nhap;
    }

    return dk;
  }

  function renderDieuKhoanCard(doc, qNorm) {
    const isTierA = doc._tier === 'NGUYEN_VAN_NGUON_A';
    const items = doc.dieu_khoan || [];
    const matchedItems = qNorm && !doc._docSearch.includes(qNorm)
      ? items.filter((it) => it._search.includes(qNorm))
      : items;

    const expanded = Boolean(state.dk.expandedDocs[doc._key]);
    const cap = 12;
    const shown = expanded || matchedItems.length <= cap ? matchedItems : matchedItems.slice(0, cap);
    const nguonUrl = safeUrl(doc.nguon_a);

    const clausesHtml = shown.map((it) => {
      if (isTierA) {
        const parts = [`Điều ${it.dieu}`];
        if (it.khoan !== undefined && it.khoan !== null && it.khoan !== '') parts.push(`Khoản ${it.khoan}`);
        if (it.diem !== undefined && it.diem !== null && it.diem !== '') parts.push(`Điểm ${it.diem}`);
        const shaShort = it.sha256_pdf ? `${String(it.sha256_pdf).slice(0, 12)}…` : null;
        return `
          <div class="clause-item">
            <div class="clause-head">
              <span class="clause-cite">${esc(parts.join(' · '))}</span>
              <span class="clause-proof">
                ${it.trang_pdf != null ? `<span>Trang PDF: ${esc(it.trang_pdf)}</span>` : ''}
                ${shaShort ? `<span title="SHA-256 PDF: ${esc(it.sha256_pdf)}">SHA-256: ${esc(shaShort)}</span>` : ''}
              </span>
            </div>
            <div class="clause-text">${esc(it.noi_dung)}</div>
          </div>
        `;
      }

      const duties = (it.nghia_vu_xnk || []).length
        ? `<ul class="duty-list">${it.nghia_vu_xnk.map((nv) => `<li>${esc(nv)}</li>`).join('')}</ul>`
        : '';
      return `
        <div class="clause-item clause-item-draft">
          <div class="clause-head">
            <span class="clause-cite">${esc(it.dieu || 'Điều khoản')}${it.ten ? ` — ${esc(it.ten)}` : ''}</span>
            <span class="badge badge-tier-draft">Tóm tắt nháp · da_soat: false</span>
          </div>
          ${it.tom_tat ? `<div class="clause-text">${esc(it.tom_tat)}</div>` : ''}
          ${duties}
          ${it.nguon_trich ? `<div class="meta-row" style="margin-top:0.35rem;margin-bottom:0"><span>Nguồn trích nháp: <code>${esc(it.nguon_trich)}</code></span></div>` : ''}
        </div>
      `;
    }).join('');

    const showAllBtn = matchedItems.length > cap
      ? `<div style="margin-top:0.6rem"><button type="button" class="btn-small" data-expand-dk="${esc(doc._key)}">${expanded ? 'Thu gọn bớt' : `Hiện toàn bộ ${fmtNum(matchedItems.length)} điều khoản`}</button></div>`
      : '';

    return `
      <article class="card ${isTierA ? 'card-tier-a' : 'card-tier-draft'}">
        <div class="card-header">
          <div class="card-title-group">
            ${doc.so_hieu
              ? `<button type="button" class="btn-link doc-code" data-jump-doc="${esc(doc.so_hieu)}">${esc(doc.so_hieu)}</button>`
              : `<span class="doc-code">${esc(doc.slug)}</span>`}
            ${isTierA
              ? '<span class="badge badge-tier-a">NGUYEN_VAN_NGUON_A · Nguyên văn nguồn A</span>'
              : '<span class="badge badge-tier-draft">Tóm tắt nháp — chưa đối chiếu nguyên văn</span>'}
          </div>
          <div class="card-badges">
            ${doc.tinh_trang ? badgeTinhTrang(doc.tinh_trang) : ''}
            <span class="badge badge-soft">${fmtNum(matchedItems.length)} mục khớp</span>
          </div>
        </div>
        ${doc.ten ? `<h2 class="card-title">${esc(doc.ten)}</h2>` : ''}
        <div class="meta-row">
          ${doc.hieu_luc_tu ? `<span><strong>Hiệu lực từ:</strong> ${esc(doc.hieu_luc_tu)}</span>` : ''}
          ${doc.het_hieu_luc_tu ? `<span><strong>Hết hiệu lực từ:</strong> ${esc(doc.het_hieu_luc_tu)}</span>` : ''}
          ${nguonUrl ? `<a href="${esc(nguonUrl)}" target="_blank" rel="noopener noreferrer">Văn bản gốc nguồn A ↗</a>` : ''}
        </div>
        <div class="clause-list">${clausesHtml}</div>
        ${showAllBtn}
      </article>
    `;
  }

  function renderTabDieuKhoan() {
    const dk = state.cache.dieuKhoan;
    if (!dk) return;
    prepareDieuKhoan(dk);

    const statsEl = document.getElementById('dk-stats');
    const listEl = document.getElementById('dk-list');
    const summaryEl = document.getElementById('dk-summary');
    const pagerEl = document.getElementById('dk-pager');
    const tk = dk.thong_ke || {};

    statsEl.innerHTML = `
      <div class="stat-tile"><div class="stat-num">${fmtNum(tk.so_van_ban_nguon_a)}</div><div class="stat-label">VB nguyên văn nguồn A</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(tk.so_dieu_khoan_nguon_a)}</div><div class="stat-label">Điều khoản nguồn A</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(tk.so_van_ban_tom_tat_nhap)}</div><div class="stat-label">VB tóm tắt nháp</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(tk.so_dieu_khoan_tom_tat_nhap)}</div><div class="stat-label">Mục tóm tắt nháp</div></div>
    `;

    const qNorm = normText(state.dk.q);
    const { tier, docKey } = state.dk;

    const filtered = dk._allDocs.filter((doc) => {
      if (tier && doc._tier !== tier) return false;
      if (docKey && doc._key !== docKey) return false;
      if (qNorm) {
        const hitDoc = doc._docSearch.includes(qNorm);
        const hitClause = (doc.dieu_khoan || []).some((it) => it._search.includes(qNorm));
        if (!hitDoc && !hitClause) return false;
      }
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE.dk));
    if (state.dk.page > totalPages) state.dk.page = totalPages;
    const start = (state.dk.page - 1) * PAGE_SIZE.dk;
    const slice = filtered.slice(start, start + PAGE_SIZE.dk);

    summaryEl.innerHTML = `<span>Tìm thấy <strong>${fmtNum(filtered.length)}</strong> văn bản có điều khoản</span>`
      + (filtered.length ? `<span>Hiển thị ${start + 1}–${Math.min(start + PAGE_SIZE.dk, filtered.length)}</span>` : '');

    if (!slice.length) {
      listEl.innerHTML = '<div class="empty-state"><p>Không có điều khoản nào khớp tiêu chí tìm kiếm.</p></div>';
      pagerEl.innerHTML = '';
      return;
    }

    const tierASlice = slice.filter((d) => d._tier === 'NGUYEN_VAN_NGUON_A');
    const tierBSlice = slice.filter((d) => d._tier === 'TOM_TAT_NHAP');
    let html = '';

    if (tierASlice.length) {
      html += '<div class="tier-section-header tier-section-a"><span>Tầng 1: Nguyên văn nguồn bậc A (NGUYEN_VAN_NGUON_A)</span><span>Đã đối chiếu PDF / SHA-256</span></div>';
      html += tierASlice.map((d) => renderDieuKhoanCard(d, qNorm)).join('');
    }
    if (tierBSlice.length) {
      html += '<div class="tier-section-header tier-section-draft"><span>Tầng 2: Tóm tắt nháp — chưa đối chiếu nguyên văn (TOM_TAT_NHAP)</span><span>Chỉ dùng để định vị (da_soat: false)</span></div>';
      html += tierBSlice.map((d) => renderDieuKhoanCard(d, qNorm)).join('');
    }

    listEl.innerHTML = html;

    listEl.querySelectorAll('[data-expand-dk]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.getAttribute('data-expand-dk');
        state.dk.expandedDocs[k] = !state.dk.expandedDocs[k];
        renderTabDieuKhoan();
      });
    });
    listEl.querySelectorAll('[data-jump-doc]').forEach((btn) => {
      btn.addEventListener('click', () => jumpToDoc(btn.getAttribute('data-jump-doc')));
    });

    renderPager(pagerEl, state.dk.page, filtered.length, PAGE_SIZE.dk, (p) => {
      state.dk.page = p;
      renderTabDieuKhoan();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== TAB 4: HÓA CHẤT CAS (24/2026) ====================
  function prepareCas(casData) {
    if (casData._prepared) return casData;
    const rows = [];
    for (const [casCode, entries] of Object.entries(casData.theo_cas || {})) {
      for (const e of entries || []) {
        rows.push({ ...e, cas: e.cas || casCode, _hasCas: true });
      }
    }
    for (const e of casData.khong_co_cas || []) {
      rows.push({ ...e, cas: null, _hasCas: false });
    }

    rows.sort((a, b) => {
      const pa = THU_TU_PHU_LUC[a.phu_luc] || 99;
      const pb = THU_TU_PHU_LUC[b.phu_luc] || 99;
      if (pa !== pb) return pa - pb;
      const na = Number(a.so_thu_tu) || 999999;
      const nb = Number(b.so_thu_tu) || 999999;
      if (na !== nb) return na - nb;
      return String(a.ten_chat || '').localeCompare(String(b.ten_chat || ''), 'vi');
    });

    for (const r of rows) {
      r._search = normText([
        r.cas,
        r.ten_chat,
        r.ma_hoa_chat,
        r.ma_hs,
        r.cong_thuc,
        r.phan_loai,
        r.so_hieu,
        r.nhom,
      ].join(' '));
    }

    casData._rows = rows;
    casData._prepared = true;
    return casData;
  }

  function renderTabCas() {
    const casData = state.cache.casIndex;
    if (!casData) return;
    prepareCas(casData);

    const statsEl = document.getElementById('cas-stats');
    const listEl = document.getElementById('cas-list');
    const summaryEl = document.getElementById('cas-summary');
    const pagerEl = document.getElementById('cas-pager');
    const tk = casData.thong_ke || {};

    statsEl.innerHTML = `
      <button type="button" class="stat-tile stat-tile-btn" data-cas-quick="all">
        <div class="stat-num">${fmtNum(tk.tong_dong ?? casData._rows.length)}</div>
        <div class="stat-label">Tổng dòng danh mục</div>
      </button>
      <button type="button" class="stat-tile stat-tile-btn" data-cas-quick="co_cas">
        <div class="stat-num">${fmtNum(tk.so_ma_cas_duy_nhat)}</div>
        <div class="stat-label">Mã CAS duy nhất (${fmtNum(tk.so_dong_co_cas)} dòng)</div>
      </button>
      <button type="button" class="stat-tile stat-tile-btn" data-cas-quick="khong_co_cas">
        <div class="stat-num">${fmtNum(tk.so_dong_khong_co_cas ?? (casData.khong_co_cas || []).length)}</div>
        <div class="stat-label">Mục không có CAS (bấm để xem)</div>
      </button>
      <div class="stat-tile">
        <div class="stat-num">I – IV</div>
        <div class="stat-label">Phụ lục NĐ 24/2026/NĐ-CP</div>
      </div>
    `;
    statsEl.querySelectorAll('[data-cas-quick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.cas.casMode = btn.getAttribute('data-cas-quick');
        state.cas.page = 1;
        document.getElementById('cas-mode').value = state.cas.casMode;
        renderTabCas();
      });
    });

    const qNorm = normText(state.cas.q);
    const { phuLuc, casMode } = state.cas;

    const filtered = casData._rows.filter((r) => {
      if (phuLuc && r.phu_luc !== phuLuc) return false;
      if (casMode === 'co_cas' && !r._hasCas) return false;
      if (casMode === 'khong_co_cas' && r._hasCas) return false;
      if (qNorm && !r._search.includes(qNorm)) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE.cas));
    if (state.cas.page > totalPages) state.cas.page = totalPages;
    const start = (state.cas.page - 1) * PAGE_SIZE.cas;
    const slice = filtered.slice(start, start + PAGE_SIZE.cas);

    summaryEl.innerHTML = `<span>Tìm thấy <strong>${fmtNum(filtered.length)}</strong> dòng hóa chất</span>`
      + (filtered.length ? `<span>Hiển thị ${start + 1}–${Math.min(start + PAGE_SIZE.cas, filtered.length)}</span>` : '');

    if (!slice.length) {
      listEl.innerHTML = '<div class="empty-state"><p>Không tìm thấy hóa chất nào khớp điều kiện tra cứu.</p></div>';
      pagerEl.innerHTML = '';
      return;
    }

    const rowsHtml = slice.map((r) => {
      const casCell = r.cas
        ? `<span class="cas-code">${esc(r.cas)}</span>`
        : '<span class="badge badge-unknown">Không có CAS</span>';
      const plParts = [`PL ${esc(r.phu_luc || '—')}`];
      if (r.muc) plParts.push(`Mục ${esc(r.muc)}`);
      if (r.nhom) plParts.push(`Nhóm ${esc(r.nhom)}`);
      if (r.so_thu_tu) plParts.push(`STT ${esc(r.so_thu_tu)}`);

      const nguonA = safeUrl(r.nguon_a);
      const parsedNguon = tachUrlVaGhiChu(r.nguon);
      const linkNguon = parsedNguon.url
        ? `<a href="${esc(parsedNguon.url)}" target="_blank" rel="noopener noreferrer">Công báo ↗</a>`
        : (nguonA ? `<a href="${esc(nguonA)}" target="_blank" rel="noopener noreferrer">Nguồn A ↗</a>` : '');

      return `
        <tr>
          <td>${casCell}</td>
          <td>
            <div><strong>${esc(r.ten_chat)}</strong></div>
            ${r.ma_hoa_chat ? `<div class="text-soft">${esc(r.ma_hoa_chat)}</div>` : ''}
            ${r.ma_hs ? `<div class="text-soft">HS: <code>${esc(r.ma_hs)}</code></div>` : ''}
          </td>
          <td>${r.cong_thuc ? `<code>${esc(r.cong_thuc)}</code>` : '—'}</td>
          <td>
            <div><strong>${plParts.join(' · ')}</strong></div>
            <div>${esc(r.phan_loai || '')}</div>
            ${r.nguong_kg ? `<div class="badge badge-partial" style="margin-top:0.25rem">Ngưỡng: ${esc(r.nguong_kg)} kg</div>` : ''}
          </td>
          <td>
            ${r.so_hieu ? `<button type="button" class="btn-link" data-jump-doc="${esc(r.so_hieu)}">${esc(r.so_hieu)}</button>` : '—'}
            <div>${r.tinh_trang ? badgeTinhTrang(r.tinh_trang) : ''}</div>
            <div>${linkNguon}</div>
          </td>
        </tr>
      `;
    }).join('');

    listEl.innerHTML = `
      <div class="table-wrap">
        <table class="cas-table">
          <thead>
            <tr>
              <th>Mã CAS</th>
              <th>Tên chất / Danh pháp IUPAC</th>
              <th>Công thức</th>
              <th>Phụ lục &amp; Phân loại</th>
              <th>Văn bản &amp; Nguồn</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    listEl.querySelectorAll('[data-jump-doc]').forEach((btn) => {
      btn.addEventListener('click', () => jumpToDoc(btn.getAttribute('data-jump-doc')));
    });

    renderPager(pagerEl, state.cas.page, filtered.length, PAGE_SIZE.cas, (p) => {
      state.cas.page = p;
      renderTabCas();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== ĐIỀU PHỐI TAB & SỰ KIỆN ====================
  async function ensureTabLoaded(tabName) {
    showGlobalAlert('');
    if (tabName === 'hieu-luc') {
      if (!state.cache.registry) {
        document.getElementById('reg-list').innerHTML = '<div class="loading-box">Đang tải danh mục văn bản…</div>';
        await fetchJson('registry', 'data/registry.json');
      }
      renderTabRegistry();
    } else if (tabName === 'wiki') {
      if (!state.cache.wikiIndex || !state.cache.wikiChunks) {
        document.getElementById('wiki-list').innerHTML = '<div class="loading-box">Đang tải dữ liệu Wiki &amp; các đoạn trích…</div>';
        await Promise.all([
          fetchJson('wikiIndex', 'data/wiki-index.json'),
          fetchJson('wikiChunks', 'data/wiki-chunks.json'),
        ]);
      }
      renderTabWiki();
    } else if (tabName === 'dieu-khoan') {
      if (!state.cache.dieuKhoan) {
        document.getElementById('dk-list').innerHTML = '<div class="loading-box">Đang tải điều khoản bậc A &amp; tóm tắt nháp…</div>';
        await fetchJson('dieuKhoan', 'data/dieu-khoan.json');
      }
      renderTabDieuKhoan();
    } else if (tabName === 'cas') {
      if (!state.cache.casIndex) {
        document.getElementById('cas-list').innerHTML = '<div class="loading-box">Đang tải danh mục hóa chất CAS (NĐ 24/2026)…</div>';
        await fetchJson('casIndex', 'data/cas-index.json');
      }
      renderTabCas();
    }
  }

  function activateTab(tabName) {
    const valid = ['hieu-luc', 'wiki', 'dieu-khoan', 'cas'];
    const target = valid.includes(tabName) ? tabName : 'hieu-luc';
    state.activeTab = target;

    document.querySelectorAll('.tab-btn').forEach((btn) => {
      const active = btn.getAttribute('data-tab') === target;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    document.querySelectorAll('.tab-panel').forEach((panel) => {
      const active = panel.id === `panel-${target}`;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });

    if (window.location.hash !== `#${target}`) {
      history.replaceState(null, '', `#${target}`);
    }

    ensureTabLoaded(target).catch((err) => {
      showGlobalAlert(thongBaoLoiTaiDuLieu(err));
    });
  }

  function bindControls() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => activateTab(btn.getAttribute('data-tab')));
    });

    // Tab 1 controls
    document.getElementById('reg-q')?.addEventListener('input', (e) => {
      state.reg.q = e.target.value;
      state.reg.highlightDoc = '';
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-tinh-trang')?.addEventListener('change', (e) => {
      state.reg.tinhTrang = e.target.value;
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-muc')?.addEventListener('change', (e) => {
      state.reg.muc = e.target.value;
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-loai')?.addEventListener('change', (e) => {
      state.reg.loai = e.target.value;
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-nhanh')?.addEventListener('change', (e) => {
      state.reg.nhanh = e.target.value;
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-only-rel')?.addEventListener('change', (e) => {
      state.reg.onlyRel = e.target.checked;
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-reset')?.addEventListener('click', () => {
      state.reg = { q: '', tinhTrang: '', muc: '', loai: '', nhanh: '', onlyRel: false, page: 1, highlightDoc: '' };
      document.getElementById('reg-q').value = '';
      document.getElementById('reg-tinh-trang').value = '';
      document.getElementById('reg-muc').value = '';
      document.getElementById('reg-loai').value = '';
      document.getElementById('reg-nhanh').value = '';
      document.getElementById('reg-only-rel').checked = false;
      renderTabRegistry();
    });

    // Tab 2 controls
    document.getElementById('wiki-q')?.addEventListener('input', (e) => {
      state.wiki.q = e.target.value;
      state.wiki.page = 1;
      renderTabWiki();
    });
    document.getElementById('wiki-loai')?.addEventListener('change', (e) => {
      state.wiki.loai = e.target.value;
      state.wiki.page = 1;
      renderTabWiki();
    });
    document.getElementById('wiki-mode')?.addEventListener('change', (e) => {
      state.wiki.mode = e.target.value;
      state.wiki.page = 1;
      renderTabWiki();
    });
    document.getElementById('wiki-only-old')?.addEventListener('change', (e) => {
      state.wiki.onlyOld = e.target.checked;
      state.wiki.page = 1;
      renderTabWiki();
    });
    document.getElementById('wiki-reset')?.addEventListener('click', () => {
      state.wiki = { q: '', loai: '', mode: 'auto', onlyOld: false, slugFilter: '', page: 1, expanded: {} };
      document.getElementById('wiki-q').value = '';
      document.getElementById('wiki-loai').value = '';
      document.getElementById('wiki-mode').value = 'auto';
      document.getElementById('wiki-only-old').checked = false;
      renderTabWiki();
    });

    // Tab 3 controls
    document.getElementById('dk-q')?.addEventListener('input', (e) => {
      state.dk.q = e.target.value;
      state.dk.page = 1;
      renderTabDieuKhoan();
    });
    document.getElementById('dk-tier')?.addEventListener('change', (e) => {
      state.dk.tier = e.target.value;
      state.dk.page = 1;
      renderTabDieuKhoan();
    });
    document.getElementById('dk-doc')?.addEventListener('change', (e) => {
      state.dk.docKey = e.target.value;
      state.dk.page = 1;
      renderTabDieuKhoan();
    });
    document.getElementById('dk-reset')?.addEventListener('click', () => {
      state.dk = { q: '', tier: '', docKey: '', page: 1, expandedDocs: {} };
      document.getElementById('dk-q').value = '';
      document.getElementById('dk-tier').value = '';
      document.getElementById('dk-doc').value = '';
      renderTabDieuKhoan();
    });

    // Tab 4 controls
    document.getElementById('cas-q')?.addEventListener('input', (e) => {
      state.cas.q = e.target.value;
      state.cas.page = 1;
      renderTabCas();
    });
    document.getElementById('cas-phu-luc')?.addEventListener('change', (e) => {
      state.cas.phuLuc = e.target.value;
      state.cas.page = 1;
      renderTabCas();
    });
    document.getElementById('cas-mode')?.addEventListener('change', (e) => {
      state.cas.casMode = e.target.value;
      state.cas.page = 1;
      renderTabCas();
    });
    document.getElementById('cas-reset')?.addEventListener('click', () => {
      state.cas = { q: '', phuLuc: '', casMode: 'all', page: 1 };
      document.getElementById('cas-q').value = '';
      document.getElementById('cas-phu-luc').value = '';
      document.getElementById('cas-mode').value = 'all';
      renderTabCas();
    });

    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace(/^#/, '');
      if (h && h !== state.activeTab) activateTab(h);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindControls();
    const initialTab = window.location.hash.replace(/^#/, '') || 'hieu-luc';
    activateTab(initialTab);
  });
})();
