export type EducationalTrack =
  | 'all'
  | 'thanawya_science'
  | 'thanawya_arts'
  | 'languages'
  | 'commerce_diploma'
  | 'technical_secondary'
  | 'technical_industrial'
  | 'university_courses'
  | 'university'
  | 'general'
  | 'free_courses'
  | 'accounting_hub'
  | 'quiz_bank'
  | 'gamification_dashboard'
  | 'accounting_sandbox';

export type PlanFilter = 'all' | 'free' | 'vip' | 'paid';

export interface SummaryPage {
  pageNumber: number;
  title: string;
  content: string[];
  keyFormulas?: string[];
  examTip?: string;
}

export interface SummaryItem {
  id: string;
  title: string;
  subject: string;
  track: EducationalTrack;
  trackLabel: string;
  description: string;
  author: string;
  pagesCount: number;
  fileSize: string;
  term: string;
  year: string;
  featured?: boolean;
  colorScheme: string;
  tags: string[];
  pages: SummaryPage[];
  planType?: 'free' | 'vip' | 'paid';
  priceBadge?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  keyTakeaways?: string[];
  videoUrl?: string;
}

export interface VideoCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  description: string;
  duration: string;
  lessonsCount: number;
  level: string;
  badgeColor: string;
  lessons: CourseLesson[];
  track?: EducationalTrack;
  planType?: 'free' | 'vip' | 'paid';
  priceBadge?: string;
}

export interface QuizQuestion {
  id: string;
  track: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AccountingTransaction {
  id: string;
  scenario: string;
  date: string;
  correctDebitAccount: string;
  correctCreditAccount: string;
  amount: number;
  explanation: string;
  difficulty: string;
}

export interface EducationNewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  source: string;
  isHot?: boolean;
}
