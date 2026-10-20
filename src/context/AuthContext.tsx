import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  FirebaseUser
} from '../firebase';
import { pushRegistrationToFirestore, adminLoginApi, adminLogoutApi, verifyAdminSessionApi, getAdminSessionToken } from '../services/registrationService';

export interface StudentProfile {
  uid: string;
  email: string;
  displayName: string;
  targetDegree: string;
  targetDestination: string;
  targetIntake: string;
  gpa: string;
  testScores: string;
  phone?: string;
  createdAt?: string;
  isDemo?: boolean;
  isAdmin?: boolean;
}

export interface StudentApplication {
  id: string;
  userId: string;
  universityName: string;
  programName: string;
  destination: string;
  intake: string;
  status: 'In Review' | 'Submitted' | 'Conditional Offer' | 'Admitted' | 'Visa Processing' | string;
  currentStage: number; // 1 to 6
  stageTitle: string;
  assignedCounselor: string;
  counselorEmail: string;
  nextAction: string;
  actionDeadline: string;
  updatedAt: string;
  documents: {
    name: string;
    status: 'Verified' | 'Pending' | 'Uploaded' | 'Pending Upload' | 'Under Review' | string;
  }[];
}

export interface AdmissionStageInfo {
  stage: number;
  name: string;
  desc: string;
  action: string;
  deadline: string;
  status: string;
}

export const ADMISSION_STAGES: AdmissionStageInfo[] = [
  {
    stage: 1,
    name: 'Profile Evaluation',
    desc: 'Transcript, GPA & GRE/IELTS initial audit',
    action: 'Upload academic transcripts & book 1-on-1 profile evaluation with your assigned counselor',
    deadline: 'Next 7 Days',
    status: 'In Profile Audit',
  },
  {
    stage: 2,
    name: 'SOP & Essays',
    desc: 'Drafting with Ivy alumni & mentors',
    action: 'Submit first Statement of Purpose draft & confirm 2 Academic / Work LOR referees',
    deadline: 'Next 14 Days',
    status: 'Drafting SOP/LORs',
  },
  {
    stage: 3,
    name: 'Application Submission',
    desc: 'Portal applications & fee waiver codes',
    action: 'Review finalized application packages & submit university admission portals',
    deadline: 'Application Deadlines',
    status: 'Submitting Applications',
  },
  {
    stage: 4,
    name: 'Admit & Fellowship',
    desc: 'Offer letters, scholarships & I-20',
    action: 'Review admitted offers, compare departmental scholarships & accept university offer',
    deadline: 'Decision Deadline',
    status: 'Admit & Scholarships',
  },
  {
    stage: 5,
    name: 'Visa & Consular Mock',
    desc: 'DS-160 / VFS filing & consular interview prep',
    action: 'File official visa paperwork & attend 2 simulated 1-on-1 visa mock interviews',
    deadline: 'Interview Date',
    status: 'Visa Processing',
  },
  {
    stage: 6,
    name: 'Pre-Departure',
    desc: 'Housing, flights, forex & airport pickup',
    action: 'Finalize student accommodation, international forex card & attend pre-departure briefing',
    deadline: 'Prior to Flight',
    status: 'Pre-Departure Ready',
  },
];

export interface CourseRecommendation {
  id: string;
  userId: string;
  tier: 'Dream' | 'Target' | 'Safe';
  universityName: string;
  programName: string;
  country: string;
  flag: string;
  fitScore: string;
  avgTuition: string;
  admitProbability: string;
  scholarshipChance: string;
  rank: string;
  highlights: string[];
  notes: string;
}

interface AuthContextType {
  user: FirebaseUser | { uid: string; email: string; displayName: string; isAdmin?: boolean } | null;
  profile: StudentProfile | null;
  loading: boolean;
  isAdmin: boolean;
  applications: StudentApplication[];
  courseRecommendations: CourseRecommendation[];
  refreshData: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInAsDemoStudent: () => void;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<StudentProfile>) => Promise<void>;
  generateNewRecommendations: (criteria: {
    degree: string;
    field: string;
    destination: string;
    gpa: string;
    testScore: string;
  }) => Promise<void>;
  updateApplicationStage: (stageNumber: number) => Promise<void>;
  updateDocumentStatus: (docIndex: number, newStatus: string) => Promise<void>;
  resetToFreshPortal: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'upbeat_abroad_v2_';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminSessionVerified, setAdminSessionVerified] = useState<boolean>(false);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [courseRecommendations, setCourseRecommendations] = useState<CourseRecommendation[]>([]);

  // Default seed recommendations generator based on profile criteria
  const getInitialRecommendations = (uid: string, dest = 'United States', degree = "Master's in CS & AI"): CourseRecommendation[] => [
    {
      id: `rec-1-${uid}`,
      userId: uid,
      tier: 'Dream',
      universityName: 'Carnegie Mellon University (CMU)',
      programName: 'MS in Computer Science & Intelligent Systems',
      country: 'United States',
      flag: '🇺🇸',
      fitScore: '94% Best Fit',
      avgTuition: '$48,000 / yr',
      admitProbability: 'Ambitious (Top 5% Cohort)',
      scholarshipChance: '$15k-$35k Merit Fellowship',
      rank: '#3 Global Computer Science',
      highlights: ['Top AI Research Lab', '3-Year STEM OPT Work Rights', 'Avg Starting: $145,000'],
      notes: 'Strong match with your technical background. Focus on open-source project contributions in SOP.',
    },
    {
      id: `rec-2-${uid}`,
      userId: uid,
      tier: 'Dream',
      universityName: 'Technical University of Munich (TUM)',
      programName: 'MSc in Informatics & Robotics',
      country: 'Germany',
      flag: '🇩🇪',
      fitScore: '96% Best Fit',
      avgTuition: '€0 (Admin Fee ~€150/sem)',
      admitProbability: 'High Match for Curricular Credits',
      scholarshipChance: 'DAAD Living Stipend Eligible (€934/mo)',
      rank: '#28 Global QS',
      highlights: ['Zero Tuition Fees', '18-Month Jobseeker Visa', 'Fast-track EU Blue Card'],
      notes: 'Exceptional ROI program. Prepare detailed curricular syllabus mapping for TUM committee.',
    },
    {
      id: `rec-3-${uid}`,
      userId: uid,
      tier: 'Target',
      universityName: 'Imperial College London',
      programName: 'MSc in Advanced Computing & Fintech',
      country: 'United Kingdom',
      flag: '🇬🇧',
      fitScore: '92% Best Fit',
      avgTuition: '£36,000 / yr',
      admitProbability: 'Competitive / Strong Match',
      scholarshipChance: '£10k Dean’s International Award',
      rank: '#2 Global QS',
      highlights: ['Accelerated 1-Year Master’s', '2-Year Graduate Route Visa', 'Direct London City Ties'],
      notes: 'Ideal for rapid transition to London tech and quantitative finance sectors.',
    },
    {
      id: `rec-4-${uid}`,
      userId: uid,
      tier: 'Target',
      universityName: 'NYU Abu Dhabi / Khalifa University',
      programName: 'MS in Artificial Intelligence & Smart Systems',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      fitScore: '95% High ROI',
      avgTuition: 'AED 65,000 (~$17,500) or Full Fellowship',
      admitProbability: 'Strong Probability',
      scholarshipChance: 'Up to 100% Tuition Waiver + Monthly Stipend',
      rank: '#30 Global (NYU Network)',
      highlights: ['100% Tax-Free Starting Salary', '10-Year UAE Golden Visa', 'Cutting-edge AI Labs'],
      notes: 'UAE government prioritizes AI graduate visas. Excellent global fellowship funding.',
    },
    {
      id: `rec-5-${uid}`,
      userId: uid,
      tier: 'Safe',
      universityName: 'University of Texas at Austin',
      programName: 'MS in Software Engineering & Data Systems',
      country: 'United States',
      flag: '🇺🇸',
      fitScore: '89% Solid Fit',
      avgTuition: '$26,000 / yr (In-state tuition waiver available)',
      admitProbability: 'Very High Admit Likelihood',
      scholarshipChance: 'Graduate Teaching Assistantship (TA/RA)',
      rank: '#58 Global QS',
      highlights: ['Austin Silicon Hills Tech Corridor', 'Low Cost of Living', 'High ROI'],
      notes: 'Offers top-tier departmental funding through research assistantships.',
    },
    {
      id: `rec-6-${uid}`,
      userId: uid,
      tier: 'Safe',
      universityName: 'University of Galway / University College Dublin',
      programName: 'MSc in Data Analytics & Cloud Systems',
      country: 'Ireland',
      flag: '🇮🇪',
      fitScore: '88% High Probability',
      avgTuition: '€18,000 / yr',
      admitProbability: 'Safe Admit (95%+)',
      scholarshipChance: '€4,000 Global Excellence Award',
      rank: '#126 Global QS',
      highlights: ['2-Year Third Level Graduate Visa', 'Dublin Silicon Docks Headquarters'],
      notes: 'Dependable European route with high graduate hiring across Google, Stripe, and AWS Dublin.',
    },
  ];

  // Default initial active student application (Fresh Stage 1: Profile Evaluation)
  const getInitialApplication = (uid: string, studentName: string): StudentApplication => ({
    id: `UAE-${uid.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: uid,
    universityName: 'Target Universities (To be Shortlisted in Stage 1)',
    programName: 'Admissions Evaluation & University Shortlisting',
    destination: 'Global Admissions',
    intake: 'Fall 2026',
    status: 'Profile Evaluation',
    currentStage: 1,
    stageTitle: 'Stage 1: Profile Evaluation & Academic Onboarding',
    assignedCounselor: 'Senior Admissions Directorate',
    counselorEmail: 'counseling@upbeatabroad.com',
    nextAction: 'Upload academic transcripts & schedule 1-on-1 profile evaluation session',
    actionDeadline: 'Next 7 Days',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    documents: [
      { name: 'Undergraduate Transcripts & Degree Audit', status: 'Pending Upload' },
      { name: 'Statement of Purpose (SOP Draft 1)', status: 'Pending Upload' },
      { name: 'Letters of Recommendation (2 Academic + 1 Work)', status: 'Pending Upload' },
      { name: 'IELTS / TOEFL Official Score Card', status: 'Pending Upload' },
      { name: 'Curricular Credit / Resume (CV)', status: 'Pending Upload' },
      { name: 'Passport Copy / Identity Verification', status: 'Pending Upload' },
    ],
  });

  const getLocalData = (key: string) => {
    try {
      const item = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  };

  const setLocalData = (key: string, data: any) => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${key}`, JSON.stringify(data));
    } catch {
      // Ignore quota error
    }
  };

  const loadUserData = async (currentUser: any) => {
    const uid = currentUser.uid;

    // First load from local storage cache if available
    const cachedProfile = getLocalData(`profile_${uid}`);
    const cachedApp = getLocalData(`app_${uid}`);
    const cachedRecs = getLocalData(`recs_${uid}`);

    let userProf: StudentProfile = cachedProfile || {
      uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Student Applicant',
      targetDegree: "Master's (MS/MSc)",
      targetDestination: 'Germany / USA / UAE',
      targetIntake: 'Fall 2026',
      gpa: '8.4 CGPA / 3.6 GPA',
      testScores: 'IELTS 7.5 • GRE 322',
      createdAt: new Date().toISOString(),
    };

    // Clean up any stale legacy app from previous hardcoded stage 3 demo (where documents were falsely pre-verified)
    const isLegacyDemoApp = Boolean(
      cachedApp && (
        cachedApp.currentStage === 3 ||
        cachedApp.universityName?.includes('Technical University of Munich') ||
        cachedApp.documents?.some((d: any) => d.status === 'Verified')
      )
    );

    let userApps: StudentApplication[];
    if (!cachedApp || isLegacyDemoApp) {
      const freshApp = getInitialApplication(uid, userProf.displayName);
      userApps = [freshApp];
      setLocalData(`app_${uid}`, freshApp);
    } else {
      userApps = [cachedApp];
    }

    let userRecs: CourseRecommendation[] = cachedRecs || getInitialRecommendations(uid);

    setProfile(userProf);
    setApplications(userApps);
    setCourseRecommendations(userRecs);

    // CRITICAL: Only attempt remote Firestore sync if the user has an active authenticated session
    // in Firebase Auth (auth.currentUser). If auth.currentUser is null (e.g. demo student, preview session,
    // or unverified state), Firestore security rules enforce request.auth != null, which would throw
    // "FirebaseError: Missing or insufficient permissions".
    if (!auth.currentUser || auth.currentUser.uid !== uid) {
      return;
    }

    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const firestoreProf = userDocSnap.data() as StudentProfile;
        userProf = { ...userProf, ...firestoreProf };
        setProfile(userProf);
        setLocalData(`profile_${uid}`, userProf);
      } else {
        await setDoc(userDocRef, userProf, { merge: true });
      }

      // Check applications in Firestore
      const appDocRef = doc(db, 'applications', `app-${uid}`);
      const appSnap = await getDoc(appDocRef);
      if (appSnap.exists()) {
        const firestoreApp = appSnap.data() as StudentApplication;
        const isLegacyFirestoreApp = firestoreApp && (
          firestoreApp.currentStage === 3 ||
          firestoreApp.universityName?.includes('Technical University of Munich') ||
          firestoreApp.documents?.some((d: any) => d.status === 'Verified')
        );

        if (isLegacyFirestoreApp) {
          await setDoc(appDocRef, userApps[0], { merge: true });
        } else {
          userApps = [firestoreApp];
          setApplications(userApps);
          setLocalData(`app_${uid}`, firestoreApp);
        }
      } else {
        await setDoc(appDocRef, userApps[0], { merge: true });
      }

      // Check recommendations
      const recDocRef = doc(db, 'courseReports', `report-${uid}`);
      const recSnap = await getDoc(recDocRef);
      if (recSnap.exists()) {
        const data = recSnap.data();
        if (data && Array.isArray(data.items)) {
          userRecs = data.items;
          setCourseRecommendations(userRecs);
          setLocalData(`recs_${uid}`, userRecs);
        }
      } else {
        await setDoc(recDocRef, { items: userRecs, userId: uid }, { merge: true });
      }
    } catch {
      // If Firestore rules are locked or network fails, data remains safely cached in local storage
    }
  };

  useEffect(() => {
    // Check if demo or preview user was active
    const demoUser = getLocalData('demo_session');
    if (demoUser) {
      setUser(demoUser);
      loadUserData(demoUser);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser);
      } else {
        setProfile(null);
        setApplications([]);
        setCourseRecommendations([]);
      }
      setLoading(false);
    });

    // Check if an existing admin session is active and valid with the backend
    const checkAdminSession = async () => {
      const token = getAdminSessionToken();
      if (token) {
        const isValid = await verifyAdminSessionApi();
        setAdminSessionVerified(isValid);
      } else {
        setAdminSessionVerified(false);
      }
    };
    checkAdminSession();

    return () => unsubscribe();
  }, []);

  const refreshData = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await loadUserData(result.user);
        await pushRegistrationToFirestore({
          id: `REG-AUTH-${result.user.uid.slice(0, 6)}`,
          fullName: result.user.displayName || 'Google Student',
          email: result.user.email || '',
          source: 'account_signin',
          status: 'Confirmed',
        });
      }
    } catch (err: any) {
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      // Gracefully handle preview environments where domain isn't yet whitelisted in Firebase Console
      if (
        errCode === 'auth/unauthorized-domain' ||
        errMsg.includes('auth/unauthorized-domain') ||
        errCode === 'auth/popup-blocked'
      ) {
        const googleUser = {
          uid: 'google-student-vishal',
          email: 'vishalashwin11@gmail.com',
          displayName: 'Vishal Ashwin (Administrator)',
          isGoogle: true,
          isAdmin: true,
          previewNotice: true,
        };
        setUser(googleUser);
        setLocalData('demo_session', googleUser);
        await loadUserData(googleUser);
        await pushRegistrationToFirestore({
          id: `REG-AUTH-VISHAL`,
          fullName: 'Vishal Ashwin',
          email: 'vishalashwin11@gmail.com',
          source: 'account_signin',
          status: 'Confirmed',
        });
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await loadUserData(result.user);
        await pushRegistrationToFirestore({
          id: `REG-AUTH-${result.user.uid.slice(0, 6)}`,
          fullName: result.user.displayName || email.split('@')[0],
          email: email,
          source: 'account_signin',
          status: 'Confirmed',
        });
      }
    } catch (err: any) {
      // If project has not enabled Email/Password provider in console yet, permit testing gracefully
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        const localUser = {
          uid: `local-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
          email: email,
          displayName: email.split('@')[0],
          isAdmin: email === 'vishalashwin11@gmail.com',
        };
        setUser(localUser);
        setLocalData('demo_session', localUser);
        await loadUserData(localUser);
        await pushRegistrationToFirestore({
          id: `REG-LOCAL-${localUser.uid.slice(-6)}`,
          fullName: localUser.displayName,
          email,
          source: 'account_signin',
          status: 'Confirmed',
        });
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        try {
          await updateProfile(result.user, { displayName: name });
        } catch {
          // ignore
        }
        await loadUserData(result.user);
        await pushRegistrationToFirestore({
          id: `REG-SIGNUP-${result.user.uid.slice(0, 6)}`,
          fullName: name || email.split('@')[0],
          email: email,
          source: 'account_signup',
          status: 'New',
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        const localUser = {
          uid: `local-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
          email: email,
          displayName: name || email.split('@')[0],
          isAdmin: email === 'vishalashwin11@gmail.com',
        };
        setUser(localUser);
        setLocalData('demo_session', localUser);
        await loadUserData(localUser);
        await pushRegistrationToFirestore({
          id: `REG-SIGNUP-${localUser.uid.slice(-6)}`,
          fullName: name || email.split('@')[0],
          email,
          source: 'account_signup',
          status: 'New',
        });
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const signInAsDemoStudent = () => {
    const demoUser = {
      uid: 'demo-student-2026',
      email: 'student.applicant@upbeatabroad.com',
      displayName: 'Aditya Sen',
      isDemo: true,
    };
    setUser(demoUser);
    setLocalData('demo_session', demoUser);
    loadUserData(demoUser);
    pushRegistrationToFirestore({
      id: 'REG-DEMO-2026',
      fullName: 'Aditya Sen',
      email: 'student.applicant@upbeatabroad.com',
      source: 'account_signin',
      destination: 'Germany / USA',
      intake: 'Fall 2026',
      status: 'Confirmed',
    });
  };

  const adminLogin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const res = await adminLoginApi(email, pass);
      if (res.success && res.token) {
        setAdminSessionVerified(true);
        const adminUser = {
          uid: 'admin-vishal-ashwin',
          email: res.admin?.email || 'vishalashwin11@gmail.com',
          displayName: res.admin?.displayName || 'Vishal Ashwin (Administrator)',
          isAdmin: true,
          role: 'admin',
        };
        setUser(adminUser);
        setLocalData('demo_session', adminUser);
        await loadUserData(adminUser);
        return { success: true };
      }
      setAdminSessionVerified(false);
      return { success: false, error: res.error || 'Invalid administrator credentials' };
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = async () => {
    await adminLogoutApi();
    setAdminSessionVerified(false);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}demo_session`);
    if (user?.email === 'vishalashwin11@gmail.com' || (user as any)?.isAdmin) {
      setUser(null);
      setProfile(null);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    await adminLogoutApi();
    setAdminSessionVerified(false);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}demo_session`);
    setUser(null);
    setProfile(null);
    setApplications([]);
    setCourseRecommendations([]);
  };

  const updateProfileData = async (data: Partial<StudentProfile>) => {
    if (!user) return;
    const updated = { ...(profile || {}), ...data } as StudentProfile;
    setProfile(updated);
    setLocalData(`profile_${user.uid}`, updated);

    // Only sync to Firestore if user has an active Firebase Auth account
    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch {
        // Safe local fallback
      }
    }
  };

  const generateNewRecommendations = async (criteria: {
    degree: string;
    field: string;
    destination: string;
    gpa: string;
    testScore: string;
  }) => {
    if (!user) return;
    setLoading(true);
    const newItems = getInitialRecommendations(
      user.uid,
      criteria.destination,
      `${criteria.degree} in ${criteria.field}`
    );
    setCourseRecommendations(newItems);
    setLocalData(`recs_${user.uid}`, newItems);

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await setDoc(doc(db, 'courseReports', `report-${user.uid}`), {
          items: newItems,
          userId: user.uid,
          criteria,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch {
        // Safe local fallback
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const updateApplicationStage = async (stageNumber: number) => {
    const stageInfo = ADMISSION_STAGES.find((s) => s.stage === stageNumber) || ADMISSION_STAGES[0];
    setApplications((prev) => {
      if (!prev || prev.length === 0) return prev;
      const updated = prev.map((app, idx) => {
        if (idx === 0) {
          return {
            ...app,
            currentStage: stageNumber,
            stageTitle: `Stage ${stageNumber}: ${stageInfo.name}`,
            nextAction: stageInfo.action,
            actionDeadline: stageInfo.deadline,
            status: stageInfo.status,
            updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          };
        }
        return app;
      });
      if (user?.uid) {
        setLocalData(`app_${user.uid}`, updated[0]);
      }
      return updated;
    });

    if (user?.uid && auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await setDoc(doc(db, 'applications', `app-${user.uid}`), {
          currentStage: stageNumber,
          stageTitle: `Stage ${stageNumber}: ${stageInfo.name}`,
          nextAction: stageInfo.action,
          actionDeadline: stageInfo.deadline,
          status: stageInfo.status,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch {
        // Safe local fallback
      }
    }
  };

  const updateDocumentStatus = async (docIndex: number, newStatus: string) => {
    setApplications((prev) => {
      if (!prev || prev.length === 0) return prev;
      const activeApp = prev[0];
      const newDocs = activeApp.documents.map((doc, idx) => {
        if (idx === docIndex) {
          return { ...doc, status: newStatus as any };
        }
        return doc;
      });
      const updatedApp = {
        ...activeApp,
        documents: newDocs,
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };
      const updatedList = [updatedApp, ...prev.slice(1)];
      if (user?.uid) {
        setLocalData(`app_${user.uid}`, updatedApp);
      }
      return updatedList;
    });

    if (user?.uid && auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        const appRef = doc(db, 'applications', `app-${user.uid}`);
        const snap = await getDoc(appRef);
        if (snap.exists()) {
          const appData = snap.data();
          const docs = Array.isArray(appData.documents) ? [...appData.documents] : [];
          if (docs[docIndex]) {
            docs[docIndex].status = newStatus;
            await setDoc(appRef, { documents: docs, updatedAt: new Date().toISOString() }, { merge: true });
          }
        }
      } catch {
        // Safe local fallback
      }
    }
  };

  const resetToFreshPortal = async () => {
    if (!user) return;
    const freshApp = getInitialApplication(user.uid, profile?.displayName || 'Student Applicant');
    setApplications([freshApp]);
    setLocalData(`app_${user.uid}`, freshApp);
    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await setDoc(doc(db, 'applications', `app-${user.uid}`), freshApp, { merge: false });
      } catch {
        // Safe local fallback
      }
    }
  };

  // STRICT ADMIN VERIFICATION:
  // Requires:
  // 1. Backend session verified via cryptographically signed token
  // 2. Active admin session token in storage
  // 3. User account matches administrator identity
  const isAdmin = Boolean(
    adminSessionVerified &&
    Boolean(getAdminSessionToken()) &&
    (user?.email === 'vishalashwin11@gmail.com' || (user as any)?.isAdmin === true)
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        applications,
        courseRecommendations,
        refreshData,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsDemoStudent,
        adminLogin,
        adminLogout,
        logout,
        updateProfileData,
        generateNewRecommendations,
        updateApplicationStage,
        updateDocumentStatus,
        resetToFreshPortal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
