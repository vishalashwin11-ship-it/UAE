export interface SuccessStory {
  id: string;
  studentName: string;
  avatar: string;
  destination: string;
  flag: string;
  admittedUniversity: string;
  degreeProgram: string;
  scholarshipWon: string;
  undergradProfile: string;
  testScores: string;
  strategyHighlight: string;
  currentRole: string;
  quote: string;
  intakeYear: string;
}

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'ananya-cmu',
    studentName: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    destination: 'United States',
    flag: '🇺🇸',
    admittedUniversity: 'Carnegie Mellon University (CMU)',
    degreeProgram: 'MS in Computer Science & Machine Learning',
    scholarshipWon: '$38,000 Dean’s Merit Fellowship',
    undergradProfile: 'Tier-2 Engineering College • 8.4 CGPA',
    testScores: 'GRE 328 (Q169, V159) • TOEFL 112',
    strategyHighlight: 'Transformed an open-source GitHub contribution into a stellar research narrative for CMU admissions committee. Re-architected SOP across 4 review drafts.',
    currentRole: 'AI Research Engineer @ Google Mountain View',
    quote: 'Upbeat completely altered the course of my career. Coming from a non-IIT background, I thought CMU was out of reach. My counselor believed in my research narrative and pushed every single sentence of my SOP until it sparkled.',
    intakeYear: 'Fall Admit',
  },
  {
    id: 'karan-imperial',
    studentName: 'Karan Mehra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    destination: 'United Kingdom',
    flag: '🇬🇧',
    admittedUniversity: 'Imperial College London',
    degreeProgram: 'MSc in Financial Technology & Risk Management',
    scholarshipWon: '£15,000 Imperial Business Scholarship',
    undergradProfile: 'Commerce Graduate • 78% aggregate',
    testScores: 'GMAT Focus 685 • IELTS 8.0',
    strategyHighlight: 'Positioned non-engineering background as an asset for quantitative fintech by crafting a customized mathematics bridge portfolio.',
    currentRole: 'Algorithmic Risk Analyst @ Barclays Investment Bank London',
    quote: 'The 1-year Master’s in London was intense, but Upbeat’s pre-departure career coaching and CV restructuring landed me summer interviews before I even flew to Heathrow!',
    intakeYear: 'Fall Admit',
  },
  {
    id: 'sneha-tum',
    studentName: 'Sneha Patel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    destination: 'Germany',
    flag: '🇩🇪',
    admittedUniversity: 'Technical University of Munich (TUM)',
    degreeProgram: 'MSc in Automotive Software Engineering',
    scholarshipWon: 'Zero Tuition + €934/mo DAAD Living Grant',
    undergradProfile: 'Mechanical Engineering • 8.7 CGPA',
    testScores: 'GRE 321 (Q168) • Goethe-Zertifikat B1',
    strategyHighlight: 'Mastered the complex TUM Eignungsfeststellungsverfahren (curricular analysis) with perfect credit-matching documentation.',
    currentRole: 'Autonomous Driving Systems Engineer @ BMW Group Munich',
    quote: 'Studying tuition-free at TUM while living in Bavaria was a dream. Upbeat helped me navigate the stringent German APS certification, blocked accounts, and university credit matrices with zero stress.',
    intakeYear: 'Winter Admit',
  },
  {
    id: 'rohit-toronto',
    studentName: 'Rohit Shenoy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    destination: 'Canada',
    flag: '🇨🇦',
    admittedUniversity: 'University of Toronto (U of T)',
    degreeProgram: 'Master of Management Analytics (MMA)',
    scholarshipWon: 'CAD $22,000 Entrance Award',
    undergradProfile: 'Computer Science • 8.1 CGPA',
    testScores: 'GRE 324 • IELTS 8.5',
    strategyHighlight: 'Targeted competitive Rotman School of Management analytics program with live video interview coaching and case study rehearsals.',
    currentRole: 'Lead Analytics Consultant @ RBC Royal Bank Toronto',
    quote: 'Upbeat’s mock interview sessions gave me the confidence to nail Toronto’s behavioral Kira video assessments. Now working in downtown Toronto on a 3-year PGWP!',
    intakeYear: 'Fall Admit',
  },
  {
    id: 'priya-melbourne',
    studentName: 'Priya Nambiar',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    destination: 'Australia',
    flag: '🇦🇺',
    admittedUniversity: 'University of Melbourne',
    degreeProgram: 'Master of Biomedical Science',
    scholarshipWon: 'AUD $30,000 Melbourne International Fee Remission',
    undergradProfile: 'Biotechnology • 8.9 CGPA',
    testScores: 'PTE Academic 86/90',
    strategyHighlight: 'Direct outreach to university lab heads for research co-sponsorship; secured G8 fee waiver based on undergraduate symposium presentation.',
    currentRole: 'Clinical Research Associate @ CSL Behring Melbourne',
    quote: 'The G8 admissions landscape can be daunting, but Upbeat made the entire process seamless. Their visa team handled my Subclass 500 visa within just 11 days!',
    intakeYear: 'Semester 1 Admit',
  },
  {
    id: 'tarun-trinity',
    studentName: 'Tarun Varma',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    destination: 'Ireland',
    flag: '🇮🇪',
    admittedUniversity: 'Trinity College Dublin (TCD)',
    degreeProgram: 'MSc in Computer Science (Future Networked Systems)',
    scholarshipWon: '€8,000 Global Excellence Scholarship',
    undergradProfile: 'IT Engineering • 7.9 CGPA',
    testScores: 'IELTS 7.5',
    strategyHighlight: 'Built an impressive industrial portfolio highlighting cloud network projects to offset a modest GPA, capturing TCD faculty attention.',
    currentRole: 'Cloud Network Architect @ Stripe Dublin',
    quote: 'Dublin is packed with top tech headquarters. Upbeat’s networking masterclass taught me how to connect with recruiters on LinkedIn before I even graduated.',
    intakeYear: 'Autumn Admit',
  },
  {
    id: 'zayd-khalifa',
    studentName: 'Zayd Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    destination: 'United Arab Emirates',
    flag: '🇦🇪',
    admittedUniversity: 'Khalifa University (Abu Dhabi)',
    degreeProgram: 'MSc in Artificial Intelligence & Robotics',
    scholarshipWon: '100% Tuition Waiver + AED 8,000/mo Research Stipend',
    undergradProfile: 'Computer Engineering • 8.6 CGPA',
    testScores: 'GRE 325 (Q168) • IELTS 8.0',
    strategyHighlight: 'Coached on research proposal defense for Khalifa University faculty panel, securing full graduate fellowship and fast-track UAE Golden Visa nomination.',
    currentRole: 'Autonomous Robotics Researcher @ Technology Innovation Institute (TII) Abu Dhabi',
    quote: 'Studying in the UAE with zero taxes and full research funding was the best career decision of my life. Upbeat’s mentorship on my research statement was world-class.',
    intakeYear: 'Fall Admit',
  },
];
