#!/usr/bin/env node
/** Test fixture + sổ thật dungJson(napSo()) cho scripts/kiem-tra-toan-ven-registry.mjs — không ghi dist thật. */
import { kiemTraToanVen } from './kiem-tra-toan-ven-registry.mjs';
import { napSo } from '../tools/lib/registry.mjs';
import { dungJson } from '../tools/dung.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL ${name} ${extra}`);
  }
};

const mau = (overrides = {}) => ({
  so_hieu: '01/2026/TT-BTC',
  co_quan: 'BTC',
  ngay_ban_hanh: '2026-01-15',
  slug: '01-2026-tt-btc',
  ...overrides,
});

const ok = kiemTraToanVen({
  tong: 2,
  van_ban: [mau(), mau({ so_hieu: '02/2026/TT-BTC', slug: '02-2026-tt-btc' })],
});
t('registry sạch → ok', ok.ok && ok.tong === 2 && ok.loi.length === 0);

const thieuNgay = kiemTraToanVen({
  tong: 1,
  van_ban: [mau({ ngay_ban_hanh: undefined })],
});
t('thiếu ngay_ban_hanh', !thieuNgay.ok && thieuNgay.loi.some((e) => e.loai === 'thieu_ngay_ban_hanh'));

const thieuCoQuan = kiemTraToanVen({
  tong: 1,
  van_ban: [mau({ co_quan: '  ' })],
});
t('thiếu co_quan (rỗng)', !thieuCoQuan.ok && thieuCoQuan.loi.some((e) => e.loai === 'thieu_co_quan'));

const trung = kiemTraToanVen({
  tong: 2,
  van_ban: [
    mau({ so_hieu: '01/2026/TT-BTC' }),
    mau({ so_hieu: '01/2026/tt-btc', slug: 'ban-2' }),
  ],
});
t('trùng so_hieu (không phân biệt hoa thường)', !trung.ok && trung.loi.some((e) => e.loai === 'trung_so_hieu'));

const lechTong = kiemTraToanVen({
  tong: 99,
  van_ban: [mau()],
});
t('tong lệch van_ban.length', !lechTong.ok && lechTong.loi.some((e) => e.loai === 'tong'));

const ngaySai = kiemTraToanVen({
  tong: 1,
  van_ban: [mau({ ngay_ban_hanh: '15/01/2026' })],
});
t('ngay_ban_hanh sai dạng', !ngaySai.ok && ngaySai.loi.some((e) => e.loai === 'ngay_ban_hanh_sai_dang'));

const soThat = kiemTraToanVen(dungJson(napSo()));
t(
  'sổ thật dungJson(napSo()) toàn vẹn',
  soThat.ok === true && soThat.loi.length === 0 && soThat.tong > 0,
  soThat.loi.map((e) => e.msg).join('; '),
);

console.log(`\n${pass} pass · ${fail} fail`);
process.exit(fail ? 1 : 0);
