export interface University {
  name: string;
  rank: string;
  city: string;
  acceptanceRate: string;
  popularCourses: string[];
}

export interface CareerInsight {
  title: string;
  avgSalary: string;
  demandLevel: 'High' | 'Very High' | 'Critical Shortage';
  topEmployers: string[];
}

export interface Destination {
  id: string;
  name: string;
  code: string;
  flag: string;
  tagline: string;
  heroImage: string;
  description: string;
  avgTuitionYear: string;
  livingCostYear: string;
  postStudyWorkVisa: string;
  visaSuccessRate: string;
  intakes: string[];
  keyHighlights: string[];
  topUniversities: University[];
  topCareers: CareerInsight[];
  scholarships: string[];
  workRights: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'usa',
    name: 'United States',
    code: 'USA',
    flag: '🇺🇸',
    tagline: 'Global Leader in Innovation, Tech & Silicon Valley Careers',
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    description: 'Home to the Ivy League and premier research powerhouses. The US offers unparalleled industry ties, entrepreneurial incubators, and high-earning STEM careers.',
    avgTuitionYear: '$28,000 - $55,000',
    livingCostYear: '$14,000 - $22,000',
    postStudyWorkVisa: '3 Years (STEM OPT) / 1 Year (Non-STEM)',
    visaSuccessRate: '97.8%',
    intakes: ['Fall (August/September)', 'Spring (January)', 'Summer (May)'],
    keyHighlights: [
      '3-Year STEM OPT extension allows working at US companies without lottery visa',
      'Highest starting compensation packages globally for engineers and business grads',
      'Over 4,000 accredited universities with flexible interdisciplinary curricula',
      'Extensive on-campus research assistantships (RA) and teaching assistantships (TA)',
    ],
    topUniversities: [
      { name: 'MIT & Stanford', rank: '#1 & #3 Global', city: 'Cambridge / Palo Alto', acceptanceRate: '4-7%', popularCourses: ['AI & Robotics', 'Computer Systems', 'Biotechnology'] },
      { name: 'Columbia University', rank: '#12 Global', city: 'New York, NY', acceptanceRate: '6%', popularCourses: ['Financial Engineering', 'Data Science', 'MBA'] },
      { name: 'Carnegie Mellon University', rank: '#28 Global', city: 'Pittsburgh, PA', acceptanceRate: '11%', popularCourses: ['Software Engineering', 'Human-Computer Interaction'] },
      { name: 'University of Texas at Austin', rank: '#58 Global', city: 'Austin, TX', acceptanceRate: '29%', popularCourses: ['Aerospace', 'Semiconductors', 'Business Analytics'] },
    ],
    topCareers: [
      { title: 'AI & Machine Learning Engineer', avgSalary: '$135,000 - $185,000', demandLevel: 'Critical Shortage', topEmployers: ['Google', 'Meta', 'NVIDIA', 'OpenAI'] },
      { title: 'Quantitative Financial Analyst', avgSalary: '$120,000 - $160,000', demandLevel: 'Very High', topEmployers: ['Goldman Sachs', 'Morgan Stanley', 'Two Sigma'] },
      { title: 'Cloud Solutions Architect', avgSalary: '$115,000 - $150,000', demandLevel: 'Very High', topEmployers: ['Amazon AWS', 'Microsoft', 'Oracle'] },
      { title: 'Biomedical & Clinical Scientist', avgSalary: '$95,000 - $130,000', demandLevel: 'High', topEmployers: ['Pfizer', 'Moderna', 'Johnson & Johnson'] },
    ],
    scholarships: [
      'Fulbright Foreign Student Program ($25k-$50k)',
      'University Dean Fellowship & Merit Grants ($10k-$30k)',
      'Graduate Teaching/Research Assistantships (Full tuition waiver + stipend)',
    ],
    workRights: '20 hrs/week on-campus during semesters; 40 hrs/week in breaks; Full-time CPT internships.',
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    code: 'GBR',
    flag: '🇬🇧',
    tagline: 'World-Renowned Prestige & Accelerated 1-Year Master’s',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    description: 'Historic academic excellence featuring Oxford, Cambridge, and London financial epicenter. Complete your Master’s degree in just 12 months with significant tuition savings.',
    avgTuitionYear: '£16,000 - £34,000',
    livingCostYear: '£12,000 - £15,000',
    postStudyWorkVisa: '2 Years (Graduate Route) / 3 Years (PhD)',
    visaSuccessRate: '99.1%',
    intakes: ['September/October (Main)', 'January/February'],
    keyHighlights: [
      'Fast-track 1-Year Master’s programs reduce living and tuition expenses by 50%',
      '2-Year unsponsored Graduate Route visa to work in London and across the UK',
      'Global financial capital with top European headquarters and tech innovation hubs',
      'No GRE/GMAT required for many Russell Group postgraduate programs',
    ],
    topUniversities: [
      { name: 'Imperial College London', rank: '#2 Global', city: 'London', acceptanceRate: '12%', popularCourses: ['Computing & AI', 'Mechanical Eng', 'Fintech'] },
      { name: 'University of Oxford & Cambridge', rank: '#3 & #5 Global', city: 'Oxford / Cambridge', acceptanceRate: '14%', popularCourses: ['Law', 'Economics', 'Biomedical Science'] },
      { name: 'University of Edinburgh', rank: '#27 Global', city: 'Edinburgh', acceptanceRate: '30%', popularCourses: ['Informatics', 'Renewable Energy', 'Medicine'] },
      { name: 'University of Manchester', rank: '#34 Global', city: 'Manchester', acceptanceRate: '35%', popularCourses: ['Aerospace', 'International Business', 'Data Science'] },
    ],
    topCareers: [
      { title: 'Investment Banking & Private Equity', avgSalary: '£65,000 - £95,000', demandLevel: 'Very High', topEmployers: ['Barclays', 'HSBC', 'Blackstone', 'JPMorgan London'] },
      { title: 'Fintech Software Developer', avgSalary: '£55,000 - £80,000', demandLevel: 'Critical Shortage', topEmployers: ['Revolut', 'Monzo', 'Bloomberg', 'Wise'] },
      { title: 'Sustainability & ESG Consultant', avgSalary: '£48,000 - £68,000', demandLevel: 'Very High', topEmployers: ['PwC', 'Deloitte', 'Arup', 'KPMG'] },
      { title: 'NHS Clinical Practitioner & Health Informatics', avgSalary: '£42,000 - £62,000', demandLevel: 'Critical Shortage', topEmployers: ['NHS Trusts', 'AstraZeneca', 'GSK'] },
    ],
    scholarships: [
      'Chevening Scholarship (100% Tuition + Living expenses)',
      'GREAT Scholarships (£10,000 towards tuition)',
      'Commonwealth Master’s Scholarship',
    ],
    workRights: '20 hrs/week during term time; 40 hrs/week during official academic holidays.',
  },
  {
    id: 'germany',
    name: 'Germany',
    code: 'DEU',
    flag: '🇩🇪',
    tagline: 'Zero-Tuition Engineering & Europe’s Largest Industrial Powerhouse',
    heroImage: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=1200&q=80',
    description: 'The premier destination for engineering, automotive, and clean tech. Tuition-free education at world-class public universities and the revolutionary Chancenkarte visa.',
    avgTuitionYear: '€0 - €3,000 (Semester Admin Fee: ~€300)',
    livingCostYear: '€10,500 - €12,500 (Blocked Account)',
    postStudyWorkVisa: '18 Months Job-Seeker Visa + Fast-track EU Blue Card',
    visaSuccessRate: '98.4%',
    intakes: ['Winter (October - Main)', 'Summer (April)'],
    keyHighlights: [
      'Virtually tuition-free education at public universities for all international students',
      '18-Month job-seeker visa leading directly to permanent residency (PR in 21-27 months with German skills)',
      'World hub for automotive, mechanical, renewable energy, and industrial robotics',
      'Opportunity Card (Chancenkarte) points-based entry for skilled talent',
    ],
    topUniversities: [
      { name: 'Technical University of Munich (TUM)', rank: '#28 Global', city: 'Munich', acceptanceRate: '18%', popularCourses: ['Automotive Eng', 'Robotics & AI', 'Informatics'] },
      { name: 'RWTH Aachen University', rank: '#99 Global', city: 'Aachen', acceptanceRate: '22%', popularCourses: ['Mechanical Engineering', 'Materials Science'] },
      { name: 'Heidelberg University', rank: '#84 Global', city: 'Heidelberg', acceptanceRate: '15%', popularCourses: ['Biomedical Sciences', 'Physics', 'Medicine'] },
      { name: 'TU Berlin & Karlsruhe Institute of Tech (KIT)', rank: '#102 Global', city: 'Berlin / Karlsruhe', acceptanceRate: '25%', popularCourses: ['Computer Science', 'Clean Energy'] },
    ],
    topCareers: [
      { title: 'Automotive & Autonomous Systems Engineer', avgSalary: '€62,000 - €85,000', demandLevel: 'Critical Shortage', topEmployers: ['BMW Group', 'Mercedes-Benz', 'Porsche', 'Bosch'] },
      { title: 'Industrial Robotics & Automation Specialist', avgSalary: '€58,000 - €78,000', demandLevel: 'Critical Shortage', topEmployers: ['Siemens', 'KUKA', 'Festo', 'ABB'] },
      { title: 'Renewable Energy & Battery Tech Engineer', avgSalary: '€55,000 - €75,000', demandLevel: 'Very High', topEmployers: ['SMA Solar', 'Vattenfall', 'BASF', 'RWE'] },
      { title: 'Fullstack / Embedded Systems Developer', avgSalary: '€58,000 - €80,000', demandLevel: 'Very High', topEmployers: ['SAP', 'Continental', 'Infineon', 'Zalando'] },
    ],
    scholarships: [
      'DAAD Scholarships (Monthly stipend €934 + health insurance)',
      'Heinrich Böll Foundation Grants',
      'Deutschlandstipendium (€300/month merit award)',
    ],
    workRights: '140 full days or 280 half days per year; unlimited during semester breaks.',
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CAN',
    flag: '🇨🇦',
    tagline: 'High Quality of Life, Tech Hubs & Welcoming Immigration Pathways',
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    description: 'World-renowned institutions, multicultural welcoming cities like Toronto, Vancouver, and Montreal, and lucrative Post-Graduation Work Permit (PGWP) options.',
    avgTuitionYear: 'CAD $22,000 - $44,000',
    livingCostYear: 'CAD $16,000 - $22,000',
    postStudyWorkVisa: 'Up to 3 Years (PGWP)',
    visaSuccessRate: '96.9%',
    intakes: ['Fall (September - Primary)', 'Winter (January)', 'Summer (May)'],
    keyHighlights: [
      'Up to 3-Year Post-Graduation Work Permit (PGWP) with no employer restriction',
      'Express Entry, Canadian Experience Class (CEC), and Provincial Nominee (PNP) pathways',
      'Thriving tech corridors in Toronto-Waterloo, Vancouver, and Montreal AI institutes (Mila)',
      'Spouse open work permit options for eligible postgraduate master’s programs',
    ],
    topUniversities: [
      { name: 'University of Toronto', rank: '#21 Global', city: 'Toronto, ON', acceptanceRate: '38%', popularCourses: ['Computer Science', 'Rotman MBA', 'Biomedical'] },
      { name: 'UBC (University of British Columbia)', rank: '#34 Global', city: 'Vancouver, BC', acceptanceRate: '40%', popularCourses: ['Data Science', 'Forestry & Cleantech', 'Commerce'] },
      { name: 'McGill University', rank: '#30 Global', city: 'Montreal, QC', acceptanceRate: '39%', popularCourses: ['Neuroscience', 'Civil Engineering', 'Management'] },
      { name: 'University of Waterloo', rank: '#112 Global', city: 'Waterloo, ON', acceptanceRate: '45%', popularCourses: ['Co-op Software Engineering', 'Actuarial Science'] },
    ],
    topCareers: [
      { title: 'Cloud Infrastructure Engineer', avgSalary: 'CAD $90,000 - $130,000', demandLevel: 'Very High', topEmployers: ['Shopify', 'Amazon Vancouver', 'RBC Royal Bank'] },
      { title: 'Supply Chain & Logistics Director', avgSalary: 'CAD $82,000 - $115,000', demandLevel: 'High', topEmployers: ['Canadian National Railway', 'Metro', 'Loblaw'] },
      { title: 'Data Scientist & Machine Learning Specialist', avgSalary: 'CAD $88,000 - $125,000', demandLevel: 'Critical Shortage', topEmployers: ['Scotiabank', 'TD Bank', 'OpenText'] },
      { title: 'Healthcare Manager & Registered Nurse', avgSalary: 'CAD $78,000 - $105,000', demandLevel: 'Critical Shortage', topEmployers: ['University Health Network', 'Vancouver Coastal'] },
    ],
    scholarships: [
      'Vanier Canada Graduate Scholarships (CAD $50,000/year)',
      'Ontario Graduate Scholarship (OGS - CAD $15,000)',
      'Lester B. Pearson International Scholarship (Full ride at U of T)',
    ],
    workRights: '20-24 hrs/week during school sessions; 40 hrs/week during scheduled academic breaks.',
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AUS',
    flag: '🇦🇺',
    tagline: 'Top 50 Global Universities, High Wages & Sun-Drenched Lifestyle',
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    description: 'Home to the Group of Eight (Go8) elite universities. Offers some of the highest minimum wage standards, excellent post-study work rights, and diverse global cities.',
    avgTuitionYear: 'AUD $30,000 - $48,000',
    livingCostYear: 'AUD $24,500 (Proof of Funds standard)',
    postStudyWorkVisa: '2 to 4 Years (Temporary Graduate Subclass 485)',
    visaSuccessRate: '97.5%',
    intakes: ['Semester 1 (February/March - Main)', 'Semester 2 (July/August)'],
    keyHighlights: [
      'Group of Eight (Go8) universities consistently rank within the top 50 worldwide',
      'Extended post-study work rights for select regional and skills shortage qualifications',
      'Highest international student minimum wage rates globally ($24.10 AUD/hr base)',
      'Clear pathways through the Skilled Independent Visa (Subclass 189/190)',
    ],
    topUniversities: [
      { name: 'University of Melbourne', rank: '#13 Global', city: 'Melbourne, VIC', acceptanceRate: '40%', popularCourses: ['Biomedical Science', 'Finance', 'Software Systems'] },
      { name: 'University of Sydney & UNSW', rank: '#18 & #19 Global', city: 'Sydney, NSW', acceptanceRate: '42%', popularCourses: ['Civil Eng', 'Data Analytics', 'International Business'] },
      { name: 'Australian National University (ANU)', rank: '#30 Global', city: 'Canberra, ACT', acceptanceRate: '35%', popularCourses: ['Public Policy', 'Cybernetics', 'Physics'] },
      { name: 'University of Queensland (UQ)', rank: '#40 Global', city: 'Brisbane, QLD', acceptanceRate: '45%', popularCourses: ['Environmental Management', 'Mining Eng'] },
    ],
    topCareers: [
      { title: 'Mining, Civil & Geotechnical Engineer', avgSalary: 'AUD $105,000 - $155,000', demandLevel: 'Critical Shortage', topEmployers: ['BHP', 'Rio Tinto', 'Fortescue', 'Aurecon'] },
      { title: 'Cybersecurity Architect & Network Analyst', avgSalary: 'AUD $100,000 - $140,000', demandLevel: 'Critical Shortage', topEmployers: ['Commonwealth Bank', 'Telstra', 'Atlassian'] },
      { title: 'Clinical Nurse & Healthcare Professional', avgSalary: 'AUD $85,000 - $115,000', demandLevel: 'Critical Shortage', topEmployers: ['NSW Health', 'Ramsay Health', 'Monash Health'] },
      { title: 'Quantitative Risk Analyst', avgSalary: 'AUD $95,000 - $130,000', demandLevel: 'Very High', topEmployers: ['Macquarie Group', 'ANZ', 'NAB'] },
    ],
    scholarships: [
      'Australia Awards Scholarships (Full tuition + airfare + stipend)',
      'Destination Australia Program (AUD $15,000/year)',
      'University of Sydney International Scholarship (AUD $40,000+)',
    ],
    workRights: '48 hours per fortnight during semester; full-time during vacations.',
  },
  {
    id: 'ireland',
    name: 'Ireland',
    code: 'IRL',
    flag: '🇮🇪',
    tagline: 'The Silicon Valley of Europe & English-Speaking Tech Powerhouse',
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',
    description: 'European headquarters of 9 of the top 10 global tech firms and all top 10 pharma giants. Offers a 2-year Third Level Graduate work visa.',
    avgTuitionYear: '€12,000 - €26,000',
    livingCostYear: '€10,000 - €15,000',
    postStudyWorkVisa: '2 Years (Third Level Graduate Scheme)',
    visaSuccessRate: '98.9%',
    intakes: ['September/October (Primary)', 'January/February'],
    keyHighlights: [
      'European headquarters for Google, Apple, Meta, LinkedIn, Stripe, and Pfizer',
      'The only native English-speaking nation in the European Union Post-Brexit',
      '2-Year post-study work visa for Master’s graduates leading to Critical Skills Employment Permit',
      'High graduate employability rate across Dublin’s Silicon Docks',
    ],
    topUniversities: [
      { name: 'Trinity College Dublin (TCD)', rank: '#87 Global', city: 'Dublin', acceptanceRate: '33%', popularCourses: ['Computer Science', 'Immunology', 'Business'] },
      { name: 'University College Dublin (UCD)', rank: '#126 Global', city: 'Dublin', acceptanceRate: '40%', popularCourses: ['Fintech', 'Biotech', 'Supply Chain Management'] },
      { name: 'University of Galway', rank: '#273 Global', city: 'Galway', acceptanceRate: '50%', popularCourses: ['Medical Devices', 'Marine Science', 'Data Analytics'] },
    ],
    topCareers: [
      { title: 'Fintech & Payments Software Engineer', avgSalary: '€55,000 - €80,000', demandLevel: 'Critical Shortage', topEmployers: ['Stripe', 'Mastercard', 'PayPal', 'AIB'] },
      { title: 'Pharmaceutical Validation Specialist', avgSalary: '€50,000 - €72,000', demandLevel: 'Very High', topEmployers: ['Pfizer Ireland', 'Eli Lilly', 'Johnson & Johnson'] },
      { title: 'Cloud DevOps Architect', avgSalary: '€60,000 - €85,000', demandLevel: 'Critical Shortage', topEmployers: ['Amazon AWS Dublin', 'Microsoft', 'Workday'] },
    ],
    scholarships: [
      'Government of Ireland International Education Scholarship (€10,000 + full fee waiver)',
      'Trinity College Global Excellence Scholarships (€5,000)',
      'UCD Global Graduate Scholarships',
    ],
    workRights: '20 hrs/week during teaching term; 40 hrs/week during official holidays.',
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    code: 'ARE',
    flag: '🇦🇪',
    tagline: 'Global Trade Epicenter, Tax-Free Income & World-Class Branch Campuses',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    description: 'A futuristic global education and commerce capital. UAE offers top international branch campuses (NYU Abu Dhabi, Heriot-Watt, Wollongong, BITS), 10-year Golden Visa schemes, and 100% tax-free income.',
    avgTuitionYear: 'AED 45,000 - 85,000 ($12,000 - $23,000 USD)',
    livingCostYear: 'AED 35,000 - 55,000 ($9,500 - $15,000 USD)',
    postStudyWorkVisa: '1 to 2 Years Job Seeker Visa / 10-Year Golden Visa for Top Grads',
    visaSuccessRate: '99.4%',
    intakes: ['Fall (September/October - Primary)', 'Spring (January/February)'],
    keyHighlights: [
      '100% Tax-Free starting graduate salaries across Dubai and Abu Dhabi corporate hubs',
      '10-Year UAE Golden Visa pathway for high-performing university graduates (GPA 3.8+)',
      'Host to elite international branch campuses granting identical UK, US, and Australian degrees',
      'Global epicenter for Artificial Intelligence (G42, Masdar), Fintech (DIFC), and Aviation/Logistics',
    ],
    topUniversities: [
      { name: 'Khalifa University', rank: '#202 Global', city: 'Abu Dhabi', acceptanceRate: '22%', popularCourses: ['Renewable Energy', 'AI & Robotics', 'Aerospace'] },
      { name: 'UAE University (UAEU)', rank: '#261 Global', city: 'Al Ain', acceptanceRate: '28%', popularCourses: ['Petroleum Eng', 'Data Analytics', 'Business'] },
      { name: 'American University of Sharjah (AUS)', rank: '#334 Global', city: 'Sharjah', acceptanceRate: '35%', popularCourses: ['Finance & Banking', 'Civil Eng', 'Architecture'] },
      { name: 'NYU Abu Dhabi & Heriot-Watt Dubai', rank: '#35 / #235 Mothership', city: 'Abu Dhabi / Dubai', acceptanceRate: '8-40%', popularCourses: ['Computer Science', 'Actuarial Science', 'Logistics'] },
    ],
    topCareers: [
      { title: 'Fintech & Blockchain Solutions Architect', avgSalary: 'AED 18,000 - 28,000/mo ($60k-$90k Tax-Free)', demandLevel: 'Critical Shortage', topEmployers: ['Emirates NBD', 'Careem', 'Binance MENA', 'Mashreq'] },
      { title: 'AI & Smart Cities Data Engineer', avgSalary: 'AED 20,000 - 32,000/mo ($65k-$105k Tax-Free)', demandLevel: 'Critical Shortage', topEmployers: ['G42', 'ADNOC', 'Dubai Future Foundation', 'Microsoft UAE'] },
      { title: 'Global Supply Chain & Aviation Director', avgSalary: 'AED 16,000 - 26,000/mo ($52k-$85k Tax-Free)', demandLevel: 'Very High', topEmployers: ['DP World', 'Emirates Group', 'Etihad Cargo', 'DHL Global'] },
      { title: 'Clean Energy & Desalination Engineer', avgSalary: 'AED 17,000 - 25,000/mo ($55k-$82k Tax-Free)', demandLevel: 'High', topEmployers: ['Masdar', 'TAQA', 'DEWA', 'Siemens Energy'] },
    ],
    scholarships: [
      'Khalifa University Graduate Research Scholarships (Full tuition + monthly stipend)',
      'AUS Chancellor’s Merit Scholarships (Up to 100% tuition waiver)',
      'Sheikh Mohamed bin Zayed Scholars Fellowship (NYUAD)',
    ],
    workRights: 'Part-time internships and on-campus work permitted through university work permits.',
  },
];
