/*
 * Destination metadata: names, accent colours, photos, language tests,
 * visa steps and the main government scholarship for each place.
 * Facts checked on official pages on 19 September 2026.
 */
export type DestinationId = 'CN' | 'HK' | 'KR' | 'JP';

export interface Destination {
  id: DestinationId;
  /** Accurate, neutral name. Hong Kong is a Special Administrative Region of China, not a country. */
  name: string;
  short: string;
  flag: 'cn' | 'hk' | 'kr' | 'jp';
  accent: { a: string; b: string };
  photos: { left: string; right: string; hero: string };
  localLanguage: { language: string; test: 'HSK' | 'TOPIK' | 'JLPT' | null };
  teachingNote: string;
  visa: { text: string; url: string; urlLabel: string };
  scholarship: { name: string; text: string; url: string };
}

export const DESTINATIONS: Record<DestinationId, Destination> = {
  CN: {
    id: 'CN',
    name: 'Mainland China',
    short: 'China',
    flag: 'cn',
    accent: { a: '#FFD166', b: '#FF6B6B' },
    photos: { left: 'cn-pku-boya-tower', right: 'cn-tsinghua-old-gate', hero: 'cn-tsinghua-old-gate' },
    localLanguage: { language: 'Chinese', test: 'HSK' },
    teachingNote:
      'Many bachelor programmes for international students are taught in Chinese (HSK 5 or 6). CUHK-Shenzhen, XJTLU, UNNC, SJTU Global College and Fudan international programmes teach in English.',
    visa: {
      text: 'For study longer than 180 days you need an X1 student visa. Apply at the Chinese Embassy with your admission notice and the JW201 or JW202 form your university sends you.',
      url: 'https://kz.china-embassy.gov.cn/',
      urlLabel: 'Embassy of China in Kazakhstan',
    },
    scholarship: {
      name: 'Chinese Government Scholarship (CSC)',
      text: 'Apply through the Chinese Embassy (Type A). Since the 2026/27 intake, undergraduate applicants must take the China Scholastic Competency Assessment (CSCA).',
      url: 'https://www.csca.cn/',
    },
  },
  HK: {
    id: 'HK',
    name: 'Hong Kong SAR',
    short: 'Hong Kong',
    flag: 'hk',
    accent: { a: '#3EE6C4', b: '#4CC3F0' },
    photos: { left: 'hk-hku-main-building', right: 'hk-victoria-harbour', hero: 'hk-hku-main-building' },
    localLanguage: { language: 'English', test: null },
    teachingNote: 'Bachelor programmes at the public universities listed here are taught in English.',
    visa: {
      text: 'You need a student visa or entry permit from the Hong Kong Immigration Department. Your university normally acts as your sponsor after you accept an offer.',
      url: 'https://www.immd.gov.hk/eng/services/visas/study.html',
      urlLabel: 'Hong Kong Immigration Department: study',
    },
    scholarship: {
      name: 'Belt and Road Scholarship (Designated Countries)',
      text: 'Kazakhstan is a designated country. The scholarship covers full tuition for first-year non-local students on publicly funded bachelor programmes and is renewed each year with good results.',
      url: 'https://www.edb.gov.hk/en/edu-system/postsecondary/local-higher-edu/publicly-funded-programmes/scholarship.html',
    },
  },
  KR: {
    id: 'KR',
    name: 'South Korea',
    short: 'Korea',
    flag: 'kr',
    accent: { a: '#7CC0FF', b: '#B794FF' },
    photos: { left: 'kr-yonsei-underwood-hall', right: 'kr-seoul-skyline', hero: 'kr-yonsei-underwood-hall' },
    localLanguage: { language: 'Korean', test: 'TOPIK' },
    teachingNote:
      'KAIST, POSTECH, UNIST, GIST and Yonsei Underwood International College teach in English. Most other programmes teach mainly in Korean (TOPIK).',
    visa: {
      text: 'After admission you apply for a D-2 student visa with your certificate of admission. The Korea Visa Portal explains the documents.',
      url: 'https://www.visa.go.kr/',
      urlLabel: 'Korea Visa Portal',
    },
    scholarship: {
      name: 'Global Korea Scholarship (GKS)',
      text: 'The Korean government scholarship for international undergraduates. Check the current GKS notice on Study in Korea for eligible countries and dates.',
      url: 'https://www.studyinkorea.go.kr/en/main.do',
    },
  },
  JP: {
    id: 'JP',
    name: 'Japan',
    short: 'Japan',
    flag: 'jp',
    accent: { a: '#FFB3C6', b: '#FF6F86' },
    photos: { left: 'jp-kyoto-clock-tower', right: 'jp-waseda-okuma', hero: 'jp-kyoto-clock-tower' },
    localLanguage: { language: 'Japanese', test: 'JLPT' },
    teachingNote:
      'Every programme listed here accepts students without Japanese. Kyoto iUP teaches you Japanese, and its final two years are mainly in Japanese.',
    visa: {
      text: 'Your university applies for a Certificate of Eligibility (COE) for you. With the COE you then get a Student visa at the Embassy of Japan.',
      url: 'https://www.studyinjapan.go.jp/en/planning/',
      urlLabel: 'Study in Japan (JASSO): planning',
    },
    scholarship: {
      name: 'Japanese Government (MEXT) Scholarship',
      text: 'Covers fees and a monthly stipend. Undergraduate MEXT places are offered through Japanese embassies and some university programmes, including Science Tokyo GSEP.',
      url: 'https://www.studyinjapan.go.jp/en/planning/',
    },
  },
};

export const DESTINATION_ORDER: DestinationId[] = ['CN', 'HK', 'KR', 'JP'];
