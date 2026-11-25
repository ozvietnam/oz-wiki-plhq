// Bộ chỉ mục & xếp hạng Okapi BM25 thuần Node (0 dependency) cho văn bản pháp luật tiếng Việt.
// Tách 2 lớp: unigram ASCII + bigram liền kề (kèm bigram giữ dấu phân biệt ngữ nghĩa như "gia công" vs "giá công").
import { boDau } from './registry.mjs';

export const STOP_WORDS_BM25 = new Set([
  'cua', 'va', 'hoac', 'la', 'tai', 'trong', 'theo', 'voi', 'cho', 'tu', 'den', 've',
  'duoc', 'co', 'khong', 'cac', 'nhung', 'mot', 'nay', 'do', 'khi', 'neu', 'nhu',
  'sau', 'tren', 'duoi', 'giua', 'nao', 'bao', 'nhieu', 'gi', 'hay', 'phai', 'can',
  'se', 'da', 'dang', 'bi', 'boi', 'de', 'ma', 'thi', 'vi', 'ban', 'hanh', 'ngay',
  'thang', 'nam', 'so', 'quy', 'dinh', 'van', 'luat', 'dieu', 'khoan', 'diem', 'muc',
  'chuong', 'hien', 'moi', 'nhat', 'truong', 'hop', 'doi', 'viec', 'thuc', 'lam',
  'ai', 'xin', 'hoi', 'cho', 'biet', 'nao', 'the', 'sao', 'nhu', 'the', 'nao', 'co',
  'can', 'nhe', 'anh', 'em', 'toi', 'minh', 'nhanh', 'chong', 'bang', 'tuong', 'ung',
  'thong', 'nghi', 'quyet', 'quyet', 'lenh',
]);

/**
 * Tách từ & bigram 2 lớp cho 1 đoạn văn bản tiếng Việt.
 * @param {string} text
 * @param {{ stopWords?: Set<string>, includeBigrams?: boolean, includeAccentedBigrams?: boolean }} [opts]
 */
export function tachTokenBm25(text, opts = {}) {
  const {
    stopWords = STOP_WORDS_BM25,
    includeBigrams = true,
    includeAccentedBigrams = true,
  } = opts;

  const nfc = String(text || '').normalize('NFC').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  if (!nfc) return { unigrams: [], bigrams: [], accBigrams: [], rawWords: [], asciiWords: [] };

  const rawWords = nfc.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 2 || /^\d+$/.test(w));
  const asciiWords = rawWords.map((w) => boDau(w));

  const laSoNgayHoacNam = (w) => /^\d{1,2}$/.test(w) || /^(?:19|20)\d{2}$/.test(w);
  const unigrams = [];
  for (const w of asciiWords) {
    if (!stopWords.has(w) && !laSoNgayHoacNam(w) && (w.length >= 2 || /^\d+$/.test(w))) {
      unigrams.push(w);
    }
  }

  const bigrams = [];
  const accBigrams = [];
  if (includeBigrams) {
    for (let i = 0; i < asciiWords.length - 1; i += 1) {
      const a = asciiWords[i];
      const b = asciiWords[i + 1];
      if (stopWords.has(a) && stopWords.has(b)) continue;
      if (laSoNgayHoacNam(a) && laSoNgayHoacNam(b)) continue;
      if (a.length < 2 && b.length < 2) continue;
      bigrams.push(`bg:${a}_${b}`);
      if (includeAccentedBigrams) {
        const wa = rawWords[i];
        const wb = rawWords[i + 1];
        if (wa !== a || wb !== b) {
          accBigrams.push(`abg:${wa}_${wb}`);
        }
      }
    }
  }

  return { unigrams, bigrams, accBigrams, rawWords, asciiWords };
}

function congTerm(tfMap, list, w) {
  for (const t of list) {
    tfMap.set(t, (tfMap.get(t) || 0) + w);
  }
}

/**
 * Dựng chỉ mục đảo Okapi BM25 cho tập tài liệu `{ id, tieuDe, muc, noiDung }`.
 * @param {Array<{ id?: string, tieuDe?: string, muc?: string, noiDung?: string }>} docs
 * @param {{ weights?: { tieuDe?: number, muc?: number, noiDung?: number }, k1?: number, b?: number }} [opts]
 */
export function taoChiMucBm25(docs, opts = {}) {
  const weights = opts.weights || { tieuDe: 2.5, muc: 1.8, noiDung: 1.0 };
  const k1 = opts.k1 ?? 1.5;
  const b = opts.b ?? 0.75;
  const N = docs.length;
  const docLens = new Float64Array(N);
  const df = new Map();
  const postings = new Map();
  let totalLen = 0;

  for (let i = 0; i < N; i += 1) {
    const d = docs[i] || {};
    const tfMap = new Map();

    const tTitle = tachTokenBm25(d.tieuDe || '');
    const tMuc = tachTokenBm25(d.muc || '');
    const tBody = tachTokenBm25(d.noiDung || '');

    congTerm(tfMap, tTitle.unigrams, weights.tieuDe);
    congTerm(tfMap, tTitle.bigrams, weights.tieuDe * 1.35);
    congTerm(tfMap, tTitle.accBigrams, weights.tieuDe * 0.55);

    congTerm(tfMap, tMuc.unigrams, weights.muc);
    congTerm(tfMap, tMuc.bigrams, weights.muc * 1.35);
    congTerm(tfMap, tMuc.accBigrams, weights.muc * 0.55);

    congTerm(tfMap, tBody.unigrams, weights.noiDung);
    congTerm(tfMap, tBody.bigrams, weights.noiDung * 1.35);
    congTerm(tfMap, tBody.accBigrams, weights.noiDung * 0.55);

    // Dùng tổng tần suất unigram thực để đo độ dài tài liệu chuẩn BM25
    const len = Math.max(1, tTitle.unigrams.length + tMuc.unigrams.length + tBody.unigrams.length);
    docLens[i] = len;
    totalLen += len;

    for (const [term, tf] of tfMap) {
      df.set(term, (df.get(term) || 0) + 1);
      let list = postings.get(term);
      if (!list) {
        list = [];
        postings.set(term, list);
      }
      list.push([i, tf]);
    }
  }

  const avgdl = N > 0 ? totalLen / N : 1;
  const idf = new Map();
  for (const [term, count] of df) {
    idf.set(term, Math.log(1 + (N - count + 0.5) / (count + 0.5)));
  }
  const maxIdf = N > 0 ? Math.log(1 + (N + 0.5) / 0.5) : 1;

  return { N, avgdl, docLens, df, idf, maxIdf, postings, k1, b };
}

/**
 * Chuẩn bị danh sách term truy vấn kèm IDF (tính cả cụm mở rộng từ viết tắt nếu truyền vào).
 * @param {ReturnType<typeof taoChiMucBm25>} index
 * @param {string} queryText
 * @param {string[]} [extraPhrases]
 */
export function chuanBiTruyVanBm25(index, queryText, extraPhrases = []) {
  const seen = new Set();
  const terms = [];

  const pushTerm = (term, weight, kind) => {
    if (seen.has(term)) return;
    seen.add(term);
    const knownDf = index.df.get(term) || 0;
    const termIdf = knownDf > 0 ? (index.idf.get(term) || 0) : index.maxIdf;
    terms.push({ term, weight, kind, idf: termIdf, inCorpus: knownDf > 0 });
  };

  const parsed = tachTokenBm25(queryText || '');
  for (const u of parsed.unigrams) pushTerm(u, 1.0, 'unigram');
  for (const bg of parsed.bigrams) pushTerm(bg, 1.35, 'bigram');
  for (const abg of parsed.accBigrams) pushTerm(abg, 0.55, 'accBigram');

  for (const ph of extraPhrases || []) {
    const ep = tachTokenBm25(ph);
    for (const u of ep.unigrams) pushTerm(u, 0.75, 'expanded_unigram');
    for (const bg of ep.bigrams) pushTerm(bg, 1.15, 'expanded_bigram');
  }

  const unigramTerms = terms.filter((t) => t.kind === 'unigram');
  const bigramTerms = terms.filter((t) => t.kind === 'bigram');
  const totalUnigramIdf = unigramTerms.reduce((s, t) => s + t.idf, 0);
  const totalBigramIdf = bigramTerms.reduce((s, t) => s + t.idf, 0);

  return {
    terms,
    unigramTerms,
    bigramTerms,
    totalUnigramIdf,
    totalBigramIdf,
  };
}

/**
 * Chấm điểm BM25 cho tất cả tài liệu có chứa ít nhất 1 term truy vấn qua inverted index.
 * Trả về Map<docIdx, { score, idfCov, bigramIdfCov, matchedUnigrams: Set<string>, matchedTerms: Set<string> }>.
 * @param {ReturnType<typeof taoChiMucBm25>} index
 * @param {ReturnType<typeof chuanBiTruyVanBm25>} qSpec
 */
export function truyVanBm25(index, qSpec) {
  const scores = new Map();
  if (!index || index.N === 0 || !qSpec?.terms?.length) return scores;

  const { k1, b, avgdl, docLens, postings } = index;

  for (const qt of qSpec.terms) {
    const list = postings.get(qt.term);
    if (!list || !list.length) continue;
    const wIdf = qt.idf * qt.weight;

    for (let j = 0; j < list.length; j += 1) {
      const [docIdx, tf] = list[j];
      const normLen = 1 - b + (b * docLens[docIdx]) / avgdl;
      const tfPart = (tf * (k1 + 1)) / (tf + k1 * normLen);
      const contrib = wIdf * tfPart;

      let st = scores.get(docIdx);
      if (!st) {
        st = {
          score: 0,
          matchedUniIdf: 0,
          matchedBiIdf: 0,
          matchedUnigrams: new Set(),
          matchedTerms: new Set(),
        };
        scores.set(docIdx, st);
      }
      st.score += contrib;
      st.matchedTerms.add(qt.term);
      if (qt.kind === 'unigram' && !st.matchedUnigrams.has(qt.term)) {
        st.matchedUnigrams.add(qt.term);
        st.matchedUniIdf += qt.idf;
      } else if (qt.kind === 'bigram') {
        st.matchedBiIdf += qt.idf;
      }
    }
  }

  for (const st of scores.values()) {
    st.idfCov = qSpec.totalUnigramIdf > 0 ? st.matchedUniIdf / qSpec.totalUnigramIdf : 0;
    st.bigramIdfCov = qSpec.totalBigramIdf > 0 ? st.matchedBiIdf / qSpec.totalBigramIdf : 0;
  }

  return scores;
}
