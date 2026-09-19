/*
 * University dataset for bachelor's admission of international students.
 *
 * Every figure below was read on the university's (or government's) official website
 * on 19 September 2026 and carries a source link. Where a university had not yet
 * published a figure for 2027 entry, the latest published figure is used and labelled
 * with its year. Where we could not find a figure on the official pages, it is null
 * and the site says so instead of guessing.
 */
import type { DestinationId } from './destinations';
import type { Currency } from './rates';

export type Field = 'engineering' | 'business';
export type Teaching = 'English' | 'Chinese' | 'Korean' | 'English + Japanese';

export interface Money {
  amount: number;
  currency: Currency;
  per: 'year' | 'semester';
  basis: string;
}

export interface EnglishRequirement {
  /** minimum = published minimum; typical = typical score of admitted students; unspecified = test needed, no minimum published */
  kind: 'minimum' | 'typical' | 'unspecified';
  ielts?: number;
  /** TOEFL iBT on the 0-120 scale (tests before 21 January 2026) */
  toefl120?: number;
  /** TOEFL iBT on the 1-6 band scale (tests from 21 January 2026) */
  toefl6?: number;
  note?: string;
  sourceUrl: string;
}

export interface LocalLanguageRequirement {
  test: 'HSK' | 'TOPIK';
  level: number;
  note?: string;
  sourceUrl: string;
}

export interface ProgramOption {
  label: string;
  examples?: string[];
  teaching: Teaching;
  tuition: Money | null;
  tuitionNote?: string;
  tuitionSourceUrl: string;
  english?: EnglishRequirement;
  local?: LocalLanguageRequirement;
  /** true when a scholarship given to every admitted international student covers the full tuition */
  coveredForAll?: boolean;
  /** true when admission accepts EITHER the local-language test OR the English test */
  eitherLanguage?: boolean;
}

export interface ApplicationWindow {
  /** Year the studies start. */
  entryYear: number;
  intake: string;
  from?: string;
  to?: string;
  text: string;
}

export interface Scholarship {
  name: string;
  /** automatic-all: every admitted international student receives it */
  kind: 'automatic-all' | 'merit-auto' | 'merit' | 'government';
  coverage: string;
  url: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  destination: DestinationId;
  city: string;
  admissionsUrl: string;
  programs: Partial<Record<Field, ProgramOption[]>>;
  windows: ApplicationWindow[];
  lastCycle?: string;
  windowsSourceUrl: string;
  scholarships: Scholarship[];
  living?: { text: string; sourceUrl: string };
  requirements?: string[];
  sat?: { value: number; kind: 'minimum' | 'typical'; note: string };
  note?: string;
}

const BELT_AND_ROAD: Scholarship = {
  name: 'Belt and Road Scholarship (Designated Countries, includes Kazakhstan)',
  kind: 'government',
  coverage: 'Full tuition, renewed each year with satisfactory results',
  url: 'https://www.edb.gov.hk/en/edu-system/postsecondary/local-higher-edu/publicly-funded-programmes/scholarship.html',
};

const CSC: Scholarship = {
  name: 'Chinese Government Scholarship (CSC, Type A through the Chinese Embassy)',
  kind: 'government',
  coverage: 'Tuition, accommodation, medical insurance and a monthly living allowance. CSCA scores required.',
  url: 'https://www.csca.cn/',
};

const GKS: Scholarship = {
  name: 'Global Korea Scholarship (GKS)',
  kind: 'government',
  coverage: 'Korean government scholarship for international undergraduates; check the yearly notice',
  url: 'https://www.studyinkorea.go.kr/en/main.do',
};

const HKU_FEES = 'https://admissions.hku.hk/fees-and-scholarships/fees';
const HKUST_FEES = 'https://join.hkust.edu.hk/fees-and-scholarships';
const CUHK_FEES = 'https://admission.cuhk.edu.hk/fees-financing-your-studies/fees/';
const POLYU_FEES =
  'https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-tuition-fees';
const TSINGHUA_FEES = 'https://international.join-tsinghua.edu.cn/Admission1/Fees.htm';
const TSINGHUA_ELIG = 'https://international.join-tsinghua.edu.cn/Admission1/Eligibility.htm';
const PKU_FEES = 'https://isd.pku.edu.cn/en/campus_detail.php?id=700';
const PKU_GUIDE = 'https://isd.pku.edu.cn/en/detail.php?id=813';
const PKU_SCORES = 'https://isd.pku.edu.cn/en/detail.php?id=816';
const SJTU_REQ = 'https://gc.sjtu.edu.cn/admission/international-undergraduate-admission/application-requirements/';
const SJTU_FEES = 'https://gc.sjtu.edu.cn/admission/international-undergraduate-admission/fees-and-scholarships/';
const ZJU_GUIDE = 'https://iczu.zju.edu.cn/admissionsen/2024/1030/c68988a2981659/page.htm';
const KAIST_COA = 'https://admission.kaist.ac.kr/intl-undergraduate/support/coa';
const SNU_GUIDE = 'https://en.snu.ac.kr/admission/overview/notice?md=v&bbsidx=170606';
const UIC_FEES = 'https://uic.yonsei.ac.kr/main/admission.php?mid=m04_03_01';
const UIC_ADMIT = 'https://uic.yonsei.ac.kr/main/admission.php?mid=m04_02_02';
const GSEP = 'https://admissions.isct.ac.jp/en/013/undergraduate/programs/entrance-examination/gsep';
const IUP = 'https://www.iup.kyoto-u.ac.jp/Application_Guidelines_for_October_2027_Enrollment.pdf';

export const UNIVERSITIES: University[] = [
  // ---------------------------------------------------------------- Hong Kong SAR
  {
    id: 'hku',
    name: 'The University of Hong Kong',
    shortName: 'HKU',
    destination: 'HK',
    city: 'Hong Kong',
    admissionsUrl: 'https://admissions.hku.hk/apply/international-qualifications',
    programs: {
      engineering: [
        {
          label: 'Faculty of Engineering (taught in English)',
          teaching: 'English',
          tuition: { amount: 280000, currency: 'HKD', per: 'year', basis: '2027/28 non-local fee, STEM programmes' },
          tuitionSourceUrl: HKU_FEES,
          english: {
            kind: 'minimum',
            ielts: 6.5,
            toefl120: 95,
            toefl6: 5,
            note: 'IELTS Writing and Speaking at least 6.0. TOEFL Writing and Speaking at least 5.0.',
            sourceUrl: 'https://admissions.hku.hk/apply/international-qualifications/english-language-requirement',
          },
        },
      ],
      business: [
        {
          label: 'HKU Business School (taught in English)',
          teaching: 'English',
          tuition: { amount: 250000, currency: 'HKD', per: 'year', basis: '2027/28 non-local fee, non-STEM programmes' },
          tuitionSourceUrl: HKU_FEES,
          english: {
            kind: 'minimum',
            ielts: 6.5,
            toefl120: 95,
            toefl6: 5,
            note: 'IELTS Writing and Speaking at least 6.0. TOEFL Writing and Speaking at least 5.0.',
            sourceUrl: 'https://admissions.hku.hk/apply/international-qualifications/english-language-requirement',
          },
        },
      ],
    },
    windows: [
      { entryYear: 2027, intake: 'September 2027', from: '2026-09-23', text: 'International applications for 2027 entry open on 23 September 2026.' },
    ],
    windowsSourceUrl: 'https://admissions.hku.hk/apply/international-qualifications',
    scholarships: [BELT_AND_ROAD],
    living: {
      text: 'Residential halls HK$17,290 to HK$37,940 a year; living costs up to HK$50,000 a year (HKU estimate).',
      sourceUrl: HKU_FEES,
    },
  },
  {
    id: 'hkust',
    name: 'The Hong Kong University of Science and Technology',
    shortName: 'HKUST',
    destination: 'HK',
    city: 'Hong Kong',
    admissionsUrl: 'https://join.hkust.edu.hk/admissions/international-qualifications',
    programs: {
      engineering: [
        {
          label: 'School of Engineering (taught in English)',
          teaching: 'English',
          tuition: { amount: 260000, currency: 'HKD', per: 'year', basis: '2027/28 non-local fee' },
          tuitionSourceUrl: HKUST_FEES,
          english: { kind: 'minimum', ielts: 6, toefl120: 80, toefl6: 4.5, sourceUrl: 'https://join.hkust.edu.hk/oas/elar.pdf' },
        },
      ],
      business: [
        {
          label: 'School of Business and Management (taught in English)',
          teaching: 'English',
          tuition: { amount: 260000, currency: 'HKD', per: 'year', basis: '2027/28 non-local fee' },
          tuitionSourceUrl: HKUST_FEES,
          english: { kind: 'minimum', ielts: 6, toefl120: 80, toefl6: 4.5, sourceUrl: 'https://join.hkust.edu.hk/oas/elar.pdf' },
        },
      ],
    },
    windows: [
      {
        entryYear: 2027,
        intake: 'September 2027',
        from: '2026-10-01',
        to: '2027-06-30',
        text: 'Opens early October 2026. Priority round deadline 25 November 2026, then rolling admissions until 30 June 2027.',
      },
    ],
    windowsSourceUrl: 'https://join.hkust.edu.hk/admissions/international-qualifications',
    scholarships: [
      {
        name: 'HKUST admission scholarships (for example the Global Learners Scholarship)',
        kind: 'merit',
        coverage: 'Merit-based; some need a separate application (Future Leaders Award, Beyond Academic Admissions Scholarship)',
        url: HKUST_FEES,
      },
      BELT_AND_ROAD,
    ],
    living: {
      text: 'Accommodation about HK$21,000 to HK$51,000 per residential year; personal expenses about HK$60,000 a year (HKUST estimate).',
      sourceUrl: HKUST_FEES,
    },
  },
  {
    id: 'cuhk',
    name: 'The Chinese University of Hong Kong',
    shortName: 'CUHK',
    destination: 'HK',
    city: 'Hong Kong',
    admissionsUrl: 'https://admission.cuhk.edu.hk/application/overseas-other-qualifications-non-local-international-team/application-guides/',
    programs: {
      engineering: [
        {
          label: 'Faculty of Engineering (taught in English)',
          teaching: 'English',
          tuition: { amount: 214000, currency: 'HKD', per: 'year', basis: '2026-27 non-local fee (2027 fee not yet published)' },
          tuitionSourceUrl: CUHK_FEES,
          english: {
            kind: 'minimum',
            ielts: 6,
            toefl120: 80,
            toefl6: 4.5,
            note: 'Published for 2026 entry and under review for 2027 entry.',
            sourceUrl: 'https://admission.cuhk.edu.hk/application/non-jupas/language-requirements/',
          },
        },
      ],
      business: [
        {
          label: 'CUHK Business School (taught in English)',
          teaching: 'English',
          tuition: { amount: 214000, currency: 'HKD', per: 'year', basis: '2026-27 non-local fee (2027 fee not yet published)' },
          tuitionSourceUrl: CUHK_FEES,
          english: {
            kind: 'minimum',
            ielts: 6,
            toefl120: 80,
            toefl6: 4.5,
            note: 'Published for 2026 entry and under review for 2027 entry.',
            sourceUrl: 'https://admission.cuhk.edu.hk/application/non-jupas/language-requirements/',
          },
        },
      ],
    },
    windows: [],
    lastCycle:
      'CUHK expects to update its 2027 application guides around early October 2026. Last cycle: advance offer round 13 November 2025, regular round 8 January 2026, extended deadline 29 May 2026.',
    windowsSourceUrl:
      'https://admission.cuhk.edu.hk/application/overseas-other-qualifications-non-local-international-team/application-guides/',
    scholarships: [
      {
        name: 'CUHK Admission Scholarships',
        kind: 'merit-auto',
        coverage: 'Awarded on academic or non-academic merit when you are admitted',
        url: 'https://admission.cuhk.edu.hk/fees-financing-your-studies/scholarships/admission-scholarships-for-undergraduates-only/',
      },
      BELT_AND_ROAD,
    ],
  },
  {
    id: 'polyu',
    name: 'The Hong Kong Polytechnic University',
    shortName: 'PolyU',
    destination: 'HK',
    city: 'Hong Kong',
    admissionsUrl: 'https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications',
    programs: {
      engineering: [
        {
          label: 'Faculty of Engineering (taught in English)',
          teaching: 'English',
          tuition: { amount: 200000, currency: 'HKD', per: 'year', basis: '2026/27 non-local fee (2027 fee not yet published)' },
          tuitionSourceUrl: POLYU_FEES,
          english: {
            kind: 'minimum',
            ielts: 6,
            toefl120: 80,
            sourceUrl:
              'https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-english',
          },
        },
      ],
      business: [
        {
          label: 'Faculty of Business (taught in English)',
          teaching: 'English',
          tuition: { amount: 200000, currency: 'HKD', per: 'year', basis: '2026/27 non-local fee (2027 fee not yet published)' },
          tuitionSourceUrl: POLYU_FEES,
          english: {
            kind: 'minimum',
            ielts: 6,
            toefl120: 80,
            sourceUrl:
              'https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-english',
          },
        },
      ],
    },
    windows: [],
    lastCycle:
      'PolyU runs early, main and extended rounds (the extended round is for international applicants only). 2027 dates were not yet published.',
    windowsSourceUrl: 'https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications',
    scholarships: [
      {
        ...BELT_AND_ROAD,
        url: 'https://www.polyu.edu.hk/study/ug/fees-and-scholarships/scholarships/non-local-the-belt-and-road-scholarship',
      },
    ],
  },

  // ---------------------------------------------------------------- Mainland China
  {
    id: 'tsinghua',
    name: 'Tsinghua University',
    shortName: 'Tsinghua',
    destination: 'CN',
    city: 'Beijing',
    admissionsUrl: 'https://international.join-tsinghua.edu.cn/',
    programs: {
      engineering: [
        {
          label: 'Science and engineering programmes (taught in Chinese)',
          teaching: 'Chinese',
          tuition: { amount: 30000, currency: 'CNY', per: 'year', basis: 'Current rate for most programmes' },
          tuitionSourceUrl: TSINGHUA_FEES,
          local: {
            test: 'HSK',
            level: 5,
            note: 'Above 60 in listening, reading and writing. HSK 4 is accepted if you reach HSK 5 in your first year.',
            sourceUrl: TSINGHUA_ELIG,
          },
        },
        {
          label: 'Zijing College: Global Talents in Science and Engineering (taught in English)',
          teaching: 'English',
          tuition: null,
          tuitionNote: 'Fee is set in the programme admission guide on the Tsinghua website.',
          tuitionSourceUrl: 'https://international.join-tsinghua.edu.cn/English_Taught_Programs.htm',
          english: {
            kind: 'unspecified',
            note: 'Official English test results (TOEFL, IELTS or similar) are required from non-native speakers.',
            sourceUrl: TSINGHUA_ELIG,
          },
        },
      ],
      business: [
        {
          label: 'Economics, finance and management (taught in Chinese)',
          teaching: 'Chinese',
          tuition: { amount: 26000, currency: 'CNY', per: 'year', basis: 'Current rate for economics, finance, management and law' },
          tuitionSourceUrl: TSINGHUA_FEES,
          local: {
            test: 'HSK',
            level: 5,
            note: 'Above 60 in listening, reading and writing. HSK 4 is accepted if you reach HSK 5 in your first year.',
            sourceUrl: TSINGHUA_ELIG,
          },
        },
        {
          label: 'Zhishan College: Politics, Economics and Sociology (taught in English)',
          teaching: 'English',
          tuition: null,
          tuitionNote: 'Fee is set in the programme admission guide on the Tsinghua website.',
          tuitionSourceUrl: 'https://international.join-tsinghua.edu.cn/English_Taught_Programs.htm',
          english: {
            kind: 'unspecified',
            note: 'Official English test results (TOEFL, IELTS or similar) are required from non-native speakers.',
            sourceUrl: TSINGHUA_ELIG,
          },
        },
      ],
    },
    windows: [],
    lastCycle:
      '2027 dates not yet published. Last cycle: round 1 from 30 September to 28 November 2025, round 2 from 29 November 2025 to 28 February 2026.',
    windowsSourceUrl: 'https://international.join-tsinghua.edu.cn/Admission1/Schedule.htm',
    scholarships: [
      CSC,
      {
        name: 'Tsinghua University Institutional Scholarship',
        kind: 'merit',
        coverage: 'Funded by alumni and partners; see the freshmen scholarship page',
        url: 'https://international.join-tsinghua.edu.cn/Admission1/Freshmen_Scholarships1.htm',
      },
    ],
    requirements: ['Applicants must be 18 by 1 September of the entry year, or bring supporting documents if younger.'],
  },
  {
    id: 'pku',
    name: 'Peking University',
    shortName: 'PKU',
    destination: 'CN',
    city: 'Beijing',
    admissionsUrl: 'https://isd.pku.edu.cn/en/undergraduate_program.php',
    programs: {
      engineering: [
        {
          label: 'Science and engineering programmes (taught in Chinese)',
          teaching: 'Chinese',
          tuition: { amount: 30000, currency: 'CNY', per: 'year', basis: 'Standard undergraduate rate for science subjects' },
          tuitionNote: 'The 2026 admission guide says the final fee is announced after approval.',
          tuitionSourceUrl: PKU_FEES,
          local: { test: 'HSK', level: 6, note: 'HSK 6 with a score of 210 or higher.', sourceUrl: PKU_SCORES },
        },
      ],
      business: [
        {
          label: 'Economics and management programmes (taught in Chinese)',
          teaching: 'Chinese',
          tuition: { amount: 26000, currency: 'CNY', per: 'year', basis: 'Standard undergraduate rate for humanities subjects' },
          tuitionNote: 'PKU lists 26,000 for humanities and 30,000 for science subjects. Confirm which rate applies to your major.',
          tuitionSourceUrl: PKU_FEES,
          local: { test: 'HSK', level: 6, note: 'HSK 6 with a score of 210 or higher.', sourceUrl: PKU_SCORES },
        },
      ],
    },
    windows: [],
    lastCycle:
      '2027 dates not yet published. Last cycle: round 1 from 19 December 2025 to 28 February 2026, round 2 from 12 June to 10 July 2026.',
    windowsSourceUrl: PKU_GUIDE,
    scholarships: [
      CSC,
      {
        name: 'Beijing Government Scholarship / Peking University Scholarship for International Students',
        kind: 'merit-auto',
        coverage: 'Awarded after the university evaluates your application; no separate application',
        url: PKU_GUIDE,
      },
    ],
    sat: {
      value: 1400,
      kind: 'minimum',
      note: 'PKU asks for SAT 1400 or higher plus three AP exams at 4 or higher (or IB 36+, A-Level and other options).',
    },
    requirements: ['Engineering, science and economics applicants must submit mathematics exam results.'],
  },
  {
    id: 'sjtu',
    name: 'Shanghai Jiao Tong University',
    shortName: 'SJTU',
    destination: 'CN',
    city: 'Shanghai',
    admissionsUrl: 'https://gc.sjtu.edu.cn/admission/international-undergraduate-admission/',
    programs: {
      engineering: [
        {
          label: 'SJTU Global College (taught in English)',
          examples: ['Electrical and Computer Engineering', 'Mechanical Engineering', 'Computer Science and Technology'],
          teaching: 'English',
          tuition: { amount: 120000, currency: 'CNY', per: 'year', basis: 'Estimated tuition for 2026' },
          tuitionSourceUrl: SJTU_FEES,
          english: {
            kind: 'minimum',
            ielts: 6,
            toefl120: 90,
            toefl6: 4.5,
            note: 'A TOEFL score of 5 is recommended on the new scale. HSK 4 is needed to graduate.',
            sourceUrl: SJTU_REQ,
          },
        },
      ],
    },
    windows: [],
    lastCycle: '2027 dates not yet published. Last cycle: regular application deadline 31 March 2026.',
    windowsSourceUrl: SJTU_REQ,
    scholarships: [
      {
        name: 'SJTU First-Class Scholarship',
        kind: 'merit',
        coverage: 'Full tuition, CNY 2,500 a month living allowance, CNY 1,000 a month accommodation subsidy and insurance',
        url: SJTU_FEES,
      },
      CSC,
    ],
    sat: { value: 1350, kind: 'typical', note: 'SJTU Global College publishes an SAT range of 1350 to 1450 for SAT applicants.' },
    requirements: [
      'CSCA score with mathematics. If you have not taken it yet, you can apply with SAT, AP, A-Level or IB and add CSCA by 30 June after pre-admission.',
    ],
  },
  {
    id: 'zju',
    name: 'Zhejiang University',
    shortName: 'ZJU',
    destination: 'CN',
    city: 'Hangzhou',
    admissionsUrl: 'https://iczu.zju.edu.cn/admissionsen/',
    programs: {
      engineering: [
        {
          label: 'Engineering and computing programmes (taught in Chinese)',
          examples: ['Mechanical Engineering', 'Electrical Engineering and Automation', 'Computer Science and Technology', 'Software Engineering'],
          teaching: 'Chinese',
          tuition: { amount: 24800, currency: 'CNY', per: 'year', basis: '2026 programme catalogue' },
          tuitionSourceUrl: ZJU_GUIDE,
          local: {
            test: 'HSK',
            level: 5,
            note: 'HSK 5 with 180 or higher. Computer science programmes also ask non-native English speakers for TOEFL 80 or IELTS 6.5.',
            sourceUrl: ZJU_GUIDE,
          },
        },
      ],
      business: [
        {
          label: 'Economics (taught in Chinese)',
          teaching: 'Chinese',
          tuition: { amount: 24800, currency: 'CNY', per: 'year', basis: '2026 programme catalogue' },
          tuitionSourceUrl: ZJU_GUIDE,
          local: { test: 'HSK', level: 5, note: 'HSK 5 with 210 or higher.', sourceUrl: ZJU_GUIDE },
        },
        {
          label: 'Business Administration (taught in Chinese)',
          teaching: 'Chinese',
          tuition: { amount: 24800, currency: 'CNY', per: 'year', basis: '2026 programme catalogue' },
          tuitionSourceUrl: ZJU_GUIDE,
          local: { test: 'HSK', level: 6, note: 'HSK 6 with 220 or higher.', sourceUrl: ZJU_GUIDE },
        },
        {
          label: 'Global Communication and Management, International Business School (taught in English)',
          teaching: 'English',
          tuition: { amount: 65000, currency: 'CNY', per: 'year', basis: '2026 programme catalogue' },
          tuitionSourceUrl: ZJU_GUIDE,
          english: {
            kind: 'minimum',
            ielts: 6.5,
            toefl120: 80,
            note: 'Duolingo 120 is also accepted. Taught on the Haining International Campus.',
            sourceUrl: ZJU_GUIDE,
          },
        },
      ],
    },
    windows: [],
    lastCycle:
      '2027 dates not yet published. Last cycle: Chinese-taught programmes 1 December 2025 to 28 February 2026; English-taught programmes until 31 May 2026.',
    windowsSourceUrl: ZJU_GUIDE,
    scholarships: [CSC],
    requirements: ['A valid CSCA report is required from all international bachelor applicants since the 2026/27 intake.'],
  },

  // ---------------------------------------------------------------- South Korea
  {
    id: 'kaist',
    name: 'Korea Advanced Institute of Science and Technology',
    shortName: 'KAIST',
    destination: 'KR',
    city: 'Daejeon',
    admissionsUrl: 'https://admission.kaist.ac.kr/intl-undergraduate',
    programs: {
      engineering: [
        {
          label: 'Undergraduate programmes (taught in English)',
          examples: ['School of Computing', 'Electrical Engineering', 'Mechanical Engineering'],
          teaching: 'English',
          tuition: { amount: 6866000, currency: 'KRW', per: 'year', basis: 'Current cost of attendance' },
          tuitionNote: 'Covered in full by the KAIST Scholarship for every admitted international student.',
          coveredForAll: true,
          tuitionSourceUrl: KAIST_COA,
        },
      ],
      business: [
        {
          label: 'Business and Technology Management (taught in English)',
          teaching: 'English',
          tuition: { amount: 6866000, currency: 'KRW', per: 'year', basis: 'Current cost of attendance' },
          tuitionNote: 'Covered in full by the KAIST Scholarship for every admitted international student.',
          coveredForAll: true,
          tuitionSourceUrl: KAIST_COA,
        },
      ],
    },
    windows: [
      {
        entryYear: 2027,
        intake: 'Spring 2027 (early admissions)',
        from: '2026-09-22',
        to: '2026-10-22',
        text: '22 September to 22 October 2026. Results 7 January 2027; studies start at the end of February 2027.',
      },
      {
        entryYear: 2027,
        intake: 'Fall 2027 (regular admissions)',
        from: '2026-11-10',
        to: '2027-01-14',
        text: '10 November 2026 to 14 January 2027. Results 25 March 2027; studies start at the end of August 2027.',
      },
    ],
    windowsSourceUrl: 'https://admission.kaist.ac.kr/intl-undergraduate/application/ApplicationGuide/ApplicationTimeline',
    scholarships: [
      {
        name: 'KAIST Scholarship',
        kind: 'automatic-all',
        coverage:
          'Every admitted international student: full tuition for 8 semesters, KRW 350,000 a month and health insurance (keep a GPA above 2.7 of 4.3)',
        url: 'https://admission.kaist.ac.kr/intl-undergraduate/support/scholarships/kaist',
      },
    ],
    living: {
      text: 'KAIST estimates essential costs (tuition, insurance, books, dormitory and meals) at KRW 14,885,680 a year before the scholarship.',
      sourceUrl: KAIST_COA,
    },
    note: 'The English test requirement is set in the KAIST application guide; check it before you apply.',
  },
  {
    id: 'snu',
    name: 'Seoul National University',
    shortName: 'SNU',
    destination: 'KR',
    city: 'Seoul',
    admissionsUrl: 'https://en.snu.ac.kr/admission/undergraduate/application',
    programs: {
      engineering: [
        {
          label: 'College of Engineering (mostly taught in Korean)',
          teaching: 'Korean',
          tuition: { amount: 2998000, currency: 'KRW', per: 'semester', basis: '2026 tuition table' },
          tuitionSourceUrl: SNU_GUIDE,
          local: {
            test: 'TOPIK',
            level: 3,
            note: 'Or level 4 at a Korean university language centre. English proof is accepted instead: TOEFL iBT 80 (4.0 on the new scale), IELTS 6.0 or TEPS 269.',
            sourceUrl: SNU_GUIDE,
          },
          english: { kind: 'minimum', ielts: 6, toefl120: 80, toefl6: 4, sourceUrl: SNU_GUIDE },
          eitherLanguage: true,
        },
      ],
      business: [
        {
          label: 'College of Business Administration or Economics (mostly taught in Korean)',
          teaching: 'Korean',
          tuition: { amount: 2442000, currency: 'KRW', per: 'semester', basis: '2026 tuition table' },
          tuitionSourceUrl: SNU_GUIDE,
          local: {
            test: 'TOPIK',
            level: 3,
            note: 'Or level 4 at a Korean university language centre. English proof is accepted instead: TOEFL iBT 80 (4.0 on the new scale), IELTS 6.0 or TEPS 269.',
            sourceUrl: SNU_GUIDE,
          },
          english: { kind: 'minimum', ielts: 6, toefl120: 80, toefl6: 4, sourceUrl: SNU_GUIDE },
          eitherLanguage: true,
        },
      ],
    },
    windows: [
      {
        entryYear: 2027,
        intake: 'Spring 2027',
        from: '2026-07-06',
        to: '2026-07-09',
        text: 'The online application ran from 6 to 9 July 2026.',
      },
      {
        entryYear: 2027,
        intake: 'Fall 2027',
        text: 'SNU also admits international students for the fall semester; the fall 2027 guide was not yet published.',
      },
    ],
    windowsSourceUrl: SNU_GUIDE,
    scholarships: [
      {
        name: 'SNU scholarships for admitted international students',
        kind: 'merit',
        coverage: 'See the SNU "before application" scholarship list',
        url: 'https://en.snu.ac.kr/admission/undergraduate/scholarships/before_admission',
      },
      GKS,
    ],
  },
  {
    id: 'yonsei',
    name: 'Yonsei University, Underwood International College',
    shortName: 'Yonsei UIC',
    destination: 'KR',
    city: 'Seoul',
    admissionsUrl: UIC_ADMIT,
    programs: {
      engineering: [
        {
          label: 'Integrated Science and Engineering Division (taught in English)',
          examples: ['Nano Science and Engineering', 'Energy and Environmental Science and Engineering'],
          teaching: 'English',
          tuition: { amount: 8202000, currency: 'KRW', per: 'semester', basis: '2026 international track (first semester KRW 8,416,000)' },
          tuitionSourceUrl: UIC_FEES,
          english: {
            kind: 'unspecified',
            note: 'TOEFL, IELTS, a CEFR certificate or AP/IB English is accepted; no minimum score is published.',
            sourceUrl: UIC_ADMIT,
          },
        },
      ],
      business: [
        {
          label: 'Economics, Underwood Division (taught in English)',
          teaching: 'English',
          tuition: { amount: 8202000, currency: 'KRW', per: 'semester', basis: '2026 international track (first semester KRW 8,416,000)' },
          tuitionSourceUrl: UIC_FEES,
          english: {
            kind: 'unspecified',
            note: 'TOEFL, IELTS, a CEFR certificate or AP/IB English is accepted; no minimum score is published.',
            sourceUrl: UIC_ADMIT,
          },
        },
      ],
    },
    windows: [
      {
        entryYear: 2027,
        intake: 'Spring 2027 (1st round)',
        from: '2026-08-26',
        to: '2026-09-22',
        text: 'Online application 26 August to 22 September 2026, documents by 2 October, online interview 11 to 12 December, results 18 December 2026.',
      },
      {
        entryYear: 2027,
        intake: 'Fall 2027 (2nd round)',
        text: 'Application in March 2027; exact dates to be announced by UIC.',
      },
    ],
    windowsSourceUrl: UIC_ADMIT,
    scholarships: [
      {
        name: 'UIC Admissions Scholarship',
        kind: 'merit-auto',
        coverage: 'Full tuition for 4 years; every international applicant is considered automatically',
        url: UIC_FEES,
      },
      GKS,
    ],
  },

  // ---------------------------------------------------------------- Japan
  {
    id: 'sciencetokyo',
    name: 'Institute of Science Tokyo',
    shortName: 'Science Tokyo',
    destination: 'JP',
    city: 'Tokyo',
    admissionsUrl: 'https://admissions.isct.ac.jp/en/013/undergraduate/programs/gsep',
    programs: {
      engineering: [
        {
          label: 'Global Scientists and Engineers Program, GSEP (taught in English)',
          teaching: 'English',
          tuition: { amount: 635400, currency: 'JPY', per: 'year', basis: 'GSEP 2027 application guide' },
          tuitionNote: 'Plus a one-time enrollment fee of JPY 282,000.',
          tuitionSourceUrl: GSEP,
          english: {
            kind: 'unspecified',
            note: 'A TOEFL iBT, TOEIC Listening and Reading, or IELTS Academic score is required; no minimum is published.',
            sourceUrl: GSEP,
          },
        },
      ],
    },
    windows: [
      {
        entryYear: 2027,
        intake: 'April 2027',
        from: '2026-08-12',
        to: '2026-08-21',
        text: 'Applications closed on 21 August 2026.',
      },
    ],
    lastCycle: 'GSEP applications are usually in mid to late August. The selection process changes from the 2028 intake.',
    windowsSourceUrl: GSEP,
    scholarships: [
      {
        name: 'Japanese Government (MEXT) Scholarship for GSEP',
        kind: 'merit',
        coverage: '8 places: no application, admission or tuition fees plus a monthly stipend for four years',
        url: GSEP,
      },
    ],
    note: 'Formed in October 2024 when Tokyo Institute of Technology merged with Tokyo Medical and Dental University. GSEP admits 8 MEXT scholars and 10 privately funded students a year.',
  },
  {
    id: 'waseda',
    name: 'Waseda University',
    shortName: 'Waseda',
    destination: 'JP',
    city: 'Tokyo',
    admissionsUrl: 'https://www.waseda.jp/inst/admission/en/undergraduate/english/',
    programs: {
      engineering: [
        {
          label: 'English-based programmes in Science and Engineering',
          examples: ['Computer Science and Communications Engineering', 'Mechanical Engineering'],
          teaching: 'English',
          tuition: null,
          tuitionNote: 'Waseda publishes these fees in a PDF on its International Admissions site.',
          tuitionSourceUrl: 'https://www.waseda.jp/inst/admission/en/other/tuition/',
        },
      ],
      business: [
        {
          label: 'School of Political Science and Economics, Economics (English-based)',
          teaching: 'English',
          tuition: {
            amount: 1286000,
            currency: 'JPY',
            per: 'year',
            basis: 'From the second year, based on 2025 figures (first year JPY 1,288,000 including a JPY 200,000 enrollment fee)',
          },
          tuitionSourceUrl: 'https://www.waseda.jp/fpse/pse/en/applicants/tuition/',
        },
      ],
    },
    windows: [
      {
        entryYear: 2027,
        intake: 'September 2027 (Science and Engineering)',
        from: '2027-01-07',
        to: '2027-01-28',
        text: 'English-based programmes: 7 to 28 January 2027.',
      },
    ],
    lastCycle:
      'Political Science and Economics publishes its guide every September; last cycle the online application opened on 8 January 2026.',
    windowsSourceUrl: 'https://www.waseda.jp/fsci/en/admissions_us/',
    scholarships: [
      {
        name: 'Waseda pre-enrollment scholarships',
        kind: 'merit-auto',
        coverage: 'Merit-based, offered with admission; no separate application',
        url: 'https://www.waseda.jp/inst/admission/en/undergraduate/english/',
      },
    ],
    note: 'Japanese is not required to apply for the English-based programmes.',
  },
  {
    id: 'kyoto',
    name: 'Kyoto University (Kyoto iUP)',
    shortName: 'Kyoto iUP',
    destination: 'JP',
    city: 'Kyoto',
    admissionsUrl: 'https://www.iup.kyoto-u.ac.jp/',
    programs: {
      engineering: [
        {
          label: 'Kyoto iUP, Faculty of Engineering (English, then Japanese)',
          teaching: 'English + Japanese',
          tuition: { amount: 535800, currency: 'JPY', per: 'year', basis: 'October 2027 guidelines' },
          tuitionNote: 'Kyoto iUP scholarships waive the admission fee and all or part of tuition for every student.',
          tuitionSourceUrl: IUP,
          english: {
            kind: 'typical',
            ielts: 6.5,
            toefl120: 90,
            toefl6: 4.5,
            note: 'No minimum is set; these are typical scores of successful candidates.',
            sourceUrl: IUP,
          },
        },
      ],
      business: [
        {
          label: 'Kyoto iUP, Faculty of Economics (English, then Japanese)',
          teaching: 'English + Japanese',
          tuition: { amount: 535800, currency: 'JPY', per: 'year', basis: 'October 2027 guidelines' },
          tuitionNote: 'Kyoto iUP scholarships waive the admission fee and all or part of tuition for every student.',
          tuitionSourceUrl: IUP,
          english: {
            kind: 'typical',
            ielts: 6.5,
            toefl120: 90,
            toefl6: 4.5,
            note: 'No minimum is set; these are typical scores of successful candidates.',
            sourceUrl: IUP,
          },
        },
      ],
    },
    windows: [
      {
        entryYear: 2027,
        intake: 'October 2027 (preparatory course)',
        from: '2026-11-02',
        to: '2026-12-03',
        text: 'Applications 2 November to 3 December 2026 (5 p.m. Japan time). The preparatory course starts on 1 October 2027.',
      },
    ],
    windowsSourceUrl: IUP,
    scholarships: [
      {
        name: 'Kyoto iUP scholarship',
        kind: 'automatic-all',
        coverage:
          'Every student: admission fee waived, full or partial tuition waiver for 4.5 years, up to JPY 120,000 a month during the preparatory course, and a university room for the first 12 months',
        url: IUP,
      },
    ],
    note: 'Six-month preparatory course, then four years. No Japanese is needed to apply; the final two years are taught mainly or only in Japanese.',
  },
];

export const DATA_CHECKED_ON = '19 September 2026';
