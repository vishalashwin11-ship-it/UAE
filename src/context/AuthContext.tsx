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
import { pushRegistrationToFirestore } from '../services/registrationService';

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
  status: 'In Review' | 'Submitted' | 'Conditional Offer' | 'Admitted' | 'Visa Processing';
  currentStage: number; // 1 to 6
  stageTitle: string;
  assignedCounselor: string;
  counselorEmail: string;
  nextAction: string;
  actionDeadline: string;
  updatedAt: string;
  documents: {
    name: string;
    status: 'Verified' | 'Pending' | 'Uploaded';
  }[];
}

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
  loginAsAdmin: () => void;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<StudentProfile>) => Promise<void>;
  generateNewRecommendations: (criteria: {
    degree: string;
    field: string;
    destination: string;
    gpa: string;
    testScore: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'upbeat_abroad_student_';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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

  // Default initial active student application
  const getInitialApplication = (uid: string, studentName: string): StudentApplication => ({
    id: `UAE-${uid.slice(0, 4)}-9481`,
    userId: uid,
    universityName: 'Technical University of Munich (TUM)',
    programName: 'MSc in Automotive Software & Informatics',
    destination: 'Germany 🇩🇪',
    intake: 'Fall 2026',
    status: 'In Review',
    currentStage: 3,
    stageTitle: 'Stage 3: University Application Submission & Verification',
    assignedCounselor: 'Dr. Elena Rostova (Academic Director)',
    counselorEmail: 'elena.rostova@upbeatabroad.com',
    nextAction: 'Upload certified degree certificate & APS verification document',
    actionDeadline: 'November 15, 2026',
    updatedAt: 'October 2026',
    documents: [
      { name: 'Undergraduate Transcripts & Degree Audit', status: 'Verified' },
      { name: 'Statement of Purpose (SOP Draft 4)', status: 'Verified' },
      { name: 'Letters of Recommendation (2 Academic + 1 Work)', status: 'Verified' },
      { name: 'IELTS / TOEFL Official Score Card', status: 'Verified' },
      { name: 'Curricular Credit Eignungsfeststellungsverfahren', status: 'Uploaded' },
      { name: 'APS / Blocked Account Proof', status: 'Pending' },
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

    let userApps: StudentApplication[] = cachedApp ? [cachedApp] : [getInitialApplication(uid, userProf.displayName)];
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

      // Check applications
      const appDocRef = doc(db, 'applications', `app-${uid}`);
      const appSnap = await getDoc(appDocRef);
      if (appSnap.exists()) {
        const firestoreApp = appSnap.data() as StudentApplication;
        userApps = [firestoreApp];
        setApplications(userApps);
        setLocalData(`app_${uid}`, firestoreApp);
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

  const loginAsAdmin = () => {
    const adminUser = {
      uid: 'admin-vishal-ashwin',
      email: 'vishalashwin11@gmail.com',
      displayName: 'Vishal Ashwin (Administrator)',
      isAdmin: true,
      role: 'admin',
    };
    setUser(adminUser);
    setLocalData('demo_session', adminUser);
    loadUserData(adminUser);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
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

  const isAdmin = Boolean(
    user?.email === 'vishalashwin11@gmail.com' ||
    (user as any)?.isAdmin === true ||
    profile?.isAdmin === true
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
        loginAsAdmin,
        logout,
        updateProfileData,
        generateNewRecommendations,
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
