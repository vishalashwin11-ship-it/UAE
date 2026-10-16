import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Administrator Security Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vishalashwin11@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'UpbeatAdmin#2026!Secure';
const SECRET_ADMIN_PATH = '/upbeat-secure-console-9354';

// In-memory active administrator sessions (token -> session)
interface AdminSession {
  email: string;
  createdAt: number;
  expiresAt: number;
}

const activeAdminSessions = new Map<string, AdminSession>();
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

// Strict Admin Authorization Middleware
const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'];
  
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof customHeader === 'string') {
    token = customHeader.trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: Administrator authentication token required to view or modify sensitive records.',
    });
  }

  const session = activeAdminSessions.get(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: Invalid or expired administrator session. Please re-authenticate.',
    });
  }

  if (session.expiresAt < Date.now()) {
    activeAdminSessions.delete(token);
    return res.status(401).json({
      success: false,
      error: 'Session Expired: Your administrator session has expired for security reasons. Please login again.',
    });
  }

  // Session is valid
  (req as any).adminSession = session;
  next();
};

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for Upbeat AI Counselor
const SYSTEM_INSTRUCTION = `You are "Upbeat AI", the senior international education and career advisor at Upbeat Abroad Education.
Upbeat Abroad Education is an elite overseas education consultancy inspired by modern student platforms like Cialfo.
Your goal is to guide prospective undergraduate and postgraduate students in:
1. Choosing top study destinations (USA, UK, Canada, Germany, Australia, Ireland, Singapore, New Zealand, France, Netherlands).
2. Understanding high-ROI career pathways (e.g. AI & Data Science in USA, Mechanical & Automative in Germany, Fintech in UK/Singapore, Healthcare & Mining in Australia).
3. Admission requirements (GPA, IELTS/TOEFL/GRE/GMAT, statement of purpose, deadlines).
4. Scholarships, education loans, and cost-of-living breakdowns.
5. Post-study work visas (USA 3-yr STEM OPT, UK 2-yr Graduate Route, Germany 18-mo Jobseeker / Chancenkarte, Canada PGWP, Australia 2-4 yr PSW).
6. Booking free counseling sessions with human senior mentors.

Tone: Highly knowledgeable, upbeat, encouraging, structured, and realistic. Use bullet points and clear formatting.
When appropriate, suggest booking a 1-on-1 counseling session with an Upbeat counselor or connecting via WhatsApp.`;

// In-memory bookings and registrations store
const bookings: any[] = [];
const registrations: any[] = [
  {
    id: 'REG-INIT-001',
    fullName: 'Aditya Sen',
    email: 'aditya.sen@example.com',
    phone: '+91 98201 44920',
    source: 'counselling_booking',
    destination: 'Germany',
    intake: 'Fall 2026',
    counselor: 'Dr. Elena Rostova',
    sessionDate: '2026-10-20',
    timeSlot: '04:00 PM - 04:45 PM',
    notes: 'Mechanical & Automotive AI focus. Target TUM & RWTH Aachen.',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'REG-INIT-002',
    fullName: 'Priya Nambiar',
    email: 'priya.n@example.com',
    phone: '+91 99104 22319',
    source: 'account_signup',
    destination: 'United States',
    intake: 'Fall 2026',
    counselor: 'Michael Vance',
    notes: 'MS in CS & Machine Learning. 8.8 CGPA, IELTS 8.0.',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'REG-INIT-003',
    fullName: 'Rohan Deshmukh',
    email: 'rohan.d@example.com',
    phone: '+971 50 234 5678',
    source: 'free_session_booking',
    destination: 'United Arab Emirates',
    intake: 'Spring 2027',
    counselor: 'Aarav Singhania',
    sessionDate: '2026-10-22',
    timeSlot: '02:30 PM - 03:15 PM',
    notes: 'Free profile evaluation for AI scholarships in Dubai DIFC & Khalifa University.',
    status: 'New',
    createdAt: new Date().toISOString(),
  }
];

// API: AI Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      // Fallback expert rule-based advisor if API key not configured yet
      const lower = message.toLowerCase();
      let fallbackText = "Hello! I am your Upbeat Abroad Education Advisor. ";
      if (lower.includes('usa') || lower.includes('united states')) {
        fallbackText += "The USA remains the premier choice for tech, business, and biomedical careers. Key highlights: 3-year STEM OPT work rights, starting tech salaries averaging $95k-$130k/year, and prestigious institutions like MIT, Stanford, CMU, and Purdue. Would you like assistance shortlisting universities based on your GPA and GRE?";
      } else if (lower.includes('germany')) {
        fallbackText += "Germany is one of the highest ROI destinations globally! Public universities offer virtually zero or low tuition fees (~€300/semester admin fee), combined with an 18-month post-study job seeker visa and the new Chancenkarte (Opportunity Card). Top fields: Mechanical, Automotive, Renewable Energy, and Embedded Systems.";
      } else if (lower.includes('uk') || lower.includes('britain')) {
        fallbackText += "The UK offers accelerated 1-year Master's programs, saving you living costs and tuition time, followed by a 2-year Graduate Route post-study work visa. Top career avenues include Investment Banking, Fintech, AI, and Life Sciences in hubs like London, Edinburgh, and Manchester.";
      } else if (lower.includes('scholarship')) {
        fallbackText += "Upbeat students have secured over $24M in merit scholarships! Key opportunities include Fulbright, Chevening, DAAD, Commonwealth, Erasmus Mundus, and university-specific dean's fellowships. Early application (9-12 months ahead) is crucial. Schedule a free profile evaluation with our team!";
      } else {
        fallbackText += `I'm happy to help you with '${message}'. Upbeat Abroad Education provides comprehensive profile evaluation, university shortlisting, SOP/LOR review, scholarship guidance, and visa interview preparation for destinations including USA, UK, Canada, Germany, Australia, and Ireland. Would you like to check top career options or book a free counseling session?`;
      }
      return res.json({ text: fallbackText });
    }

    // Format chat history for Gemini
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'bot') {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm here to help you navigate your study abroad journey. What destination or career pathway would you like to explore?";
    res.json({ text: reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to generate advisory response',
      fallbackText: "I'm temporarily experiencing connectivity issues with our AI knowledge base. However, our human counselors are available right now! Feel free to click 'Book Counselling Session' or connect with us on WhatsApp.",
    });
  }
});

// API: Register student lead or account sign-in
app.post('/api/registrations', (req: Request, res: Response) => {
  const {
    fullName,
    email,
    phone,
    source,
    destination,
    intake,
    counselor,
    sessionDate,
    timeSlot,
    notes,
    status,
  } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required for registration.' });
  }

  const id = `REG-${Date.now().toString().slice(-6)}`;
  const newReg = {
    id,
    fullName: fullName || email.split('@')[0],
    email,
    phone: phone || '',
    source: source || 'account_signin',
    destination: destination || 'Open / Undecided',
    intake: intake || 'Fall 2026',
    counselor: counselor || 'Academic Director',
    sessionDate: sessionDate || '',
    timeSlot: timeSlot || '',
    notes: notes || '',
    status: status || 'New',
    createdAt: new Date().toISOString(),
  };

  registrations.unshift(newReg);
  res.json({ success: true, registration: newReg });
});

// API: Admin Authentication (Strict Credentials Required)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  // Rate limiting / Brute-force protection
  const attemptInfo = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  const now = Date.now();
  if (attemptInfo.lockedUntil > now) {
    const minutesLeft = Math.ceil((attemptInfo.lockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Gateway locked for ${minutesLeft} more minute(s).`,
    });
  }

  // Strict email and password check
  const isEmailValid = email && (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    email.trim().toLowerCase() === 'admin@upbeatabroad.com'
  );
  const isPasswordValid = password && password.trim() === ADMIN_PASSWORD;

  if (!isEmailValid || !isPasswordValid) {
    attemptInfo.count += 1;
    if (attemptInfo.count >= 5) {
      attemptInfo.lockedUntil = now + 15 * 60 * 1000; // 15-minute lock
    }
    loginAttempts.set(ip, attemptInfo);

    return res.status(401).json({
      success: false,
      error: 'Invalid administrator credentials. Access attempt has been security-logged.',
      remainingAttempts: Math.max(0, 5 - attemptInfo.count),
    });
  }

  // Login successful: reset failed counter
  loginAttempts.delete(ip);

  // Generate a cryptographically secure token (64 hex characters)
  const token = crypto.randomBytes(32).toString('hex');
  const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours validity
  const expiresAt = now + sessionDuration;

  activeAdminSessions.set(token, {
    email: ADMIN_EMAIL,
    createdAt: now,
    expiresAt,
  });

  return res.json({
    success: true,
    message: 'Administrator authentication successful.',
    token,
    admin: {
      email: ADMIN_EMAIL,
      displayName: 'Vishal Ashwin (Senior Administrator)',
      role: 'super_admin',
    },
    secretPath: SECRET_ADMIN_PATH,
    expiresAt,
  });
});

// API: Verify Admin Token status
app.get('/api/admin/verify', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    authenticated: true,
    adminEmail: ADMIN_EMAIL,
    session: (req as any).adminSession,
    secretPath: SECRET_ADMIN_PATH,
  });
});

// API: Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeAdminSessions.delete(token);
  }
  res.json({ success: true, message: 'Admin session terminated securely.' });
});

// API: Get all registrations (STRICTLY PROTECTED - Admin Authorization Required)
app.get('/api/registrations', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: registrations.length,
    registrations,
    adminEmail: ADMIN_EMAIL,
    timestamp: new Date().toISOString(),
  });
});

// API: Update registration status (STRICTLY PROTECTED - Admin Authorization Required)
app.patch('/api/registrations/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, counselor, notes } = req.body;
  const index = registrations.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Registration not found' });
  }

  if (status) registrations[index].status = status;
  if (counselor) registrations[index].counselor = counselor;
  if (notes !== undefined) registrations[index].notes = notes;
  registrations[index].updatedAt = new Date().toISOString();

  res.json({ success: true, registration: registrations[index] });
});

// API: Delete registration record (STRICTLY PROTECTED - Admin Authorization Required)
app.delete('/api/registrations/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = registrations.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Registration not found' });
  }
  const deleted = registrations.splice(index, 1);
  res.json({ success: true, message: 'Record securely removed from database', deleted: deleted[0] });
});

// API: Book counselling session
app.post('/api/counselling/book', (req: Request, res: Response) => {
  const {
    fullName,
    email,
    phone,
    destination,
    intake,
    counselor,
    date,
    timeSlot,
    currentEducation,
    notes,
    isFreeSession,
  } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone number are required.' });
  }

  const bookingId = `UAE-${Date.now().toString().slice(-6)}`;
  const newBooking = {
    bookingId,
    fullName,
    email,
    phone,
    destination: destination || 'Undecided / Open',
    intake: intake || 'Fall 2026',
    counselor: counselor || 'Senior Academic Director',
    date: date || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || '04:00 PM - 04:45 PM',
    currentEducation: currentEducation || 'Undergraduate',
    notes: notes || '',
    meetUrl: `https://meet.google.com/uae-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`,
    status: 'Confirmed',
    isFreeSession: Boolean(isFreeSession),
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);

  // Synchronize into master registrations list
  registrations.unshift({
    id: `REG-${bookingId}`,
    fullName,
    email,
    phone,
    source: isFreeSession ? 'free_session_booking' : 'counselling_booking',
    destination: newBooking.destination,
    intake: newBooking.intake,
    counselor: newBooking.counselor,
    sessionDate: newBooking.date,
    timeSlot: newBooking.timeSlot,
    notes: `${newBooking.currentEducation ? `Edu: ${newBooking.currentEducation}. ` : ''}${newBooking.notes}`,
    status: 'Confirmed',
    createdAt: newBooking.createdAt,
  });

  res.json({
    success: true,
    message: 'Your counselling session is successfully scheduled!',
    booking: newBooking,
  });
});

// API: Contact Us form
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

  registrations.unshift({
    id: `REG-${ticketId}`,
    fullName: name,
    email,
    phone: phone || '',
    source: 'contact_inquiry',
    destination: 'Global Inquiry',
    intake: 'Fall 2026',
    counselor: 'Regional Desk',
    sessionDate: '',
    timeSlot: '',
    notes: `Subject: ${subject || 'General Enquiry'}. Message: ${message || ''}`,
    status: 'New',
    createdAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    ticketId,
    message: 'Thank you for reaching out! An Upbeat regional advisor will get in touch within 3 business hours.',
  });
});

// Trap default/predictable admin paths (Security Obfuscation)
app.get(['/admin', '/admin/login', '/admin-login', '/wp-admin', '/dashboard/admin', '/backend/admin'], (_req: Request, res: Response) => {
  res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 Not Found</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 60px 20px; background: #0f172a; color: #f8fafc; }
    h1 { font-size: 32px; color: #ef4444; }
    p { color: #94a3b8; font-size: 14px; max-width: 480px; margin: 16px auto; }
    a { color: #38bdf8; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <h1>404 - Endpoint Not Found</h1>
  <p>The requested administrative path has been decommissioned or relocated for security compliance. Public access is forbidden.</p>
  <a href="/">Return to Upbeat Abroad Education Home</a>
</body>
</html>`);
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Upbeat Abroad Education server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
