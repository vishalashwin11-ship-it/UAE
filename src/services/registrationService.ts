import { 
  db, 
  doc, 
  setDoc, 
  getDocs, 
  collection, 
  query, 
  orderBy, 
  updateDoc, 
  deleteDoc 
} from '../firebase';

export interface StudentRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  source: 'counselling_booking' | 'account_signup' | 'account_signin' | 'free_session_booking' | 'contact_inquiry';
  sourceLabel?: string;
  destination: string;
  intake: string;
  counselor?: string;
  sessionDate?: string;
  timeSlot?: string;
  notes?: string;
  status: 'New' | 'Confirmed' | 'Contacted' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface BookingPayload {
  bookingId: string;
  fullName: string;
  email: string;
  phone: string;
  destination: string;
  intake: string;
  counselor: string;
  date: string;
  timeSlot: string;
  currentEducation?: string;
  notes?: string;
  meetUrl?: string;
  status: string;
  isFreeSession?: boolean;
}

const LOCAL_STORAGE_KEY = 'upbeat_master_registrations';
const ADMIN_TOKEN_KEY = 'upbeat_admin_sec_token';
export const SECRET_ADMIN_URL = '/upbeat-secure-console-9354';

export const getAdminSessionToken = (): string | null => {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAdminSessionToken = (token: string | null) => {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
};

export const clearAdminSessionToken = () => {
  setAdminSessionToken(null);
};

export async function adminLoginApi(email: string, pass: string): Promise<{
  success: boolean;
  token?: string;
  admin?: any;
  error?: string;
  secretPath?: string;
}> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setAdminSessionToken(data.token);
      return {
        success: true,
        token: data.token,
        admin: data.admin,
        secretPath: data.secretPath,
      };
    }
    return {
      success: false,
      error: data.error || 'Authentication rejected by security policy.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unable to connect to administrative security gateway.',
    };
  }
}

export async function verifyAdminSessionApi(): Promise<boolean> {
  const token = getAdminSessionToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.success && data.authenticated);
    }
    clearAdminSessionToken();
    return false;
  } catch {
    return false;
  }
}

export async function adminLogoutApi(): Promise<void> {
  const token = getAdminSessionToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore
    }
  }
  clearAdminSessionToken();
}

const getCachedRegistrations = (): StudentRegistration[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setCachedRegistrations = (list: StudentRegistration[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota
  }
};

/**
 * Push registration to Firestore `/registrations` collection, local storage, and backend
 */
export async function pushRegistrationToFirestore(reg: Partial<StudentRegistration>): Promise<StudentRegistration> {
  const regId = reg.id || `REG-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();

  const formattedReg: StudentRegistration = {
    id: regId,
    fullName: reg.fullName || reg.email?.split('@')[0] || 'Student Applicant',
    email: reg.email || '',
    phone: reg.phone || '',
    source: reg.source || 'account_signin',
    destination: reg.destination || 'Open / Undecided',
    intake: reg.intake || 'Fall 2026',
    counselor: reg.counselor || 'Academic Director',
    sessionDate: reg.sessionDate || '',
    timeSlot: reg.timeSlot || '',
    notes: reg.notes || '',
    status: reg.status || 'New',
    createdAt: reg.createdAt || now,
  };

  // 1. Save to Firestore
  try {
    const regRef = doc(db, 'registrations', regId);
    await setDoc(regRef, formattedReg, { merge: true });
  } catch {
    // Firestore rules may still be syncing or offline; proceed to sync local & server
  }

  // 2. Save to Local Storage cache
  const existing = getCachedRegistrations();
  const filtered = existing.filter((item) => item.id !== regId);
  setCachedRegistrations([formattedReg, ...filtered]);

  // 3. Sync to Express Backend
  try {
    await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedReg),
    });
  } catch {
    // ignore
  }

  return formattedReg;
}

/**
 * Push 1-on-1 / Free Session Booking to Firestore `/bookings` AND `/registrations`
 */
export async function pushBookingToFirestore(booking: BookingPayload): Promise<void> {
  const now = new Date().toISOString();
  const bookingDoc = {
    ...booking,
    createdAt: now,
  };

  // 1. Write to Firestore `/bookings/{bookingId}`
  try {
    const bookingRef = doc(db, 'bookings', booking.bookingId);
    await setDoc(bookingRef, bookingDoc, { merge: true });
  } catch {
    // Safe fallback
  }

  // 2. Also record in master `/registrations/{id}`
  await pushRegistrationToFirestore({
    id: `REG-${booking.bookingId}`,
    fullName: booking.fullName,
    email: booking.email,
    phone: booking.phone,
    source: booking.isFreeSession ? 'free_session_booking' : 'counselling_booking',
    destination: booking.destination,
    intake: booking.intake,
    counselor: booking.counselor,
    sessionDate: booking.date,
    timeSlot: booking.timeSlot,
    notes: `${booking.currentEducation ? `Edu: ${booking.currentEducation}. ` : ''}${booking.notes || ''}`,
    status: 'Confirmed',
    createdAt: now,
  });
}

/**
 * Fetch all registrations for Admin User (STRICT: Requires Admin Session Token)
 */
export async function fetchAllRegistrations(): Promise<StudentRegistration[]> {
  const token = getAdminSessionToken();
  if (!token) {
    console.warn('[Security] Unauthorized attempt to fetch sensitive registration data without an active admin token.');
    return [];
  }

  const mergedMap = new Map<string, StudentRegistration>();

  // 1. Fetch from Express backend with Bearer Authorization
  try {
    const res = await fetch('/api/registrations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      console.warn('[Security] Backend rejected admin token. Session invalid.');
      clearAdminSessionToken();
      return [];
    }

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.registrations)) {
        data.registrations.forEach((r: StudentRegistration) => {
          if (!mergedMap.has(r.id)) {
            mergedMap.set(r.id, r);
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Security] Error contacting backend registrations API:', err);
  }

  // 2. Fetch from Firestore `/registrations` if admin is authenticated in Firebase
  try {
    const regCollection = collection(db, 'registrations');
    const q = query(regCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    snapshot.forEach((d) => {
      const data = d.data() as StudentRegistration;
      if (data && data.email) {
        mergedMap.set(data.id || d.id, { ...data, id: data.id || d.id });
      }
    });
  } catch {
    // Firestore rules enforce isAdmin() which requires Firebase auth
  }

  // 3. Merge with local cache
  const cached = getCachedRegistrations();
  cached.forEach((r) => {
    if (!mergedMap.has(r.id)) {
      mergedMap.set(r.id, r);
    }
  });

  const list = Array.from(mergedMap.values());
  // Sort descending by createdAt
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  setCachedRegistrations(list);
  return list;
}

/**
 * Update registration status in Firestore, Server, and Local Cache
 */
export async function updateRegistrationStatusInFirestore(
  id: string,
  newStatus: StudentRegistration['status']
): Promise<void> {
  const token = getAdminSessionToken();

  // 1. Sync to backend API if admin token exists
  if (token) {
    try {
      await fetch(`/api/registrations/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // ignore
    }
  }

  // 2. Update in Firestore
  try {
    const regRef = doc(db, 'registrations', id);
    await updateDoc(regRef, { status: newStatus });
  } catch {
    // ignore
  }

  // 3. Update in local cache
  const list = getCachedRegistrations();
  const idx = list.findIndex((item) => item.id === id);
  if (idx !== -1) {
    list[idx].status = newStatus;
    setCachedRegistrations(list);
  }
}

/**
 * Delete a registration from Firestore, Server, and Local Cache
 */
export async function deleteRegistrationFromFirestore(id: string): Promise<void> {
  const token = getAdminSessionToken();

  // 1. Sync to backend API if admin token exists
  if (token) {
    try {
      await fetch(`/api/registrations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // ignore
    }
  }

  // 2. Delete from Firestore
  try {
    const regRef = doc(db, 'registrations', id);
    await deleteDoc(regRef);
  } catch {
    // ignore
  }

  // 3. Remove from local cache
  const list = getCachedRegistrations();
  const filtered = list.filter((item) => item.id !== id);
  setCachedRegistrations(filtered);
}
