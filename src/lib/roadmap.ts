/*
 * Builds the action plan (timeline milestones) and the checklist from a profile
 * and its top matches. Tasks only reference facts from the dataset.
 */
import { DESTINATIONS, type DestinationId } from '../data/destinations';
import type { Match } from './scoring';
import type { Profile } from './profile';

export type MilestoneId = 'documents' | 'language' | 'applications' | 'scholarships' | 'visa';

export interface Task {
  id: string;
  milestone: MilestoneId;
  title: string;
  detail?: string;
  url?: string;
}

export interface Milestone {
  id: MilestoneId;
  title: string;
  summary: string;
}

export const MILESTONES: Milestone[] = [
  { id: 'documents', title: 'Documents', summary: 'Transcripts, passport, letters and your statement.' },
  { id: 'language', title: 'Language tests', summary: 'The English or local-language scores your matches ask for.' },
  { id: 'applications', title: 'Applications', summary: 'Submit to your matches inside each window.' },
  { id: 'scholarships', title: 'Scholarships', summary: 'Government and university funding you can use.' },
  { id: 'visa', title: 'Visa and arrival', summary: 'Student visa steps once you accept an offer.' },
];

export function buildTasks(profile: Profile, top: Match[]): Task[] {
  const tasks: Task[] = [];
  const dests = [...new Set(top.map((m) => m.university.destination))] as DestinationId[];

  // Documents
  tasks.push(
    {
      id: 'doc-transcripts',
      milestone: 'documents',
      title: 'Request official transcripts for your last high school years',
      detail: 'Ask your school for an English translation certified by the school or a notary, as universities require.',
    },
    {
      id: 'doc-passport',
      milestone: 'documents',
      title: 'Check your passport expiry date',
      detail: 'Visa applications need a valid passport. Renew early if it expires during your studies.',
    },
    {
      id: 'doc-statement',
      milestone: 'documents',
      title: 'Draft your personal statement',
      detail: `Explain why ${profile.focus ? profile.focus.toLowerCase() : 'your field'} and why each university. Reuse the core, tailor the ending.`,
    },
  );
  const needLetters = top.filter((m) => ['kaist', 'snu'].includes(m.university.id)).map((m) => m.university.shortName);
  tasks.push({
    id: 'doc-recommendation',
    milestone: 'documents',
    title: needLetters.length ? 'Ask a teacher for a recommendation letter' : 'Check whether your universities want recommendation letters',
    detail: needLetters.length
      ? `${needLetters.join(' and ')} ${needLetters.length > 1 ? 'ask' : 'asks'} for a recommendation letter with a fixed deadline. Give your teacher plenty of time.`
      : 'Each university lists its required documents in its application guide.',
  });

  // Language
  const english = top.filter((m) => m.option.english && !m.option.local);
  if (english.length > 0) {
    const needed = english
      .map((m) => m.option.english?.ielts)
      .filter((v): v is number => typeof v === 'number');
    const target = needed.length ? Math.max(...needed) : null;
    const hasScore = profile.englishTest !== 'none' && profile.englishScore !== null;
    tasks.push({
      id: 'lang-english',
      milestone: 'language',
      title: hasScore
        ? 'Confirm your English score is valid on each application date'
        : `Book IELTS Academic or TOEFL iBT${target ? ` (aim for IELTS ${target} or higher)` : ''}`,
      detail: 'Each university sets its own rules on which tests and test dates it accepts.',
    });
  }
  const hskNeed = top.map((m) => (m.option.local?.test === 'HSK' ? m.option.local.level : 0)).reduce((a, b) => Math.max(a, b), 0);
  if (hskNeed > 0) {
    tasks.push({
      id: 'lang-hsk',
      milestone: 'language',
      title: profile.hsk >= hskNeed ? `Keep your HSK ${profile.hsk} certificate ready` : `Reach HSK ${hskNeed}`,
      detail: 'Chinese-taught bachelor programmes list HSK 5 or HSK 6 minimums.',
    });
  }
  const topikNeed = top.map((m) => (m.option.local?.test === 'TOPIK' ? m.option.local.level : 0)).reduce((a, b) => Math.max(a, b), 0);
  if (topikNeed > 0) {
    tasks.push({
      id: 'lang-topik',
      milestone: 'language',
      title: profile.topik >= topikNeed ? `Keep your TOPIK ${profile.topik} certificate ready` : `Take TOPIK (level ${topikNeed} or higher)`,
      detail: 'SNU accepts TOPIK 3, or English scores, but most classes are in Korean.',
    });
  }
  if (dests.includes('CN')) {
    tasks.push({
      id: 'lang-csca',
      milestone: 'language',
      title: 'Register for the CSCA test',
      detail: 'Chinese universities now ask international bachelor applicants for CSCA results. Check test dates on csca.cn.',
      url: 'https://www.csca.cn/',
    });
  }

  // Applications
  for (const m of top) {
    tasks.push({
      id: `apply-${m.university.id}`,
      milestone: 'applications',
      title: `Apply to ${m.university.shortName}`,
      detail: m.windowText,
      url: m.university.admissionsUrl,
    });
  }

  // Scholarships
  for (const d of dests) {
    const s = DESTINATIONS[d].scholarship;
    tasks.push({ id: `sch-${d}`, milestone: 'scholarships', title: `Check the ${s.name}`, detail: s.text, url: s.url });
  }
  if (top.some((m) => m.university.id === 'kaist')) {
    tasks.push({
      id: 'sch-kaist',
      milestone: 'scholarships',
      title: 'Tick "KAIST scholarship" on your KAIST application',
      detail: 'It is in the Statement of Financial Resources section. There is no separate scholarship application.',
      url: 'https://admission.kaist.ac.kr/intl-undergraduate/support/scholarships/kaist',
    });
  }
  const auto = top.filter(
    (m) => m.university.id !== 'kaist' && m.university.scholarships.some((s) => s.kind === 'automatic-all' || s.kind === 'merit-auto'),
  );
  if (auto.length > 0) {
    tasks.push({
      id: 'sch-university',
      milestone: 'scholarships',
      title: `Make your ${auto.map((m) => m.university.shortName).join(' and ')} application as strong as possible`,
      detail: 'These universities consider applicants for their scholarships automatically, with no extra form.',
    });
  }

  // Visa and arrival
  for (const d of dests) {
    const v = DESTINATIONS[d].visa;
    tasks.push({ id: `visa-${d}`, milestone: 'visa', title: `Plan your ${DESTINATIONS[d].short} student visa`, detail: v.text, url: v.url });
  }
  tasks.push({
    id: 'visa-funds',
    milestone: 'visa',
    title: 'Prepare proof of funds and a first-year budget',
    detail: 'Visa offices and universities often ask for bank statements. Add housing and living costs to tuition.',
  });

  return tasks;
}
