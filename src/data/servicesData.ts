export interface ServiceFeature {
  title: string;
  description: string;
  iconName: string;
  highlightTag?: string;
  deliverables: string[];
}

export const SERVICES: ServiceFeature[] = [
  {
    title: 'Profile Evaluation & Career Blueprint',
    description: 'Deep-dive analysis of your academic transcripts, GRE/GMAT/IELTS scores, extracurriculars, research papers, and long-term career aspirations.',
    iconName: 'Compass',
    highlightTag: 'Foundational Step',
    deliverables: [
      'Comprehensive 12-page Candidate Strength Matrix',
      'Gap identification & profile enhancement roadmap (certifications, research, projects)',
      'Career trajectory mapping with expected 5-year post-grad ROI',
      'Target country recommendation matched to budget and immigration goals',
    ],
  },
  {
    title: 'Data-Driven University Shortlisting',
    description: 'Using real admission algorithms and past cohort statistics to curate a balanced 3-tier portfolio of Dream, Reach, and Safe universities.',
    iconName: 'GraduationCap',
    highlightTag: '99% Admit Guarantee',
    deliverables: [
      'Personalized selection of 8-12 top global institutions',
      'Rigorous ROI comparison (Tuition fees vs Median starting salary)',
      'Intake deadline tracker and departmental prerequisite audit',
      'Professor research alignment for thesis-based MS and PhD applicants',
    ],
  },
  {
    title: 'SOP, LOR & Personal Essay Masterclass',
    description: 'Transform your personal journey into a compelling narrative that captivates admissions committees at Ivy League and Russell Group institutions.',
    iconName: 'FileText',
    highlightTag: 'Zero Plagiarism / Zero AI Slop',
    deliverables: [
      '1-on-1 brainstorming sessions with Ivy League/Oxbridge alumni editors',
      'Up to 5 rigorous iterative drafting cycles per university',
      'Tailored Letters of Recommendation (Academic & Professional LORs)',
      'Resume/CV reformatting to international ATS and academic standards',
    ],
  },
  {
    title: 'Standardized Test Prep & Score Maximizer',
    description: 'Bespoke coaching for IELTS, TOEFL, GRE, GMAT, SAT, and PTE with certified master trainers and adaptive practice mocks.',
    iconName: 'Award',
    highlightTag: 'Average +15 GRE / 8.0 IELTS',
    deliverables: [
      'Small batch interactive classes + 1-on-1 doubt clearing',
      'Over 50 full-length timed diagnostic mock exams',
      'Sectional masteries (GRE Quantitative 168+ strategies & IELTS Speaking mock drills)',
      'Test fee discount vouchers and official booking assistance',
    ],
  },
  {
    title: 'Scholarship Procurement & Financial Aid',
    description: 'Unlocking external fellowships, government grants, university-specific merit aid, and competitive education loan rates.',
    iconName: 'BadgeDollarSign',
    highlightTag: '$24M+ Won by Students',
    deliverables: [
      'Dedicated scholarship essay tailoring (Fulbright, Chevening, DAAD, Erasmus)',
      'On-campus Graduate Assistantship (TA/RA) application mentorship',
      'Education loan tie-ups with leading public/private lenders with zero collateral options',
      'Living cost budget planning and currency forex lock advice',
    ],
  },
  {
    title: 'Visa Filing & High-Stakes Mock Interviews',
    description: 'Flawless documentation, DS-160/CAS preparation, financial asset documentation, and simulated mock interviews with former consular officers.',
    iconName: 'ShieldCheck',
    highlightTag: '98.6% Visa Approval Rate',
    deliverables: [
      'Document verification checklist ensuring 100% compliance',
      '3 full-length video mock interviews with tricky question drills',
      'Blocked account setup assistance for Germany and GIC for Canada',
      'Emergency visa appointment scheduling assistance',
    ],
  },
  {
    title: 'Pre-Departure, Housing & Campus Landing',
    description: 'Step smoothly onto your new campus with verified student accommodation, international SIM cards, health insurance, and local alumni networks.',
    iconName: 'PlaneTakeoff',
    highlightTag: 'Peace of Mind for Families',
    deliverables: [
      'Pre-departure orientation covering airport customs, cultural nuances & safety',
      'Verified student housing partnerships (Amber, Casita, University dorms)',
      'Free international bank account and forex card setup before flying',
      'Upbeat Global Alumni Chapter introductions in your destination city',
    ],
  },
];
