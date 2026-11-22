/* oz-wiki-plhq | schema: v{{LUOC_DO_PHIEN_BAN}} | data: {{PHIEN_BAN}} | built: {{THOI_DIEM_DUNG}} */
(function () {
  'use strict';

  const PAGE_SIZE = {
    reg: 25,
    wiki: 20,
    dk: 10,
    cas: 50,
    hs: 15,
  };

  const VALID_TABS = ['hieu-luc', 'wiki', 'dieu-khoan', 'cas', 'chinh-sach-hs'];
  const GHI_NGUON_CC_BY = 'Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0).';

  const TEN_LOAI_TAC_DONG = {
    GIAY_PHEP: 'Giấy phép',
    KIEM_TRA_CHAT_LUONG: 'Kiểm tra chất lượng',
    CONG_BO_HOP_QUY: 'Công bố hợp quy',
    KIEM_DICH_THUC_VAT: 'Kiểm dịch thực vật',
    KIEM_DICH_DONG_VAT: 'Kiểm dịch động vật',
    KIEM_TRA_ATTP: 'Kiểm tra ATTP',
    DANG_KY_LUU_HANH: 'Đăng ký lưu hành',
    CAT_GIAM_KIEM_TRA: 'Cắt giảm kiểm tra',
    CAM_NHAP_KHAU: 'Cấm nhập khẩu',
    CAM_XUAT_KHAU: 'Cấm xuất khẩu',
    KHAC: 'Khác / Chuyên ngành',
  };

  const TEN_MUC_RUI_RO = {
    CAO: 'Rủi ro cao',
    TRUNG_BINH: 'Rủi ro trung bình',
    THAP: 'Rủi ro thấp',
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
    lastCopiedText: '',
    toastTimer: null,
    reg: {
      q: '',
      tinhTrang: '',
      muc: '',
      loai: '',
      nhanh: '',
      onlyRel: false,
      onlyExpiring: false,
      page: 1,
      highlightDoc: '',
      highlightSlug: '',
      pendingSlug: '',
      missingSlug: '',
    },
    wiki: { q: '', loai: '', mode: 'auto', onlyOld: false, slugFilter: '', page: 1, expanded: {} },
    dk: { q: '', tier: '', docKey: '', dieuFilter: '', pendingRoute: null, missingRoute: null, page: 1, expandedDocs: {} },
    cas: { q: '', phuLuc: '', casMode: 'all', page: 1 },
    hs: { q: '', tinhTrang: '', loaiTacDong: '', page: 1 },
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

  function fmtDateVi(iso) {
    const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : String(iso || '');
  }

  function decodeSafe(raw) {
    const s = String(raw || '');
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  }

  function setUrlHash(hashStr, push = false) {
    const target = `#${String(hashStr || '').replace(/^#/, '')}`;
    if (window.location.hash === target) return;
    if (typeof history !== 'undefined') {
      if (push && typeof history.pushState === 'function') {
        history.pushState(null, '', target);
        return;
      }
      if (typeof history.replaceState === 'function') {
        history.replaceState(null, '', target);
        return;
      }
    }
    window.location.hash = target;
  }

  function buildDeepLink(hashFragment) {
    const cleanHash = String(hashFragment || '').replace(/^#/, '');
    const href = String(window.location.href || '');
    const base = href.split('#')[0];
    return base ? `${base}#${cleanHash}` : `#${cleanHash}`;
  }

  function showCopyToast(message) {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.hidden = false;
    if (state.toastTimer) clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
      toast.hidden = true;
    }, 2200);
  }

  async function copyTextToClipboard(text, btnEl, defaultLabel, toastMsg) {
    state.lastCopiedText = text;
    let copied = false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied && typeof document !== 'undefined' && document.body && typeof document.execCommand === 'function') {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        copied = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        copied = false;
      }
    }

    if (btnEl) {
      btnEl.textContent = '✓ Đã sao chép';
      btnEl.classList.add('btn-copied');
      setTimeout(() => {
        btnEl.textContent = defaultLabel;
        btnEl.classList.remove('btn-copied');
      }, 1800);
    }
    showCopyToast(toastMsg || (copied ? 'Đã sao chép vào khay nhớ tạm.' : 'Đã chuẩn bị nội dung sao chép.'));
  }

  function taoTrichDanPhapLy(doc, it) {
    const rawDieu = it?.dieu != null ? String(it.dieu).trim() : '';
    const dieuStr = rawDieu
      ? (/^điều\b/i.test(rawDieu) ? rawDieu : `Điều ${rawDieu}`)
      : '';
    const khoanStr = it?.khoan !== undefined && it?.khoan !== null && it?.khoan !== ''
      ? `khoản ${it.khoan}`
      : '';
    const diemStr = it?.diem !== undefined && it?.diem !== null && it?.diem !== ''
      ? `điểm ${it.diem}`
      : '';
    const viTri = [dieuStr, khoanStr, diemStr].filter(Boolean).join(' ');
    const soHieu = doc?.so_hieu || doc?.slug || '';
    const proof = ['nguồn A'];
    if (it?.trang_pdf !== undefined && it?.trang_pdf !== null && it?.trang_pdf !== '') {
      proof.push(`trang PDF ${it.trang_pdf}`);
    }
    if (it?.sha256_pdf) {
      proof.push(`SHA-256 ${it.sha256_pdf}`);
    }
    const noiDung = String(it?.noi_dung || '').trim();
    const head = [viTri, soHieu].filter(Boolean).join(' ');
    return `${head} (${proof.join(', ')}): "${noiDung}" — ${GHI_NGUON_CC_BY}`;
  }

  function bindCardActions(containerEl) {
    if (!containerEl) return;
    containerEl.querySelectorAll('[data-jump-vb]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-jump-vb');
        const soHieu = btn.getAttribute('data-so-hieu') || '';
        if (slug) {
          applyHashRoute(`#vb=${encodeURIComponent(slug)}`, { updateHash: true, push: true });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (soHieu) {
          jumpToDoc(soHieu);
        }
      });
    });
    containerEl.querySelectorAll('[data-jump-doc]').forEach((btn) => {
      btn.addEventListener('click', () => jumpToDoc(btn.getAttribute('data-jump-doc')));
    });
    containerEl.querySelectorAll('[data-copy-link]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const hash = btn.getAttribute('data-copy-link') || '';
        const url = buildDeepLink(hash);
        copyTextToClipboard(url, btn, '🔗 Sao chép liên kết', `Đã sao chép liên kết ${hash}`);
      });
    });
    containerEl.querySelectorAll('[data-cite-doc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const docKey = btn.getAttribute('data-cite-doc');
        const idx = Number(btn.getAttribute('data-cite-idx'));
        const doc = state.cache.dieuKhoan?._byKey?.get(docKey);
        const it = doc?.dieu_khoan?.[idx];
        if (!doc || !it) return;
        const citation = taoTrichDanPhapLy(doc, it);
        copyTextToClipboard(
          citation,
          btn,
          '📋 Sao chép trích dẫn chuẩn pháp lý',
          'Đã sao chép trích dẫn chuẩn pháp lý (CC BY 4.0).'
        );
      });
    });
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

  function syncRegControls() {
    const map = {
      'reg-q': state.reg.q,
      'reg-tinh-trang': state.reg.tinhTrang,
      'reg-muc': state.reg.muc,
      'reg-loai': state.reg.loai,
      'reg-nhanh': state.reg.nhanh,
    };
    for (const [id, val] of Object.entries(map)) {
      const el = document.getElementById(id);
      if (el) el.value = val;
    }
    const relEl = document.getElementById('reg-only-rel');
    if (relEl) relEl.checked = Boolean(state.reg.onlyRel);
    const expEl = document.getElementById('reg-only-expiring');
    if (expEl) expEl.checked = Boolean(state.reg.onlyExpiring);
  }

  function jumpToDoc(soHieu) {
    if (!soHieu) return;
    const matched = state.cache.registry?._byKey?.get(normDocNo(soHieu));
    state.reg.q = matched?.so_hieu || soHieu;
    state.reg.tinhTrang = '';
    state.reg.muc = '';
    state.reg.loai = '';
    state.reg.nhanh = '';
    state.reg.onlyRel = false;
    state.reg.onlyExpiring = false;
    state.reg.page = 1;
    state.reg.highlightDoc = normDocNo(matched?.so_hieu || soHieu);
    state.reg.highlightSlug = matched?.slug || '';
    state.reg.pendingSlug = '';
    state.reg.missingSlug = '';

    syncRegControls();
    const targetHash = matched?.slug ? `#vb=${encodeURIComponent(matched.slug)}` : '#tab=hieu-luc';
    activateTab('hieu-luc', { updateHash: true, hashStr: targetHash, push: Boolean(matched?.slug) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==================== CẢNH BÁO SẮP HẾT HIỆU LỰC ====================
  function prepareSapHetHieuLuc(data) {
    if (!data || data._prepared) return data;
    const bySlug = new Map();
    const byDocKey = new Map();
    for (const item of data.danh_sach || []) {
      if (item.slug) bySlug.set(item.slug, item);
      if (item.so_hieu) byDocKey.set(normDocNo(item.so_hieu), item);
    }
    data._bySlug = bySlug;
    data._byDocKey = byDocKey;
    data._prepared = true;
    return data;
  }

  function renderExpiryRibbon() {
    const ribbon = document.getElementById('expiry-ribbon');
    const btn = document.getElementById('expiry-ribbon-btn');
    if (!ribbon || !btn) return;
    const data = state.cache.sapHetHieuLuc;
    const list = Array.isArray(data?.danh_sach) ? data.danh_sach : [];
    const tong = Number(data?.tong ?? list.length) || 0;
    const daysWindow = Number(data?.trong_so_ngay || 60);
    if (tong > 0 && list.length > 0) {
      btn.textContent = `⚠️ ${tong} văn bản sắp hết hiệu lực trong ${daysWindow} ngày tới — Xem danh sách`;
      ribbon.classList.remove('hidden');
      ribbon.hidden = false;
    } else {
      btn.textContent = '';
      ribbon.classList.add('hidden');
      ribbon.hidden = true;
    }
  }

  async function loadSapHetHieuLuc() {
    if (state.cache.sapHetHieuLuc !== undefined) return state.cache.sapHetHieuLuc;
    try {
      const data = await fetchJson('sapHetHieuLuc', 'data/sap-het-hieu-luc.json');
      prepareSapHetHieuLuc(data);
      renderExpiryRibbon();
      return data;
    } catch {
      state.cache.sapHetHieuLuc = null;
      renderExpiryRibbon();
      return null;
    }
  }

  function openExpiringFilter() {
    state.reg = {
      q: '',
      tinhTrang: '',
      muc: '',
      loai: '',
      nhanh: '',
      onlyRel: false,
      onlyExpiring: true,
      page: 1,
      highlightDoc: '',
      highlightSlug: '',
      pendingSlug: '',
      missingSlug: '',
    };
    syncRegControls();
    activateTab('hieu-luc', { updateHash: true, hashStr: '#tab=hieu-luc', push: true });
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
    const chipEl = document.getElementById('reg-active-filter');

    const raw = state.cache.registry;
    if (!raw) return;
    prepareRegistry(raw);
    const docs = raw.van_ban || [];

    if (state.reg.pendingSlug) {
      const targetSlug = state.reg.pendingSlug;
      const targetDocKey = normDocNo(targetSlug);
      const found = docs.find((d) =>
        d.slug === targetSlug
        || d._docKey === targetDocKey
        || (d._altKeys || []).includes(targetDocKey)
      );
      state.reg.pendingSlug = '';
      if (found) {
        state.reg.q = found.so_hieu;
        state.reg.highlightSlug = found.slug || targetSlug;
        state.reg.highlightDoc = found._docKey;
        state.reg.missingSlug = '';
        syncRegControls();
      } else {
        state.reg.missingSlug = targetSlug;
        state.reg.highlightSlug = '';
        state.reg.highlightDoc = '';
      }
    }

    const expData = state.cache.sapHetHieuLuc;
    if (expData) prepareSapHetHieuLuc(expData);
    const getExp = (d) => {
      if (!expData) return null;
      return (d.slug && expData._bySlug?.get(d.slug)) || expData._byDocKey?.get(d._docKey) || null;
    };

    const total = docs.length;
    const conHL = docs.filter((d) => d.tinh_trang === 'CON_HIEU_LUC').length;
    const hetHL = docs.filter((d) => d.tinh_trang === 'HET_HIEU_LUC').length;
    const sapHetHL = expData
      ? docs.filter((d) => Boolean(getExp(d))).length || (expData.danh_sach || []).length
      : 0;
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
      <button type="button" class="stat-tile stat-tile-btn" data-reg-quick="SAP_HET_HIEU_LUC">
        <div class="stat-num">${fmtNum(sapHetHL)}</div>
        <div class="stat-label">Sắp hết HL (≤60 ngày)</div>
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
        state.reg.missingSlug = '';
        state.reg.highlightSlug = '';
        if (mode === 'all') {
          state.reg.tinhTrang = '';
          state.reg.muc = '';
          state.reg.onlyExpiring = false;
        } else if (mode === 'NGUON_A') {
          state.reg.muc = 'NGUON_A';
        } else if (mode === 'SAP_HET_HIEU_LUC') {
          state.reg.tinhTrang = '';
          state.reg.onlyExpiring = true;
        } else {
          state.reg.onlyExpiring = false;
          state.reg.tinhTrang = mode;
        }
        syncRegControls();
        renderTabRegistry();
      });
    });

    if (chipEl) {
      if (state.reg.highlightSlug && !state.reg.missingSlug) {
        chipEl.classList.remove('hidden');
        chipEl.hidden = false;
        chipEl.innerHTML = `
          <span>Đang mở theo liên kết trực tiếp: <strong>${esc(state.reg.q || state.reg.highlightSlug)}</strong></span>
          <button type="button" class="btn-small" id="reg-clear-deeplink">Xem toàn bộ danh sách</button>
        `;
        document.getElementById('reg-clear-deeplink')?.addEventListener('click', () => {
          state.reg.q = '';
          state.reg.highlightDoc = '';
          state.reg.highlightSlug = '';
          state.reg.missingSlug = '';
          state.reg.page = 1;
          syncRegControls();
          setUrlHash('#tab=hieu-luc');
          renderTabRegistry();
        });
      } else {
        chipEl.classList.add('hidden');
        chipEl.hidden = true;
        chipEl.innerHTML = '';
      }
    }

    const qNorm = normText(state.reg.q);
    const qDoc = normDocNo(state.reg.q);
    const { tinhTrang, muc, loai, nhanh, onlyRel, onlyExpiring } = state.reg;

    let filtered = state.reg.missingSlug ? [] : docs.filter((d) => {
      if (tinhTrang && d.tinh_trang !== tinhTrang) return false;
      if (muc && (d.xac_minh?.muc || 'CHUA_XAC_MINH') !== muc) return false;
      if (loai === '__VBQPPL__' && d.loai === 'THONG_BAO') return false;
      if (loai && loai !== '__VBQPPL__' && d.loai !== loai) return false;
      if (nhanh && !(d.nhanh || []).some((n) => n === nhanh || n.startsWith(`${nhanh}/`))) return false;
      if (onlyRel && !d._hasRel) return false;
      if (onlyExpiring && !getExp(d)) return false;
      if (qNorm) {
        const matchSearch = d._search.includes(qNorm)
          || (qDoc && (d._docKey.includes(qDoc) || d._altKeys.some((k) => k.includes(qDoc))));
        if (!matchSearch) return false;
      }
      return true;
    });

    if (state.reg.highlightSlug || qDoc) {
      const targetSlug = state.reg.highlightSlug;
      filtered = [...filtered].sort((a, b) => {
        const aSlug = targetSlug && a.slug === targetSlug ? 4 : 0;
        const bSlug = targetSlug && b.slug === targetSlug ? 4 : 0;
        const aExact = aSlug || (qDoc && (a._docKey === qDoc || a._altKeys.includes(qDoc)) ? 2 : qDoc && a._docKey.startsWith(qDoc) ? 1 : 0);
        const bExact = bSlug || (qDoc && (b._docKey === qDoc || b._altKeys.includes(qDoc)) ? 2 : qDoc && b._docKey.startsWith(qDoc) ? 1 : 0);
        return bExact - aExact;
      });
    } else if (onlyExpiring) {
      filtered = [...filtered].sort((a, b) => {
        const da = getExp(a)?.so_ngay_con_lai ?? 9999;
        const db = getExp(b)?.so_ngay_con_lai ?? 9999;
        if (da !== db) return da - db;
        return String(a.so_hieu || '').localeCompare(String(b.so_hieu || ''), 'vi');
      });
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE.reg));
    if (state.reg.page > totalPages) state.reg.page = totalPages;
    const start = (state.reg.page - 1) * PAGE_SIZE.reg;
    const slice = filtered.slice(start, start + PAGE_SIZE.reg);

    summaryEl.innerHTML = `<span>Tìm thấy <strong>${fmtNum(filtered.length)}</strong> / ${fmtNum(total)} văn bản</span>`
      + (filtered.length ? `<span>Hiển thị ${start + 1}–${Math.min(start + PAGE_SIZE.reg, filtered.length)}</span>` : '');

    if (!slice.length) {
      let missingNotice = '<p>Không có văn bản nào khớp điều kiện lọc hiện tại. Thử xóa bớt bộ lọc hoặc đổi từ khóa.</p>';
      if (state.reg.missingSlug) {
        missingNotice = `<p>Không tìm thấy văn bản có mã <code>${esc(state.reg.missingSlug)}</code> trong sổ đăng ký.</p>`;
      } else if (state.reg.highlightDoc) {
        missingNotice = `<p>Văn bản <code>${esc(state.reg.q)}</code> chưa có bản ghi riêng trong sổ đăng ký (hoặc đang bị ẩn bởi bộ lọc).</p>`;
      }
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
      const expInfo = getExp(d);
      const expBadge = expInfo
        ? `<span class="badge badge-expiring" title="Hết hiệu lực từ ${esc(expInfo.het_hieu_luc_tu || d.het_hieu_luc_tu)}">⏳ Còn ${fmtNum(expInfo.so_ngay_con_lai)} ngày (${esc(fmtDateVi(expInfo.het_hieu_luc_tu || d.het_hieu_luc_tu))})</span>`
        : '';
      const isHighlight = Boolean(
        (state.reg.highlightSlug && d.slug === state.reg.highlightSlug)
        || (state.reg.highlightDoc && d._docKey === state.reg.highlightDoc)
      );
      const vbHash = `#vb=${encodeURIComponent(d.slug || d.so_hieu)}`;

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
        <article class="card${isHighlight ? ' card-highlight' : ''}">
          <div class="card-header">
            <div class="card-title-group">
              <span class="doc-code">${esc(d.so_hieu)}</span>
              <span class="badge badge-soft">${esc(TEN_LOAI_VB[d.loai] || d.loai || 'Văn bản')}</span>
            </div>
            <div class="card-badges">
              ${badgeTinhTrang(d.tinh_trang)}
              ${expBadge}
              ${badgeMucXacMinh(d.xac_minh?.muc)}
              ${doiChieu}
              <button type="button" class="btn-small btn-copy" data-copy-link="${esc(vbHash)}">🔗 Sao chép liên kết</button>
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

    bindCardActions(listEl);

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
      slugRow.hidden = false;
      slugRow.innerHTML = `
        <span>Đang xem các đoạn trích thuộc trang: <strong>${esc(foundPage?.tieu_de || state.wiki.slugFilter)}</strong></span>
        <button type="button" class="btn-small" id="wiki-clear-slug">Quay lại danh sách trang</button>
      `;
      document.getElementById('wiki-clear-slug')?.addEventListener('click', () => {
        state.wiki.slugFilter = '';
        state.wiki.page = 1;
        setUrlHash('#tab=wiki');
        renderTabWiki();
      });
    } else {
      slugRow.classList.add('hidden');
      slugRow.hidden = true;
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
      listEl.innerHTML = slice.map((p) => {
        const wikiHash = `#wiki=${encodeURIComponent(p.slug)}`;
        return `
        <article class="card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="badge badge-pending">${esc(TEN_LOAI_WIKI[p.loai_trang] || p.loai_trang)}</span>
              ${p.confidence ? `<span class="badge badge-soft">Độ tin cậy: ${esc(p.confidence)}</span>` : ''}
            </div>
            <div class="card-badges">
              ${p.canh_bao_hieu_luc ? '<span class="badge badge-warn">⚠️ Có cảnh báo hiệu lực</span>' : ''}
              <button type="button" class="btn-small" data-open-slug="${esc(p.slug)}">Xem ${fmtNum(p.so_chunks)} đoạn trích</button>
              <button type="button" class="btn-small btn-copy" data-copy-link="${esc(wikiHash)}">🔗 Sao chép liên kết</button>
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
      `;
      }).join('');

      listEl.querySelectorAll('[data-open-slug]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.wiki.slugFilter = btn.getAttribute('data-open-slug');
          state.wiki.page = 1;
          setUrlHash(`#wiki=${encodeURIComponent(state.wiki.slugFilter)}`, true);
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
        const wikiHash = `#wiki=${encodeURIComponent(c.slug)}`;
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
                <button type="button" class="btn-small btn-copy" data-copy-link="${esc(wikiHash)}">🔗 Sao chép liên kết</button>
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
          setUrlHash(`#wiki=${encodeURIComponent(state.wiki.slugFilter)}`, true);
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

    bindCardActions(listEl);

    renderPager(pagerEl, state.wiki.page, items.length, PAGE_SIZE.wiki, (p) => {
      state.wiki.page = p;
      renderTabWiki();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== TAB 3: ĐIỀU KHOẢN BẬC A ====================
  function matchDieuValue(rawDieu, targetDieu) {
    const clean = (v) => normText(String(v ?? '')).replace(/^dieu\s*/, '').replace(/[.:]+$/, '').trim();
    const a = clean(rawDieu);
    const b = clean(targetDieu);
    if (!b) return true;
    return a === b || a.startsWith(`${b} `) || a.startsWith(`${b}.`);
  }

  function extractDieuParam(rawDieu) {
    const s = String(rawDieu ?? '').trim();
    const m = s.match(/^điều\s+([^\s.:]+)/i);
    if (m) return m[1];
    return s;
  }

  function prepareDieuKhoan(dk) {
    if (dk._prepared) return dk;
    const allDocs = [];
    const byKey = new Map();

    for (const doc of dk.nguyen_van_nguon_a || []) {
      const items = doc.dieu_khoan || [];
      items.forEach((it, idx) => {
        it._idx = idx;
        it._search = normText([
          it.dieu != null ? `dieu ${it.dieu}` : '',
          it.khoan != null ? `khoan ${it.khoan}` : '',
          it.diem != null ? `diem ${it.diem}` : '',
          it.noi_dung,
        ].join(' '));
      });
      const wrapped = {
        ...doc,
        _tier: 'NGUYEN_VAN_NGUON_A',
        _key: `A:${doc.slug || doc.so_hieu}`,
        _docSearch: normText([doc.so_hieu, doc.slug, doc.ten].join(' ')),
      };
      allDocs.push(wrapped);
      byKey.set(wrapped._key, wrapped);
    }

    for (const doc of dk.tom_tat_nhap || []) {
      const items = doc.dieu_khoan || [];
      items.forEach((it, idx) => {
        it._idx = idx;
        it._search = normText([
          it.dieu,
          it.ten,
          it.tom_tat,
          ...(it.nghia_vu_xnk || []),
        ].join(' '));
      });
      const wrapped = {
        ...doc,
        _tier: 'TOM_TAT_NHAP',
        _key: `B:${doc.slug || doc.so_hieu}`,
        _docSearch: normText([doc.so_hieu, doc.slug].join(' ')),
      };
      allDocs.push(wrapped);
      byKey.set(wrapped._key, wrapped);
    }

    dk._allDocs = allDocs;
    dk._byKey = byKey;
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
    const dieuFilter = state.dk.dieuFilter;
    let matchedItems = dieuFilter
      ? items.filter((it) => matchDieuValue(it.dieu, dieuFilter))
      : items;
    if (qNorm && !doc._docSearch.includes(qNorm)) {
      matchedItems = matchedItems.filter((it) => it._search.includes(qNorm));
    }

    const expanded = Boolean(state.dk.expandedDocs[doc._key] || dieuFilter);
    const cap = 12;
    const shown = expanded || matchedItems.length <= cap ? matchedItems : matchedItems.slice(0, cap);
    const nguonUrl = safeUrl(doc.nguon_a);
    const docSlugOrNo = doc.slug || doc.so_hieu || '';
    const docDkHash = `#dk=${encodeURIComponent(docSlugOrNo)}`;

    const clausesHtml = shown.length
      ? shown.map((it) => {
        const dieuParam = extractDieuParam(it.dieu);
        const clauseHash = dieuParam
          ? `#dk=${encodeURIComponent(docSlugOrNo)}:${encodeURIComponent(dieuParam)}`
          : docDkHash;
        const isDieuMatch = Boolean(dieuFilter && matchDieuValue(it.dieu, dieuFilter));

        if (isTierA) {
          const parts = [`Điều ${it.dieu}`];
          if (it.khoan !== undefined && it.khoan !== null && it.khoan !== '') parts.push(`Khoản ${it.khoan}`);
          if (it.diem !== undefined && it.diem !== null && it.diem !== '') parts.push(`Điểm ${it.diem}`);
          const shaShort = it.sha256_pdf ? `${String(it.sha256_pdf).slice(0, 12)}…` : null;
          return `
            <div class="clause-item${isDieuMatch ? ' clause-item-highlight' : ''}">
              <div class="clause-head">
                <span class="clause-cite">${esc(parts.join(' · '))}</span>
                <span class="clause-proof">
                  ${it.trang_pdf != null ? `<span>Trang PDF: ${esc(it.trang_pdf)}</span>` : ''}
                  ${shaShort ? `<span title="SHA-256 PDF: ${esc(it.sha256_pdf)}">SHA-256: ${esc(shaShort)}</span>` : ''}
                </span>
              </div>
              <div class="clause-text">${esc(it.noi_dung)}</div>
              <div class="clause-actions">
                <button type="button" class="btn-small btn-cite" data-cite-doc="${esc(doc._key)}" data-cite-idx="${it._idx}">📋 Sao chép trích dẫn chuẩn pháp lý</button>
                <button type="button" class="btn-small btn-copy" data-copy-link="${esc(clauseHash)}">🔗 Sao chép liên kết</button>
              </div>
            </div>
          `;
        }

        const duties = (it.nghia_vu_xnk || []).length
          ? `<ul class="duty-list">${it.nghia_vu_xnk.map((nv) => `<li>${esc(nv)}</li>`).join('')}</ul>`
          : '';
        return `
          <div class="clause-item clause-item-draft${isDieuMatch ? ' clause-item-highlight' : ''}">
            <div class="clause-head">
              <span class="clause-cite">${esc(it.dieu || 'Điều khoản')}${it.ten ? ` — ${esc(it.ten)}` : ''}</span>
              <span class="badge badge-tier-draft">Tóm tắt nháp · da_soat: false</span>
            </div>
            ${it.tom_tat ? `<div class="clause-text">${esc(it.tom_tat)}</div>` : ''}
            ${duties}
            ${it.nguon_trich ? `<div class="meta-row" style="margin-top:0.35rem;margin-bottom:0"><span>Nguồn trích nháp: <code>${esc(it.nguon_trich)}</code></span></div>` : ''}
            <div class="clause-actions">
              <button type="button" class="btn-small btn-copy" data-copy-link="${esc(clauseHash)}">🔗 Sao chép liên kết</button>
            </div>
          </div>
        `;
      }).join('')
      : `<div class="card-note">Không tìm thấy Điều ${esc(dieuFilter)} trong văn bản này.</div>`;

    const showAllBtn = !dieuFilter && matchedItems.length > cap
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
            <button type="button" class="btn-small btn-copy" data-copy-link="${esc(docDkHash)}">🔗 Sao chép liên kết</button>
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
    const chipEl = document.getElementById('dk-active-filter');
    const tk = dk.thong_ke || {};

    if (state.dk.pendingRoute) {
      const { slug, dieu } = state.dk.pendingRoute;
      const normTarget = normDocNo(slug);
      const matches = dk._allDocs.filter((d) => d.slug === slug || normDocNo(d.so_hieu) === normTarget);
      let chosen = null;
      if (matches.length) {
        const tierA = matches.find((d) => d._tier === 'NGUYEN_VAN_NGUON_A');
        const tierB = matches.find((d) => d._tier === 'TOM_TAT_NHAP');
        if (dieu) {
          if (tierA && (tierA.dieu_khoan || []).some((it) => matchDieuValue(it.dieu, dieu))) chosen = tierA;
          else if (tierB && (tierB.dieu_khoan || []).some((it) => matchDieuValue(it.dieu, dieu))) chosen = tierB;
        }
        chosen = chosen || tierA || tierB || matches[0];
      }
      state.dk.pendingRoute = null;
      if (chosen) {
        state.dk.docKey = chosen._key;
        state.dk.dieuFilter = dieu || '';
        state.dk.missingRoute = null;
        state.dk.expandedDocs[chosen._key] = true;
        const selDoc = document.getElementById('dk-doc');
        if (selDoc) selDoc.value = chosen._key;
      } else {
        state.dk.docKey = '';
        state.dk.dieuFilter = '';
        state.dk.missingRoute = { slug, dieu };
      }
    }

    if (chipEl) {
      if (state.dk.dieuFilter && !state.dk.missingRoute) {
        chipEl.classList.remove('hidden');
        chipEl.hidden = false;
        chipEl.innerHTML = `
          <span>Đang lọc theo liên kết điều khoản: <strong>Điều ${esc(state.dk.dieuFilter)}</strong></span>
          <button type="button" class="btn-small" id="dk-clear-dieu">Xem tất cả điều của văn bản</button>
        `;
        document.getElementById('dk-clear-dieu')?.addEventListener('click', () => {
          state.dk.dieuFilter = '';
          const doc = dk._byKey?.get(state.dk.docKey);
          if (doc) setUrlHash(`#dk=${encodeURIComponent(doc.slug || doc.so_hieu)}`);
          renderTabDieuKhoan();
        });
      } else {
        chipEl.classList.add('hidden');
        chipEl.hidden = true;
        chipEl.innerHTML = '';
      }
    }

    statsEl.innerHTML = `
      <div class="stat-tile"><div class="stat-num">${fmtNum(tk.so_van_ban_nguon_a)}</div><div class="stat-label">VB nguyên văn nguồn A</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(tk.so_dieu_khoan_nguon_a)}</div><div class="stat-label">Điều khoản nguồn A</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(tk.so_van_ban_tom_tat_nhap)}</div><div class="stat-label">VB tóm tắt nháp</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(tk.so_dieu_khoan_tom_tat_nhap)}</div><div class="stat-label">Mục tóm tắt nháp</div></div>
    `;

    const qNorm = normText(state.dk.q);
    const { tier, docKey, dieuFilter } = state.dk;

    const filtered = state.dk.missingRoute ? [] : dk._allDocs.filter((doc) => {
      if (tier && doc._tier !== tier) return false;
      if (docKey && doc._key !== docKey) return false;
      if (dieuFilter && !(doc.dieu_khoan || []).some((it) => matchDieuValue(it.dieu, dieuFilter))) return false;
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
      const msg = state.dk.missingRoute
        ? `<p>Không tìm thấy điều khoản cho mã <code>${esc(state.dk.missingRoute.slug)}</code>${state.dk.missingRoute.dieu ? ` (Điều ${esc(state.dk.missingRoute.dieu)})` : ''}.</p>`
        : '<p>Không có điều khoản nào khớp tiêu chí tìm kiếm.</p>';
      listEl.innerHTML = `<div class="empty-state">${msg}</div>`;
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
    bindCardActions(listEl);

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

      const casHash = `#cas=${encodeURIComponent(r.cas || r.ten_chat || '')}`;

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
            <div style="margin-top:0.25rem"><button type="button" class="btn-small btn-copy" data-copy-link="${esc(casHash)}">🔗 Sao chép liên kết</button></div>
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

    bindCardActions(listEl);

    renderPager(pagerEl, state.cas.page, filtered.length, PAGE_SIZE.cas, (p) => {
      state.cas.page = p;
      renderTabCas();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== TAB 5: CHÍNH SÁCH THEO MÃ HS ====================
  function prepareHsPolicy(hsData) {
    if (hsData._prepared) return hsData;
    const ma = hsData.ma || {};
    const keys = Object.keys(ma).sort();
    let totalEdges = 0;
    let count4 = 0;
    let count6 = 0;
    let count8 = 0;
    for (const k of keys) {
      totalEdges += Array.isArray(ma[k]) ? ma[k].length : 0;
      if (k.length === 4) count4 += 1;
      else if (k.length === 6) count6 += 1;
      else if (k.length >= 8) count8 += 1;
    }
    hsData._keys = keys;
    hsData._totalEdges = totalEdges;
    hsData._counts = { count4, count6, count8 };
    hsData._prepared = true;
    return hsData;
  }

  function lookupHsPolicy(hsData, rawInput) {
    const raw = String(rawInput || '').trim();
    if (!raw) return { status: 'empty', code: '', raw, groups: [] };

    const stripped = raw.replace(/[\s.\-]/g, '');
    if (/[^0-9]/.test(stripped)) {
      return { status: 'invalid_non_digit', code: '', raw, groups: [] };
    }
    if (!stripped) return { status: 'empty', code: '', raw, groups: [] };

    const ma = hsData.ma || {};
    const keys = hsData._keys || Object.keys(ma).sort();

    if (stripped.length < 4) {
      const prefixHits = keys.filter((k) => k.startsWith(stripped)).length;
      return { status: 'too_short', code: stripped, raw, prefixHits, groups: [] };
    }

    const groups = [];
    const seen = new Set();
    const pushKey = (key, relationLabel) => {
      if (!key || seen.has(key) || !Array.isArray(ma[key]) || !ma[key].length) return;
      seen.add(key);
      groups.push({ key, relationLabel, items: ma[key] });
    };

    if (stripped.length >= 8) {
      const k8 = stripped.slice(0, 8);
      pushKey(k8, stripped.length === 8 ? 'Khớp chính xác mã 8 số' : `Khớp mã 8 số (${k8})`);
      pushKey(k8.slice(0, 6), 'Chính sách cấp phân nhóm (6 số)');
      pushKey(k8.slice(0, 4), 'Chính sách cấp nhóm (4 số)');
    } else if (stripped.length >= 6) {
      const k6 = stripped.slice(0, 6);
      pushKey(k6, stripped.length === 6 ? 'Khớp chính xác mã 6 số' : `Khớp mã 6 số (${k6})`);
      pushKey(k6.slice(0, 4), 'Chính sách cấp nhóm (4 số)');
    } else {
      const k4 = stripped.slice(0, 4);
      pushKey(k4, stripped.length === 4 ? 'Khớp chính xác mã 4 số' : `Khớp mã 4 số (${k4})`);
    }

    if (stripped.length < 8) {
      for (const k of keys) {
        if (k.startsWith(stripped) && !seen.has(k)) {
          pushKey(k, `Mã chi tiết bắt đầu bằng ${stripped} (${k.length} số)`);
        }
      }
    }

    return { status: 'matched', code: stripped, raw, groups };
  }

  function renderHsRiskBadge(mucRuiRo) {
    if (!mucRuiRo) return '';
    const label = TEN_MUC_RUI_RO[mucRuiRo] || mucRuiRo;
    const cls = mucRuiRo === 'CAO'
      ? 'badge-risk-high'
      : mucRuiRo === 'TRUNG_BINH'
        ? 'badge-risk-medium'
        : 'badge-soft';
    return `<span class="badge ${cls}">${esc(label)}</span>`;
  }

  function renderTabHs() {
    const hsData = state.cache.hsPolicy;
    if (!hsData) return;
    prepareHsPolicy(hsData);

    const statsEl = document.getElementById('hs-stats');
    const listEl = document.getElementById('hs-list');
    const summaryEl = document.getElementById('hs-summary');
    const pagerEl = document.getElementById('hs-pager');
    const { count4, count6, count8 } = hsData._counts || { count4: 0, count6: 0, count8: 0 };

    statsEl.innerHTML = `
      <div class="stat-tile"><div class="stat-num">${fmtNum(hsData.tong_nhom_ma ?? hsData._keys.length)}</div><div class="stat-label">Nhóm mã HS có chính sách</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(hsData._totalEdges)}</div><div class="stat-label">Dòng quy định quản lý</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(count4)} / ${fmtNum(count6)}</div><div class="stat-label">Mã 4 số / 6 số</div></div>
      <div class="stat-tile"><div class="stat-num">${fmtNum(count8)}</div><div class="stat-label">Mã chi tiết 8 số</div></div>
    `;

    if (!hsData._keys.length) {
      summaryEl.innerHTML = '<span>Chưa có dữ liệu chính sách HS trong bản dựng hiện tại</span>';
      listEl.innerHTML = '<div class="empty-state"><p>Gói dữ liệu tĩnh hiện chưa nạp danh mục chính sách theo mã HS.</p></div>';
      pagerEl.innerHTML = '';
      return;
    }

    const res = lookupHsPolicy(hsData, state.hs.q);
    if (res.status === 'empty') {
      summaryEl.innerHTML = '<span>Nhập mã HS 4, 6 hoặc 8 chữ số để tra cứu văn bản quản lý chuyên ngành</span>';
      listEl.innerHTML = `
        <div class="empty-state">
          <p><strong>Nhập mã HS đã biết</strong> vào ô tìm kiếm phía trên (hỗ trợ cả dạng có dấu chấm như <code>3808.91.99</code>, <code>380891</code>, <code>3808</code>).</p>
          <p class="text-soft">Hệ thống sẽ đối chiếu theo thứ tự <code>8 → 6 → 4</code> số và liệt kê các mã chi tiết cùng tiền tố 4/6 số (nếu có).</p>
        </div>
      `;
      pagerEl.innerHTML = '';
      return;
    }

    if (res.status === 'invalid_non_digit') {
      summaryEl.innerHTML = '<span>Đầu vào không phải mã HS dạng số</span>';
      listEl.innerHTML = `
        <div class="notice notice-warn">
          <strong>Ngoài phạm vi tra cứu mã HS theo mô tả:</strong>
          Giá trị <code>${esc(res.raw)}</code> chứa ký tự không phải chữ số.
          Tab này <strong>chỉ tra cứu chính sách quản lý chuyên ngành theo mã HS đã biết</strong> (4, 6 hoặc 8 số); không hỗ trợ áp/phân loại mã HS từ tên hàng hóa hay tính thuế suất (thuộc hệ thống <code>hs-code-api</code>).
        </div>
      `;
      pagerEl.innerHTML = '';
      return;
    }

    if (res.status === 'too_short') {
      summaryEl.innerHTML = `<span>Đã nhập ${res.code.length} chữ số</span>`;
      listEl.innerHTML = `
        <div class="empty-state">
          <p>Vui lòng nhập đủ <strong>4, 6 hoặc 8 chữ số</strong> của mã HS (hiện có ${fmtNum(res.prefixHits)} nhóm mã bắt đầu bằng <code>${esc(res.code)}</code>).</p>
        </div>
      `;
      pagerEl.innerHTML = '';
      return;
    }

    const { tinhTrang, loaiTacDong } = state.hs;
    const filteredGroups = res.groups
      .map((g) => {
        const items = g.items.filter((it) => {
          if (tinhTrang && it.tinh_trang !== tinhTrang) return false;
          if (loaiTacDong && (it.loai_tac_dong || 'KHAC') !== loaiTacDong) return false;
          return true;
        });
        return { ...g, items };
      })
      .filter((g) => g.items.length > 0);

    const totalItems = filteredGroups.reduce((acc, g) => acc + g.items.length, 0);
    const totalPages = Math.max(1, Math.ceil(filteredGroups.length / PAGE_SIZE.hs));
    if (state.hs.page > totalPages) state.hs.page = totalPages;
    const start = (state.hs.page - 1) * PAGE_SIZE.hs;
    const slice = filteredGroups.slice(start, start + PAGE_SIZE.hs);

    summaryEl.innerHTML = `<span>Mã <code>${esc(res.code)}</code>: tìm thấy <strong>${fmtNum(filteredGroups.length)}</strong> nhóm mã (${fmtNum(totalItems)} quy định)</span>`
      + (filteredGroups.length ? `<span>Hiển thị nhóm ${start + 1}–${Math.min(start + PAGE_SIZE.hs, filteredGroups.length)}</span>` : '');

    if (!slice.length) {
      listEl.innerHTML = `
        <div class="empty-state">
          <p>Không tìm thấy chính sách quản lý chuyên ngành nào khớp mã HS <code>${esc(res.code)}</code> với bộ lọc hiện tại.</p>
          <p class="text-soft">Lưu ý: hãy kiểm tra lại độ dài mã (4, 6 hoặc 8 số) hoặc xóa bộ lọc Tình trạng / Loại tác động.</p>
        </div>
      `;
      pagerEl.innerHTML = '';
      return;
    }

    const regByKey = state.cache.registry?._byKey;
    const canhBaoList = Array.isArray(hsData.canh_bao_ma) ? hsData.canh_bao_ma : [];

    listEl.innerHTML = slice.map((g) => {
      const hsHash = `#hs=${encodeURIComponent(g.key)}`;
      const isWarnCode = canhBaoList.includes(g.key);
      const rowsHtml = g.items.map((it) => {
        const tacDongLabel = TEN_LOAI_TAC_DONG[it.loai_tac_dong] || it.loai_tac_dong || 'Chuyên ngành';
        const regDoc = regByKey?.get(normDocNo(it.so_hieu));
        const danChieuText = it.dan_chieu || [it.phu_luc, it.nhom].filter(Boolean).join(' · ');
        return `
          <div class="hs-policy-row">
            <div class="hs-policy-row-top">
              <div class="card-title-group">
                <button
                  type="button"
                  class="btn-link doc-code"
                  data-jump-vb="${esc(it.slug || '')}"
                  data-so-hieu="${esc(it.so_hieu)}"
                >${esc(it.so_hieu)}</button>
                <span class="badge badge-pending">${esc(tacDongLabel)}</span>
                ${renderHsRiskBadge(it.muc_rui_ro)}
              </div>
              <div class="card-badges">
                ${badgeTinhTrang(it.tinh_trang)}
                ${it.hieu_luc_da_doi_chieu === false ? '<span class="badge badge-unknown">Chưa đối chiếu HL</span>' : ''}
              </div>
            </div>
            ${regDoc?.ten ? `<div class="text-soft" style="margin-bottom:0.25rem">${esc(regDoc.ten)}</div>` : ''}
            <div class="meta-row" style="margin-bottom:0.2rem">
              ${it.hieu_luc_tu ? `<span><strong>Hiệu lực từ:</strong> ${esc(it.hieu_luc_tu)}</span>` : ''}
              ${it.het_hieu_luc_tu ? `<span><strong>Hết hiệu lực từ:</strong> ${esc(it.het_hieu_luc_tu)}</span>` : ''}
              ${danChieuText ? `<span><strong>Dẫn chiếu:</strong> ${esc(danChieuText)}</span>` : ''}
            </div>
            ${it.dieu_kien ? `<div class="card-note" style="margin:0.25rem 0 0"><strong>Điều kiện / Phạm vi:</strong> ${esc(it.dieu_kien)}</div>` : ''}
          </div>
        `;
      }).join('');

      return `
        <article class="card">
          <div class="card-header">
            <div class="card-title-group">
              <span class="hs-code-pill">${esc(g.key)}</span>
              <span class="badge badge-soft">${esc(g.relationLabel)}</span>
            </div>
            <div class="card-badges">
              <span class="badge badge-soft">${fmtNum(g.items.length)} văn bản/quy định</span>
              <button type="button" class="btn-small btn-copy" data-copy-link="${esc(hsHash)}">🔗 Sao chép liên kết</button>
            </div>
          </div>
          ${isWarnCode ? '<div class="notice notice-warn" style="margin-bottom:0.5rem">⚠️ Nhóm mã này có cảnh báo lệch/ngoài biểu thuế đối chiếu — hãy đối chiếu lại văn bản gốc.</div>' : ''}
          <div class="hs-policy-list">${rowsHtml}</div>
        </article>
      `;
    }).join('');

    bindCardActions(listEl);

    renderPager(pagerEl, state.hs.page, filteredGroups.length, PAGE_SIZE.hs, (p) => {
      state.hs.page = p;
      renderTabHs();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== ĐIỀU PHỐI TAB, ROUTER & SỰ KIỆN ====================
  async function ensureTabLoaded(tabName) {
    showGlobalAlert('');
    if (tabName === 'hieu-luc') {
      if (!state.cache.registry) {
        document.getElementById('reg-list').innerHTML = '<div class="loading-box">Đang tải danh mục văn bản…</div>';
        await Promise.all([
          fetchJson('registry', 'data/registry.json'),
          loadSapHetHieuLuc(),
        ]);
      } else if (state.cache.sapHetHieuLuc === undefined) {
        await loadSapHetHieuLuc();
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
    } else if (tabName === 'chinh-sach-hs') {
      if (!state.cache.hsPolicy) {
        document.getElementById('hs-list').innerHTML = '<div class="loading-box">Đang tải chính sách quản lý chuyên ngành theo mã HS…</div>';
        await fetchJson('hsPolicy', 'data/hs-policy.json');
      }
      renderTabHs();
    }
  }

  function activateTab(tabName, { updateHash = true, hashStr, push = false } = {}) {
    const target = VALID_TABS.includes(tabName) ? tabName : 'hieu-luc';
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

    if (updateHash) {
      setUrlHash(hashStr || `#tab=${target}`, push);
    }

    ensureTabLoaded(target).catch((err) => {
      showGlobalAlert(thongBaoLoiTaiDuLieu(err));
    });
  }

  function parseHashRoute(rawHash) {
    const clean = String(rawHash || '').replace(/^#/, '').trim();
    if (!clean) return { type: 'tab', tab: 'hieu-luc' };
    if (VALID_TABS.includes(clean)) return { type: 'tab', tab: clean };
    if (clean.startsWith('tab=')) {
      const tab = decodeSafe(clean.slice(4));
      return { type: 'tab', tab: VALID_TABS.includes(tab) ? tab : 'hieu-luc' };
    }
    if (clean.startsWith('vb=')) {
      return { type: 'vb', slug: decodeSafe(clean.slice(3)) };
    }
    if (clean.startsWith('wiki=')) {
      return { type: 'wiki', slug: decodeSafe(clean.slice(5)) };
    }
    if (clean.startsWith('dk=')) {
      const rest = clean.slice(3);
      const idx = rest.indexOf(':');
      const slug = decodeSafe(idx === -1 ? rest : rest.slice(0, idx));
      const dieu = idx === -1 ? '' : decodeSafe(rest.slice(idx + 1));
      return { type: 'dk', slug, dieu };
    }
    if (clean.startsWith('cas=')) {
      return { type: 'cas', cas: decodeSafe(clean.slice(4)) };
    }
    if (clean.startsWith('hs=')) {
      return { type: 'hs', code: decodeSafe(clean.slice(3)) };
    }
    return { type: 'tab', tab: 'hieu-luc' };
  }

  function applyHashRoute(rawHash, { updateHash = false, push = false } = {}) {
    const route = parseHashRoute(rawHash);
    if (route.type === 'vb') {
      state.reg.q = '';
      state.reg.tinhTrang = '';
      state.reg.muc = '';
      state.reg.loai = '';
      state.reg.nhanh = '';
      state.reg.onlyRel = false;
      state.reg.onlyExpiring = false;
      state.reg.page = 1;
      state.reg.highlightDoc = '';
      state.reg.highlightSlug = route.slug;
      state.reg.pendingSlug = route.slug;
      state.reg.missingSlug = '';
      syncRegControls();
      activateTab('hieu-luc', {
        updateHash,
        hashStr: `#vb=${encodeURIComponent(route.slug)}`,
        push,
      });
      return;
    }

    if (route.type === 'wiki') {
      state.wiki.q = '';
      state.wiki.loai = '';
      state.wiki.mode = 'auto';
      state.wiki.onlyOld = false;
      state.wiki.slugFilter = route.slug;
      state.wiki.page = 1;
      const wQ = document.getElementById('wiki-q');
      const wL = document.getElementById('wiki-loai');
      const wM = document.getElementById('wiki-mode');
      const wO = document.getElementById('wiki-only-old');
      if (wQ) wQ.value = '';
      if (wL) wL.value = '';
      if (wM) wM.value = 'auto';
      if (wO) wO.checked = false;
      activateTab('wiki', {
        updateHash,
        hashStr: `#wiki=${encodeURIComponent(route.slug)}`,
        push,
      });
      return;
    }

    if (route.type === 'dk') {
      state.dk.q = '';
      state.dk.tier = '';
      state.dk.docKey = '';
      state.dk.dieuFilter = '';
      state.dk.missingRoute = null;
      state.dk.pendingRoute = { slug: route.slug, dieu: route.dieu };
      state.dk.page = 1;
      const dkQ = document.getElementById('dk-q');
      const dkT = document.getElementById('dk-tier');
      const dkD = document.getElementById('dk-doc');
      if (dkQ) dkQ.value = '';
      if (dkT) dkT.value = '';
      if (dkD) dkD.value = '';
      const dkHash = route.dieu
        ? `#dk=${encodeURIComponent(route.slug)}:${encodeURIComponent(route.dieu)}`
        : `#dk=${encodeURIComponent(route.slug)}`;
      activateTab('dieu-khoan', { updateHash, hashStr: dkHash, push });
      return;
    }

    if (route.type === 'cas') {
      state.cas.q = route.cas;
      state.cas.phuLuc = '';
      state.cas.casMode = 'all';
      state.cas.page = 1;
      const cQ = document.getElementById('cas-q');
      const cPl = document.getElementById('cas-phu-luc');
      const cM = document.getElementById('cas-mode');
      if (cQ) cQ.value = route.cas;
      if (cPl) cPl.value = '';
      if (cM) cM.value = 'all';
      activateTab('cas', {
        updateHash,
        hashStr: `#cas=${encodeURIComponent(route.cas)}`,
        push,
      });
      return;
    }

    if (route.type === 'hs') {
      state.hs.q = route.code;
      state.hs.tinhTrang = '';
      state.hs.loaiTacDong = '';
      state.hs.page = 1;
      const hsQ = document.getElementById('hs-q');
      const hsT = document.getElementById('hs-tinh-trang');
      const hsL = document.getElementById('hs-loai-tac-dong');
      if (hsQ) hsQ.value = route.code;
      if (hsT) hsT.value = '';
      if (hsL) hsL.value = '';
      activateTab('chinh-sach-hs', {
        updateHash,
        hashStr: `#hs=${encodeURIComponent(route.code)}`,
        push,
      });
      return;
    }

    activateTab(route.tab, { updateHash, hashStr: `#tab=${route.tab}`, push });
  }

  function bindControls() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        activateTab(target, { updateHash: true, hashStr: `#tab=${target}` });
      });
    });

    document.getElementById('expiry-ribbon-btn')?.addEventListener('click', openExpiringFilter);

    // Tab 1 controls
    document.getElementById('reg-q')?.addEventListener('input', (e) => {
      state.reg.q = e.target.value;
      state.reg.highlightDoc = '';
      state.reg.highlightSlug = '';
      state.reg.pendingSlug = '';
      state.reg.missingSlug = '';
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-tinh-trang')?.addEventListener('change', (e) => {
      state.reg.tinhTrang = e.target.value;
      state.reg.missingSlug = '';
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-muc')?.addEventListener('change', (e) => {
      state.reg.muc = e.target.value;
      state.reg.missingSlug = '';
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-loai')?.addEventListener('change', (e) => {
      state.reg.loai = e.target.value;
      state.reg.missingSlug = '';
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-nhanh')?.addEventListener('change', (e) => {
      state.reg.nhanh = e.target.value;
      state.reg.missingSlug = '';
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-only-rel')?.addEventListener('change', (e) => {
      state.reg.onlyRel = e.target.checked;
      state.reg.missingSlug = '';
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-only-expiring')?.addEventListener('change', (e) => {
      state.reg.onlyExpiring = e.target.checked;
      state.reg.missingSlug = '';
      state.reg.page = 1;
      renderTabRegistry();
    });
    document.getElementById('reg-reset')?.addEventListener('click', () => {
      state.reg = {
        q: '',
        tinhTrang: '',
        muc: '',
        loai: '',
        nhanh: '',
        onlyRel: false,
        onlyExpiring: false,
        page: 1,
        highlightDoc: '',
        highlightSlug: '',
        pendingSlug: '',
        missingSlug: '',
      };
      syncRegControls();
      setUrlHash('#tab=hieu-luc');
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
      setUrlHash('#tab=wiki');
      renderTabWiki();
    });

    // Tab 3 controls
    document.getElementById('dk-q')?.addEventListener('input', (e) => {
      state.dk.q = e.target.value;
      state.dk.missingRoute = null;
      state.dk.page = 1;
      renderTabDieuKhoan();
    });
    document.getElementById('dk-tier')?.addEventListener('change', (e) => {
      state.dk.tier = e.target.value;
      state.dk.missingRoute = null;
      state.dk.page = 1;
      renderTabDieuKhoan();
    });
    document.getElementById('dk-doc')?.addEventListener('change', (e) => {
      state.dk.docKey = e.target.value;
      state.dk.dieuFilter = '';
      state.dk.missingRoute = null;
      state.dk.page = 1;
      renderTabDieuKhoan();
    });
    document.getElementById('dk-reset')?.addEventListener('click', () => {
      state.dk = { q: '', tier: '', docKey: '', dieuFilter: '', pendingRoute: null, missingRoute: null, page: 1, expandedDocs: {} };
      document.getElementById('dk-q').value = '';
      document.getElementById('dk-tier').value = '';
      document.getElementById('dk-doc').value = '';
      setUrlHash('#tab=dieu-khoan');
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
      setUrlHash('#tab=cas');
      renderTabCas();
    });

    // Tab 5 controls
    document.getElementById('hs-q')?.addEventListener('input', (e) => {
      state.hs.q = e.target.value;
      state.hs.page = 1;
      const trimmed = String(state.hs.q || '').trim();
      setUrlHash(trimmed ? `#hs=${encodeURIComponent(trimmed)}` : '#tab=chinh-sach-hs');
      renderTabHs();
    });
    document.getElementById('hs-tinh-trang')?.addEventListener('change', (e) => {
      state.hs.tinhTrang = e.target.value;
      state.hs.page = 1;
      renderTabHs();
    });
    document.getElementById('hs-loai-tac-dong')?.addEventListener('change', (e) => {
      state.hs.loaiTacDong = e.target.value;
      state.hs.page = 1;
      renderTabHs();
    });
    document.getElementById('hs-reset')?.addEventListener('click', () => {
      state.hs = { q: '', tinhTrang: '', loaiTacDong: '', page: 1 };
      document.getElementById('hs-q').value = '';
      document.getElementById('hs-tinh-trang').value = '';
      document.getElementById('hs-loai-tac-dong').value = '';
      setUrlHash('#tab=chinh-sach-hs');
      renderTabHs();
    });
    document.querySelectorAll('[data-hs-sample]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sample = btn.getAttribute('data-hs-sample') || '';
        state.hs.q = sample;
        state.hs.page = 1;
        const hsQ = document.getElementById('hs-q');
        if (hsQ) hsQ.value = sample;
        setUrlHash(`#hs=${encodeURIComponent(sample)}`);
        renderTabHs();
      });
    });

    window.addEventListener('hashchange', () => {
      applyHashRoute(window.location.hash || '#tab=hieu-luc', { updateHash: false });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindControls();
    loadSapHetHieuLuc().then(() => {
      if (state.activeTab === 'hieu-luc' && state.cache.registry) {
        renderTabRegistry();
      }
    });
    const hasInitialHash = Boolean(window.location.hash);
    applyHashRoute(window.location.hash || '#tab=hieu-luc', { updateHash: !hasInitialHash });
  });
})();
