/*
 * Dormitory and housing facts for international bachelor students, per university.
 * Read on official university pages on 19 September 2026. Housing never changes the
 * fit score; it is shown on each card and turned into checklist tasks.
 */
export type HousingStatus = 'guaranteed' | 'priority' | 'available' | 'limited' | 'unknown';

export interface Housing {
  status: HousingStatus;
  /** Short label for cards and the comparison table. */
  summary: string;
  detail: string;
  /** true when new international students are expected to live in university housing at first. */
  universityHousingFirst?: boolean;
  /** Official rate or fees page when it differs from the accommodation page. */
  costSourceUrl?: string;
  sourceUrl: string;
}

export const HOUSING_LABEL: Record<HousingStatus, string> = {
  guaranteed: 'Guaranteed or provided',
  priority: 'Priority, not guaranteed',
  available: 'Available, apply early',
  limited: 'Limited places',
  unknown: 'See housing website',
};

export const HOUSING: Record<string, Housing> = {
  // ---------------------------------------------------------------- Hong Kong SAR
  hku: {
    status: 'priority',
    summary: 'Reserved places · HK$17,290–37,940/yr',
    detail:
      'HKU reserves some places for non-local students, but limited hall capacity means a place is not guaranteed. Published 2027/28 hall and college fees are HK$17,290–37,940 for 285 days; summer is excluded.',
    sourceUrl: 'https://handbook.hku.hk/ug/full-time-2025-26/notes-for-non-local-students/housing.html',
    costSourceUrl: 'https://admissions.hku.hk/fees-and-scholarships/fees',
  },
  hkust: {
    status: 'priority',
    summary: 'Year-1 priority · HK$21,238–37,310/yr',
    detail:
      'New non-local undergraduates receive priority for hall places, rather than a guarantee. The published 2026/27 annual charge for new non-local undergraduates is HK$21,238–37,310, depending on the hall and room type.',
    sourceUrl: 'https://shrl.hkust.edu.hk/admission-policy/ug/priority-housing',
    costSourceUrl: 'https://shrl.hkust.edu.hk/apply-for-housing/ug/hall-charges-new-non-local',
  },
  cuhk: {
    status: 'guaranteed',
    summary: 'N−2 policy · ~HK$17,000/yr',
    detail:
      'International full-time undergraduates are normally guaranteed college hostel residence for their normative study period minus two years. CUHK lists an approximate 2025/26 hostel charge of HK$17,000; the 2026/27 fee was not yet confirmed on this page.',
    sourceUrl: 'https://admission.cuhk.edu.hk/application/overseas-other-qualifications-non-local-international-team/faq/',
  },
  polyu: {
    status: 'available',
    summary: 'Year 1, subject to space · ~HK$18,515/yr',
    detail:
      'Prospective non-local undergraduates are normally offered a first-year place, subject to hall availability. The 2026/27 full-year lodging fee is HK$18,514.80, with separate function fees and a refundable caution deposit.',
    sourceUrl:
      'https://www.polyu.edu.hk/sao/student-resources-and-support-section/residential-life/hall-admission/hall-applications/prospective-non-local-undergraduate-students/',
  },
  cityu: {
    status: 'priority',
    summary: 'Priority in years 1–2 · HK$20,800/yr',
    detail:
      'Eligible non-local government-funded undergraduates have priority for the first two years. If demand exceeds capacity, allocation may be decided by lot. The published 2026/27 hall fee is HK$20,800 for the academic year.',
    sourceUrl: 'https://www.cityu.edu.hk/sro/StudentHousing/UGHalls/NLS/MOS/NewMainland/',
  },
  hkbu: {
    status: 'guaranteed',
    summary: 'Year 1 provided · HK$17,363–29,484/yr',
    detail:
      'HKBU states that full-time, UGC-funded non-local undergraduates will be provided with a first-year hostel place. Published 2026/27 charges range from HK$17,362.80 to HK$29,484, depending on the hall and room type.',
    sourceUrl: 'https://sa.hkbu.edu.hk/en/accm/on-campus-accommodation/apply-for-ug-accommodation/non-local-freshmen.html',
  },
  lingnan: {
    status: 'available',
    summary: 'Hostel places · fee not published',
    detail:
      'Lingnan lists on-campus hostels for students, with residency governed by its hostel policy. Its current applicant-facing accommodation material does not publish a dormitory price, so confirm the current fee before applying.',
    sourceUrl: 'https://www.ln.edu.hk/osa/student-experience/cultural-integration/planning-your-arrival/accommodation',
  },

  // ---------------------------------------------------------------- Mainland China
  tsinghua: {
    status: 'limited',
    summary: 'Some rooms · fee not published',
    detail:
      'Tsinghua’s Zijing International Student Apartments serve some international students. Rooms must be booked online during the stated period; without a successful booking, students arrange off-campus housing. The current undergraduate fee page does not state a dorm rate.',
    sourceUrl: 'https://international.join-tsinghua.edu.cn/International_Students_Service1/Accommodation.htm',
    costSourceUrl: 'https://international.join-tsinghua.edu.cn/Admission1/Fees.htm',
  },
  pku: {
    status: 'limited',
    summary: 'First-come rooms · CNY180–220/day',
    detail:
      'Peking University’s international student apartments are limited and allocated first come, first served. The published rate is CNY180–220 per person per day, depending on room type; off-campus housing may be needed.',
    sourceUrl: 'https://www.isd.pku.edu.cn/en/6294.php',
  },
  sjtu: {
    status: 'priority',
    summary: 'Freshmen prioritized · from CNY6,600/term',
    detail:
      'SJTU gives international freshmen priority for on-campus housing, but does not guarantee it in later years. The No. 9 student apartment double room for first-year international undergraduates is listed at CNY6,600 per semester; other halls and room types cost more.',
    sourceUrl: 'https://en.sjtu.edu.cn/study-sjtu/current/services/72',
  },
  zju: {
    status: 'limited',
    summary: 'Online booking required · from CNY24,000/yr/room',
    detail:
      'Zhejiang University requires a successful online reservation for on-campus accommodation; without one, it does not arrange a room. Published Zijingang rates include CNY24,000 per academic year for a West-campus single room and CNY36,000 for some twin rooms, charged per room.',
    sourceUrl: 'https://iczu.zju.edu.cn/iczuen/wnwcampus/list.htm',
  },
  fudan: {
    status: 'limited',
    summary: 'Limited booking · CNY65–120/day',
    detail:
      'Fudan allocates campus rooms through online booking, which can fill and move applicants to a waiting list. Its published rate table lists long-term rooms from CNY65 to CNY120 per day, depending on the building and room type.',
    sourceUrl: 'https://iso.fudan.edu.cn/isoenglish/OnlineApplicationforCampusDormitory/list.htm',
    costSourceUrl: 'https://iso.fudan.edu.cn/isoenglish/8d/39/c55479a167225/page.htm',
  },
  cuhksz: {
    status: 'available',
    summary: 'Campus rooms · CNY2,400/yr',
    detail:
      'CUHK-Shenzhen lists on-campus accommodation at CNY2,400 per academic year for international students. Students who want to live off campus must follow the university’s accommodation procedure.',
    sourceUrl: 'https://intladmissions.cuhk.edu.cn/en/taxonomy/term/151',
  },
  xjtlu: {
    status: 'available',
    summary: 'Partner apartments · from CNY50/day',
    detail:
      'XJTLU directs students to accommodation provided by a state-owned partner company rather than a university hall. Its published undergraduate contract rate is CNY57 per day, with listed alternatives from CNY50 to CNY62 per day.',
    sourceUrl: 'https://www.xjtlu.edu.cn/en/admissions/global/accommodation',
  },
  beihang: {
    status: 'available',
    summary: 'Book ahead · CNY30/day in Beijing',
    detail:
      'Beihang requires a dormitory booking after an offer. Its 2026 undergraduate notice lists a Beijing-campus double room at CNY30 per bed per day; Hangzhou-campus double rooms are CNY2,000–2,500 per academic year. Utilities are separate.',
    sourceUrl: 'https://is.buaa.edu.cn/info/1027/2323.htm',
  },
  unnc: {
    status: 'guaranteed',
    summary: 'Guaranteed for international offer holders · CNY11k–20k/yr',
    detail:
      'University of Nottingham Ningbo China states that international students who accept an offer are guaranteed a campus room. Its 2026 international-student guide lists annual rooms from CNY11,000 to CNY20,000, depending on the building and room type.',
    sourceUrl: 'https://www.nottingham.edu.cn/en/study-with-us/global-recruitment/home.aspx',
    costSourceUrl: 'https://www.nottingham.edu.cn/en/Study-with-us/documents/Guide/International-student-guide-2026.pdf',
  },

  // ---------------------------------------------------------------- South Korea
  kaist: {
    status: 'available',
    summary: 'Campus dorm · KRW1,328,000/yr',
    detail:
      'KAIST includes a two-person Heemang Hall room in its published undergraduate cost of attendance at KRW166,000 per month for eight months, or KRW1,328,000 per academic year. Confirm room allocation and the current rate with KAIST Housing.',
    sourceUrl: 'https://admission.kaist.ac.kr/intl-undergraduate/support/coa',
  },
  snu: {
    status: 'available',
    summary: 'Apply after admission · KRW143,000–284,400/mo',
    detail:
      'Seoul National University’s Gwanak residence hall accepts applications from eligible new undergraduates after admission. Published monthly management fees range from KRW143,000 to KRW284,400, depending on the building and room type, with a matching deposit in many cases.',
    sourceUrl: 'https://snudorm.snu.ac.kr/%EC%83%9D%ED%99%9C%EA%B4%80-%EC%A0%95%EB%B3%B4/%ED%95%99%EC%83%9D%EC%83%9D%ED%99%9C%EA%B4%80/%EC%9E%85%EC%A3%BC%EC%95%88%EB%82%B4/%EA%B4%80%EB%A6%AC%EB%B9%84/',
  },
  yonsei: {
    status: 'guaranteed',
    summary: 'Residential College in year 1 · US$656–753/term',
    detail:
      'All Yonsei UIC freshmen live at the International Campus in Songdo as part of the Residential College program. The published accommodation fee is US$656–753 per 16-week term, depending on the room arrangement.',
    universityHousingFirst: true,
    sourceUrl: 'https://uic.yonsei.ac.kr/main/student.php?mid=m05_02',
  },
  postech: {
    status: 'guaranteed',
    summary: 'Residential College required in year 1 · fee after admission',
    detail:
      'All first-year POSTECH undergraduates are required to live in the Residential College. The official international welcome guide says detailed payment instructions are issued later, so it does not publish a current dormitory rate.',
    universityHousingFirst: true,
    sourceUrl: 'https://adm-iu.postech.ac.kr/user/comm/menu/ba6492f421eff5cdad5694ac88469538/content/index.do',
  },
  unist: {
    status: 'unknown',
    summary: 'Check UNIST Housing · fee not published',
    detail:
      'UNIST’s official international admissions housing page directs students to UNIST Housing, but does not state a public undergraduate room guarantee or a current room charge. Check the linked housing page when your admission date is known.',
    sourceUrl: 'https://admu-intl.unist.ac.kr/admission-eng/life/housing.do',
  },
  gist: {
    status: 'available',
    summary: 'Eligible, capacity-limited · KRW90,100/mo',
    detail:
      'All GIST undergraduates are eligible to apply, but housing admission can be restricted by capacity or other circumstances. A 2026 Spring official notice lists a two-person undergraduate room at KRW90,100 per month; rates can change.',
    sourceUrl: 'https://www.gist.ac.kr/en/html/sub05/05030403.html',
    costSourceUrl: 'https://ipa.gist.ac.kr/site/kr/html/sub05/050209.html?GotoPage=1&mode=V&no=220403',
  },

  // ---------------------------------------------------------------- Japan
  sciencetokyo: {
    status: 'priority',
    summary: 'Year 1, subject to approval · JPY27,500/mo',
    detail:
      'Science Tokyo’s GSEP says first-year students are assigned a dormitory subject to administrative approval. Its 2026 welcome information lists Umegaoka rent at JPY27,500 per month plus a JPY20,000 entrance fee.',
    universityHousingFirst: true,
    sourceUrl: 'https://www.tse.ens.titech.ac.jp/~gsep/student-life/',
    costSourceUrl: 'https://www.tse.ens.titech.ac.jp/~gsep/new-students-welcome-page/',
  },
  waseda: {
    status: 'limited',
    summary: 'By selection · JPY55,000/mo',
    detail:
      'Waseda’s directly managed residences use a selection process rather than guaranteeing a room. Its 2026 WISH residence information lists JPY55,000 per month including utilities; other residences have different charges.',
    sourceUrl: 'https://www.waseda.jp/inst/rlc/en/undergraduate/application/',
    costSourceUrl: 'https://admission-ebro.w.waseda.jp/ebro/ug/admissions_en_2026/pageindices/index22.html',
  },
  kyoto: {
    status: 'guaranteed',
    summary: 'Allocated in year 1 · JPY14,500–47,200/mo',
    detail:
      'Kyoto iUP students are allocated an International House room for their first 12 months, with an extension of up to six months possible. Published incoming-student single-room charges across the International Houses range from JPY14,500 to JPY47,200 per month, depending on location and room.',
    universityHousingFirst: true,
    sourceUrl: 'https://kuiso.oc.kyoto-u.ac.jp/en/housing/facilities/',
    costSourceUrl: 'https://www.iup.kyoto-u.ac.jp/Application_Guidelines_for_October_2027_Enrollment.pdf',
  },
  nagoya: {
    status: 'guaranteed',
    summary: 'Myoken for first 6 months · ~JPY32,000/mo',
    detail:
      'Nagoya G30 undergraduates are housed in Myoken for their first six months. The university’s housing information gives approximate rent of JPY32,000 per month for a furnished room, plus estimated utilities of JPY6,000–12,000 per month.',
    universityHousingFirst: true,
    sourceUrl: 'https://admissions.g30.nagoya-u.ac.jp/faqs',
    costSourceUrl: 'https://admissions.g30.nagoya-u.ac.jp/wp-content/uploads/2024/05/Housing-Information.pdf',
  },
  apu: {
    status: 'guaranteed',
    summary: 'AP House in year 1 · JPY56,800/mo',
    detail:
      'APU’s international first-year entrants are placed in AP House, although the building is not guaranteed. For 2027 enrolment, APU lists JPY56,800 monthly rent before enrolment and a JPY243,600 entrance payment that includes the entrance fee, deposit, and two months’ rent.',
    universityHousingFirst: true,
    sourceUrl: 'https://admissions.apu.ac.jp/student_life/housing/',
    costSourceUrl: 'https://admissions.apu.ac.jp/costs_scholarships/tuition_fees/',
  },
  keio: {
    status: 'available',
    summary: 'International dorms · price varies by residence',
    detail:
      'Keio offers several residences for international students, subject to each residence’s application and capacity. The university does not publish a single dormitory price: check the current applicant terms for the residence you choose.',
    sourceUrl: 'https://www.keio.ac.jp/en/admissions/housing/',
  },
};
