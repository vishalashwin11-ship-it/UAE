import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

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

// API: Get all registrations (for Admin Portal)
app.get('/api/registrations', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: registrations.length,
    registrations,
    adminEmail: 'vishalashwin11@gmail.com',
  });
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
