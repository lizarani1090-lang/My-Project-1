const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 3000;
const ROOT = __dirname;
const SESSION_COOKIE = 'pulse_predictor_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

// Master fallback account
const TRIAL_ACCOUNT = {
  email: process.env.ADMIN_USER_ID || 'admin@dksingh@rec',
  password: process.env.ADMIN_PASSWORD || 'dksingh@rec'
};

// 4 Dedicated Role-Specific Login Accounts
const ROLE_ACCOUNTS = {
  asha: {
    role: 'asha',
    name: 'Sunita Devi (ASHA)',
    workplace: 'Sub-Centre 4, Ward 4',
    email: 'asha@pulse.in',
    aliases: ['asha@pulse.in', 'asha', 'asha@dksingh@rec'],
    password: 'asha@123'
  },
  doctor: {
    role: 'doctor',
    name: 'Dr. Rajesh Kumar',
    workplace: 'PHC Ward 4 Clinic',
    email: 'doctor@pulse.in',
    aliases: ['doctor@pulse.in', 'doctor', 'doctor@dksingh@rec'],
    password: 'doctor@123'
  },
  facility: {
    role: 'facility',
    name: 'Rampur PHC Admin',
    workplace: 'Rural Hospital Logistics',
    email: 'facility@pulse.in',
    aliases: ['facility@pulse.in', 'facility', 'facility@dksingh@rec'],
    password: 'facility@123'
  },
  patient: {
    role: 'patient',
    name: 'Damodar Kumar Singh',
    workplace: 'ABHA: 91-8507-4746-3815',
    email: 'damodarkumarsingh8507@gmail.com',
    abhaId: '91-8507-4746-3815',
    aliases: [
      'damodarkumarsingh8507@gmail.com',
      'damodar',
      'damodarkumar',
      'dksingh',
      'patient@pulse.in',
      'patient',
      'patient@dksingh@rec',
      'ramesh.patil@pulse.in',
      'ramesh'
    ],
    password: 'patient@123'
  }
};

const ROLES = new Set(['asha', 'doctor', 'facility', 'patient']);
const sessions = new Map();

// Registered user accounts store (in-memory with fallback & dynamic registration)
const registeredUsers = new Map();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Seed initial default accounts
Object.values(ROLE_ACCOUNTS).forEach(acc => {
  const userObj = {
    id: `usr-${acc.role}-default`,
    name: acc.name,
    workplace: acc.workplace,
    email: acc.email.toLowerCase(),
    role: acc.role,
    abhaId: acc.abhaId || (acc.role === 'patient' ? '91-8507-4746-3815' : ''),
    passwordHash: hashPassword(acc.password),
    createdAt: new Date().toISOString()
  };
  registeredUsers.set(acc.email.toLowerCase(), userObj);
  (acc.aliases || []).forEach(alias => {
    registeredUsers.set(alias.toLowerCase(), userObj);
  });
});

const localTriageCases = [
  {
    id: 'trg-1',
    patientName: 'Ramesh Patil',
    abhaId: '12-3456-7890',
    symptoms: 'Fever (102°F), Productive Cough, Breathlessness',
    bloodPressure: '150/95',
    pulseRate: '98 bpm',
    spo2: '94%',
    riskScore: 8,
    riskLevel: 'HIGH',
    status: 'pending',
    ashaName: 'Sunita Devi',
    subCentre: 'Sub-Centre 4',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'trg-2',
    patientName: 'Savitri Bai',
    abhaId: '44-8899-1122',
    symptoms: 'High BP Spike, Severe Headache',
    bloodPressure: '165/100',
    pulseRate: '88 bpm',
    spo2: '96%',
    riskScore: 7,
    riskLevel: 'HIGH',
    status: 'pending',
    ashaName: 'Sunita Devi',
    subCentre: 'Sub-Centre 4',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  },
  {
    id: 'trg-3',
    patientName: 'Kavita Devi',
    abhaId: '90-1122-3344',
    symptoms: 'Stomach Pain, Mild dehydration',
    bloodPressure: '120/80',
    pulseRate: '82 bpm',
    spo2: '98%',
    riskScore: 4,
    riskLevel: 'MODERATE',
    status: 'pending',
    ashaName: 'Rekha Tai',
    subCentre: 'Sub-Centre 2',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  }
];

const localInventory = [
  { id: 'amoxicillin', name: 'Amoxicillin 500mg', category: 'medicine', quantity: 220, unit: 'strips', threshold: 50, status: 'available' },
  { id: 'ifa', name: 'Iron & Folic Acid (IFA)', category: 'medicine', quantity: 18, unit: 'strips', threshold: 25, status: 'low_stock' },
  { id: 'ors', name: 'Oral Rehydration Salts (ORS)', category: 'medicine', quantity: 0, unit: 'packets', threshold: 40, status: 'out_of_stock' },
  { id: 'oxygen', name: 'Oxygen Cylinders (Type D)', category: 'oxygen', quantity: 8, unit: 'cylinders', threshold: 5, status: 'available' },
  { id: 'beds_general', name: 'General Wards Beds', category: 'bed', quantity: 14, unit: 'vacant', threshold: 4, status: 'available' },
  { id: 'beds_icu', name: 'ICU Oxygen Beds', category: 'bed', quantity: 3, unit: 'vacant', threshold: 2, status: 'low_stock' }
];

const localReferrals = [
  {
    id: 'ref-1',
    triageId: 'trg-1',
    patientName: 'Ramesh Patil',
    abhaId: '12-3456-7890',
    sourceFacility: 'Sub-Centre 4',
    targetFacility: 'District Hospital Diagnostic Hub',
    priority: 'CRITICAL',
    transportStatus: 'in_transit',
    currentStage: 2,
    stageName: 'Ambulance 108 In Transit',
    ambulanceNumber: 'MH-12-AMB-108',
    driverName: 'Santosh Jadhav',
    driverPhone: '+91 98220 10811',
    eta: '14 mins',
    bedReserved: true,
    bedAssigned: 'ICU Bed #4',
    bedType: 'ICU Oxygen Bed',
    vitalsSummary: 'BP: 150/95 · SpO2: 94% · Pulse: 98 bpm',
    regulationSummary: 'HIGH Risk (8/10) · ICMR Rule 1.2 & 2.2 Triggered',
    notes: 'Acute respiratory distress with stage-2 hypertension. Priority emergency transfer mandated.',
    statusNote: 'Ambulance en route on Highway 4 with active oxygenation.',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString()
  }
];

const localConsultations = [
  {
    id: 'cns-1',
    patientName: 'Ramesh Patil',
    doctorName: 'Dr. Rajesh Kumar',
    tokenNumber: 'Token #18',
    scheduledTime: '2:00 PM Today',
    status: 'waiting',
    createdAt: new Date().toISOString()
  }
];

// Live WebRTC Teleconsultation Signaling Relay
let activeCallSession = null;
const activeCallCandidates = [];

function pruneCallCandidates() {
  const now = Date.now();
  while (activeCallCandidates.length > 80 || (activeCallCandidates.length > 0 && now - activeCallCandidates[0].timestamp > 120000)) {
    activeCallCandidates.shift();
  }
}

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map(item => {
    const separator = item.indexOf('=');
    return separator === -1 ? [item.trim(), ''] : [item.slice(0, separator).trim(), decodeURIComponent(item.slice(separator + 1))];
  }));
}

function getSession(request, url) {
  let token = parseCookies(request)[SESSION_COOKIE];
  if (!token && request.headers.authorization) {
    const auth = request.headers.authorization;
    if (auth.startsWith('Bearer ')) token = auth.slice(7).trim();
  }
  if (!token && url && url.searchParams && url.searchParams.has('token')) {
    token = url.searchParams.get('token');
  }
  const session = token && sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, ...session };
}

function sendJson(response, status, data, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  response.end(JSON.stringify(data));
}

function redirect(response, location) {
  response.writeHead(302, { Location: location, 'Cache-Control': 'no-store' });
  response.end();
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => {
      body += chunk;
      if (body.length > 16 * 1024) reject(new Error('Request too large'));
    });
    request.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (_) { reject(new Error('Invalid JSON')); }
    });
    request.on('error', reject);
  });
}

function serveFile(response, pathname) {
  let requestPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let filePath = path.resolve(ROOT, requestPath);
  if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
    sendJson(response, 403, { error: 'Forbidden' });
    return;
  }

  // Check if target exists; if not and no extension, try with .html
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(`${filePath}.html`)) {
      filePath = `${filePath}.html`;
    } else {
      // Fallback to index.html for browser routes or login.html
      const fallbackFile = path.resolve(ROOT, 'login.html');
      if (fs.existsSync(fallbackFile)) {
        filePath = fallbackFile;
      }
    }
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(response, error.code === 'ENOENT' ? 404 : 500, { error: error.code === 'ENOENT' ? 'Not found' : 'Unable to read file' });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const headers = {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    };
    if (ext === '.html' || ext === '.js' || ext === '.css' || ext === '.json' || ext === '.webmanifest') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }
    response.writeHead(200, headers);
    response.end(content);
  });
}

function authenticateUser(role, email, password) {
  const normEmail = (email || '').trim().toLowerCase();
  const normPass = (password || '').trim();

  // Universal master fallback (supports admin and developer credentials)
  const isMasterUser = normEmail === TRIAL_ACCOUNT.email.toLowerCase() ||
    normEmail === 'damodarkumarsingh8507@gmail.com' ||
    normEmail === 'dksingh' ||
    normEmail === 'dksingh@rec' ||
    normEmail === 'damodar';
  const isMasterPass = normPass === TRIAL_ACCOUNT.password ||
    normPass === 'dksingh@rec' ||
    normPass === 'patient@123';

  if (isMasterUser && isMasterPass) {
    const targetRole = role || 'patient';
    const defaultAcc = ROLE_ACCOUNTS[targetRole] || ROLE_ACCOUNTS.patient;
    const isPatient = targetRole === 'patient';
    return {
      ok: true,
      role: targetRole,
      name: isPatient ? 'Damodar Kumar Singh' : (defaultAcc.name || 'Damodar Kumar Singh'),
      workplace: isPatient ? 'ABHA: 91-8507-4746-3815' : (defaultAcc.workplace || 'District Administration'),
      email: 'damodarkumarsingh8507@gmail.com',
      abhaId: isPatient ? '91-8507-4746-3815' : (defaultAcc.abhaId || '')
    };
  }

  // 1. Check registered users store
  const user = registeredUsers.get(normEmail);
  if (user) {
    const hashed = hashPassword(normPass);
    if (user.passwordHash === hashed) {
      // If a specific portal role is requested, verify match or allow if matching
      if (role && user.role !== role) {
        return {
          ok: false,
          error: `This account is registered for the "${user.role.toUpperCase()}" workspace. Please sign in via the ${user.role.toUpperCase()} portal or choose your correct workspace.`
        };
      }
      return {
        ok: true,
        role: user.role,
        name: user.name,
        workplace: user.workplace,
        email: user.email,
        phone: user.phone || '',
        abhaId: user.abhaId || '',
        licenseNumber: user.licenseNumber || ''
      };
    }
  }

  // 2. Check built-in demo role accounts
  const acc = ROLE_ACCOUNTS[role];
  if (acc) {
    const emailMatch = acc.aliases.some(a => a.toLowerCase() === normEmail);
    const passMatch = normPass === acc.password || (isMasterPass && normEmail.includes('dksingh'));

    if (emailMatch && passMatch) {
      return {
        ok: true,
        role: acc.role,
        name: acc.name,
        workplace: acc.workplace,
        email: acc.email,
        abhaId: acc.abhaId || ''
      };
    }
  }

  // 3. Fallback scan across all role accounts if role was flexible
  for (const rKey of Object.keys(ROLE_ACCOUNTS)) {
    const fallbackAcc = ROLE_ACCOUNTS[rKey];
    if (fallbackAcc.aliases.some(a => a.toLowerCase() === normEmail) && (normPass === fallbackAcc.password || isMasterPass)) {
      if (role && rKey !== role) {
        return {
          ok: false,
          error: `This account belongs to the "${rKey.toUpperCase()}" workspace. Please use the ${rKey.toUpperCase()} portal.`
        };
      }
      return {
        ok: true,
        role: fallbackAcc.role,
        name: fallbackAcc.name,
        workplace: fallbackAcc.workplace,
        email: fallbackAcc.email,
        abhaId: fallbackAcc.abhaId || ''
      };
    }
  }

  return {
    ok: false,
    error: 'Invalid credentials. Please verify your ID/Email and password, or register a new account.'
  };
}

async function handleApi(request, response, pathname, url) {
  if (pathname === '/api/session' && request.method === 'GET') {
    let session = getSession(request, url);
    if (!session) {
      // Default to ASHA Worker (Sunita Devi) workspace so user can start from ASHA first work immediately
      const token = crypto.randomBytes(24).toString('hex');
      session = {
        token,
        role: 'asha',
        name: 'Sunita Devi (ASHA)',
        workplace: 'Sub-Centre 4, Ward 4',
        email: 'asha@pulse.in',
        phone: '+91 98765 43210',
        abhaId: '',
        expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
      };
      sessions.set(token, session);
      return sendJson(response, 200, {
        role: session.role,
        name: session.name,
        workplace: session.workplace,
        email: session.email,
        phone: session.phone || '',
        abhaId: session.abhaId || '',
        token: session.token
      }, {
        'Set-Cookie': `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`
      });
    }
    return sendJson(response, 200, {
      role: session.role,
      name: session.name,
      workplace: session.workplace,
      email: session.email,
      phone: session.phone || '',
      abhaId: session.abhaId || ''
    });
  }

  // Universal User Registration for every workspace (ASHA, Doctor, Facility, Patient)
  if (pathname === '/api/register' && request.method === 'POST') {
    try {
      const payload = await readJson(request);
      const { name, email, password, role, workplace, phone, abhaId, licenseNumber } = payload;

      if (!name || !name.trim()) {
        return sendJson(response, 400, { error: 'Please enter your full name.' });
      }
      if (!email || !email.trim() || !email.includes('@')) {
        return sendJson(response, 400, { error: 'Please enter a valid email address.' });
      }
      if (!password || password.length < 4) {
        return sendJson(response, 400, { error: 'Password must be at least 4 characters long.' });
      }
      if (!ROLES.has(role)) {
        return sendJson(response, 400, { error: 'Please select a valid workspace role (ASHA, Doctor, Facility Admin, or Patient).' });
      }

      const normEmail = email.trim().toLowerCase();

      // Check if user already exists
      if (registeredUsers.has(normEmail)) {
        return sendJson(response, 409, { error: 'An account with this email address already exists. Please sign in instead.' });
      }

      // Default workplace descriptions if empty
      let finalWorkplace = (workplace || '').trim();
      if (!finalWorkplace) {
        if (role === 'asha') finalWorkplace = 'Primary Sub-Centre Ward';
        else if (role === 'doctor') finalWorkplace = 'Primary Health Centre (PHC)';
        else if (role === 'facility') finalWorkplace = 'District Hospital Administration';
        else if (role === 'patient') finalWorkplace = abhaId ? `ABHA: ${abhaId}` : 'Rural Health Care Network';
      }

      const newUser = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: name.trim(),
        email: normEmail,
        role,
        workplace: finalWorkplace,
        phone: (phone || '').trim(),
        abhaId: (abhaId || '').trim(),
        licenseNumber: (licenseNumber || '').trim(),
        passwordHash: hashPassword(password.trim()),
        createdAt: new Date().toISOString()
      };

      registeredUsers.set(normEmail, newUser);

      // Create session immediately upon registration
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, {
        role: newUser.role,
        name: newUser.name,
        workplace: newUser.workplace,
        email: newUser.email,
        phone: newUser.phone,
        abhaId: newUser.abhaId,
        expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
      });

      return sendJson(response, 201, {
        ok: true,
        message: 'Account registered successfully!',
        role: newUser.role,
        name: newUser.name,
        workplace: newUser.workplace,
        email: newUser.email,
        token
      }, {
        'Set-Cookie': `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`
      });
    } catch (error) {
      return sendJson(response, 400, { error: error.message || 'Unable to complete registration. Please verify details.' });
    }
  }

  // Get registered users summary for directory or verification
  if (pathname === '/api/users' && request.method === 'GET') {
    const list = Array.from(registeredUsers.values()).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      workplace: u.workplace,
      createdAt: u.createdAt
    }));
    return sendJson(response, 200, { ok: true, users: list });
  }

  if (pathname === '/api/login' && request.method === 'POST') {
    try {
      const { email, password, role } = await readJson(request);
      if (role && !ROLES.has(role)) return sendJson(response, 400, { error: 'Please choose a valid role portal.' });

      const auth = authenticateUser(role, email, password);
      if (!auth.ok) {
        return sendJson(response, 401, { error: auth.error });
      }

      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, {
        role: auth.role,
        name: auth.name,
        workplace: auth.workplace,
        email: auth.email,
        phone: auth.phone || '',
        abhaId: auth.abhaId || '',
        expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
      });

      return sendJson(response, 200, {
        role: auth.role,
        name: auth.name,
        workplace: auth.workplace,
        email: auth.email,
        phone: auth.phone || '',
        abhaId: auth.abhaId || '',
        token
      }, {
        'Set-Cookie': `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`
      });
    } catch (error) {
      return sendJson(response, 400, { error: error.message === 'Request too large' ? error.message : 'Please provide valid sign-in details.' });
    }
  }

  if (pathname === '/api/logout' && request.method === 'POST') {
    const session = getSession(request, url);
    if (session) sessions.delete(session.token);
    return sendJson(response, 200, { ok: true }, {
      'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
    });
  }

  // ==============================================================================
  // National Health Mission & ICMR Clinical Triage Regulation Assessment Engine
  // ==============================================================================
  function evaluateClinicalTriageRegulations(payload) {
    const patientName = (payload.patientName || 'Anonymous Resident').trim();
    const abhaId = (payload.abhaId || '12-3456-7890').trim();
    const symptoms = (payload.symptoms || 'General Malaise').trim();
    const bp = (payload.bloodPressure || '120/80').trim();
    const pulse = (payload.pulseRate || '78 bpm').trim();
    const spo2 = (payload.spo2 || '98%').trim();
    const temp = (payload.temperature || '98.6°F').trim();
    const ashaName = (payload.ashaName || 'Sunita Devi').trim();
    const subCentre = (payload.subCentre || 'Sub-Centre 4').trim();
    const targetFacility = (payload.targetFacility || 'District Hospital Diagnostic Hub').trim();

    // Parsing physiological vitals
    const bpParts = bp.split('/');
    const systolic = parseInt(bpParts[0], 10) || 120;
    const diastolic = parseInt(bpParts[1], 10) || 80;
    const spo2Num = parseFloat(spo2) || 98;
    const pulseNum = parseInt(pulse, 10) || 78;
    const tempNum = parseFloat(temp) || 98.6;

    let score = 0;
    const triggeredRules = [];
    const emergencyFlags = [];
    const frontlineActions = [];

    // Rule 1: SpO2 Hypoxemia & Respiratory Compromise (ICMR Directive Sec 1.0)
    if (spo2Num < 90) {
      score += 5;
      triggeredRules.push(`ICMR Directive 1.1: Severe Hypoxemia (SpO2 ${spo2Num}% < 90%). Emergency oxygenation and priority 108 transfer mandated.`);
      emergencyFlags.push(`Critical SpO2 Desaturation (${spo2Num}%)`);
      frontlineActions.push('Administer immediate high-flow oxygen via non-rebreather mask');
      frontlineActions.push('Summon 108 Emergency Ambulance with mobile oxygen cylinder support');
    } else if (spo2Num < 95) {
      score += 2;
      triggeredRules.push(`ICMR Directive 1.2: Borderline Hypoxemia (SpO2 ${spo2Num}%). Mild respiratory compromise.`);
      emergencyFlags.push(`Borderline Low SpO2 (${spo2Num}%)`);
      frontlineActions.push('Place patient in upright semi-fowler posture (45°) to ease breathing');
    }

    // Rule 2: Blood Pressure & Cardiovascular Urgency (ICMR Directive Sec 2.0)
    if (systolic >= 180 || diastolic >= 110) {
      score += 5;
      triggeredRules.push(`ICMR Directive 2.1: Hypertensive Crisis (BP ${bp} ≥ 180/110 mmHg). Immediate stroke/cardiac alert.`);
      emergencyFlags.push(`Hypertensive Crisis (${bp})`);
      frontlineActions.push('Keep patient calm in quiet environment; re-check BP every 10 min');
    } else if (systolic >= 160 || diastolic >= 100) {
      score += 3;
      triggeredRules.push(`ICMR Directive 2.2: Stage-2 Hypertension (BP ${bp} ≥ 160/100 mmHg). Organ risk assessment indicated.`);
      emergencyFlags.push(`Stage-2 Hypertension (${bp})`);
    } else if (systolic >= 140 || diastolic >= 90) {
      score += 2;
      triggeredRules.push(`ICMR Directive 2.3: Stage-1 Hypertension (BP ${bp} ≥ 140/90 mmHg). Regular tracking indicated.`);
    } else if (systolic >= 130 || diastolic >= 85) {
      score += 1;
      triggeredRules.push(`ICMR Directive 2.4: Pre-Hypertension (BP ${bp}). Lifestyle and salt counseling.`);
    }

    // Rule 3: Pulse & Hemodynamic Stability (ICMR Directive Sec 3.0)
    if (pulseNum > 120) {
      score += 3;
      triggeredRules.push(`ICMR Directive 3.1: Severe Tachycardia (Pulse ${pulseNum} bpm). Circulatory collapse risk.`);
      emergencyFlags.push(`Severe Tachycardia (${pulseNum} bpm)`);
    } else if (pulseNum > 100) {
      score += 1;
      triggeredRules.push(`ICMR Directive 3.2: Elevated Pulse Rate (${pulseNum} bpm). Stress or mild febrile response.`);
    } else if (pulseNum < 50) {
      score += 3;
      triggeredRules.push(`ICMR Directive 3.3: Severe Bradycardia (${pulseNum} bpm). Cardiac conduction risk.`);
      emergencyFlags.push(`Critical Bradycardia (${pulseNum} bpm)`);
    }

    // Rule 4: Symptom Complex Cross-Validation (ICMR Directive Sec 4.0)
    const symptomsLower = symptoms.toLowerCase();
    const isNormalGeneral = symptomsLower.includes('general malaise') || symptomsLower.includes('routine checkup') || symptomsLower.includes('none') || symptomsLower === 'normal';

    if (!isNormalGeneral) {
      // Acute Respiratory Red Flags
      if (symptomsLower.includes('breath') || symptomsLower.includes('dum') || symptomsLower.includes('saas') || symptomsLower.includes('dyspnea')) {
        score += 3;
        triggeredRules.push('ICMR Directive 4.1: Acute Breathlessness / Dyspnea.');
        emergencyFlags.push('Acute Breathlessness');
        frontlineActions.push('Maintain patent airway and loosen tight collar/clothing');
      }
      // Acute Cardiac Red Flags
      if (symptomsLower.includes('chest') || symptomsLower.includes('tightness') || symptomsLower.includes('chhati') || symptomsLower.includes('angina')) {
        score += 4;
        triggeredRules.push('ICMR Directive 4.2: Acute Chest Discomfort / Precordial Pain. Cardiac ischemic screening triggered.');
        emergencyFlags.push('Chest Tightness / Precordial Pain');
        frontlineActions.push('Keep patient physically still; prepare emergency referral to hospital');
      }
      // Fever Assessment
      if (symptomsLower.includes('high fever') || tempNum >= 102) {
        score += 3;
        triggeredRules.push(`ICMR Directive 4.3: High-Grade Pyrexia (${tempNum}°F). Febrile infection protocol.`);
        emergencyFlags.push('High Fever');
        frontlineActions.push('Cold sponging; administer antipyretic if authorized; monitor vitals');
      } else if (symptomsLower.includes('fever') || symptomsLower.includes('bukhar') || tempNum >= 100) {
        score += 1;
        triggeredRules.push(`ICMR Directive 4.4: Low/Moderate Pyrexia (${tempNum}°F).`);
        frontlineActions.push('Check hydration status; administer oral fluids (ORS)');
      }
      // Mild Frontline Symptoms (Normal daily presentations)
      if (symptomsLower.includes('cold') || symptomsLower.includes('cough') || symptomsLower.includes('khansi') || symptomsLower.includes('sardi')) {
        score += 1;
        triggeredRules.push('ICMR Directive 4.5: Upper Respiratory Symptoms (Mild Cough & Cold).');
        frontlineActions.push('Steam inhalation and warm fluid intake recommended');
      }
      if (symptomsLower.includes('stomach') || symptomsLower.includes('pet') || symptomsLower.includes('abdominal')) {
        score += 1;
        triggeredRules.push('ICMR Directive 4.6: Mild Abdominal Discomfort.');
        frontlineActions.push('Ensure adequate hydration and light meals; observe for changes');
      }
      if (symptomsLower.includes('headache') || symptomsLower.includes('sar dard') || symptomsLower.includes('body ache') || symptomsLower.includes('fatigue')) {
        score += 1;
        triggeredRules.push('ICMR Directive 4.7: Mild Headache / General Body Ache.');
        frontlineActions.push('Advise rest in cool environment and hydration');
      }
    }

    // Bound risk score between 0 and 10
    const finalScore = Math.min(10, Math.max(0, score));

    // Tier Classification according to Indian National Health Mission Standards
    let riskLevel = 'LOW';
    let protocolTier = 'GREEN_ROUTINE';
    let priority = 'ROUTINE';
    let mandatoryReferral = false;

    // High risk requires high score OR critical emergency red-flags
    const hasCriticalEmergency = emergencyFlags.some(f => 
      f.includes('Critical') || f.includes('Hypertensive Crisis') || f.includes('Chest Tightness')
    );

    if (finalScore >= 7 || hasCriticalEmergency) {
      riskLevel = 'HIGH';
      protocolTier = 'RED_RESUSCITATION';
      priority = 'CRITICAL';
      mandatoryReferral = true;
    } else if (finalScore >= 4) {
      riskLevel = 'MODERATE';
      protocolTier = 'YELLOW_URGENT';
      priority = 'URGENT';
      mandatoryReferral = false; // Moderate cases recommend teleconsult, not mandatory 108 ambulance transfer
    } else {
      riskLevel = 'LOW';
      protocolTier = 'GREEN_ROUTINE';
      priority = 'ROUTINE';
      mandatoryReferral = false;
    }

    if (frontlineActions.length === 0) {
      frontlineActions.push('Normal vitals confirmed. Advise balanced diet, hydration, and regular follow-up with ASHA');
      frontlineActions.push('Re-assess vitals in 24-48 hours if new symptoms arise');
    }

    let referralDirective = '';
    if (mandatoryReferral) {
      referralDirective = `Mandatory priority emergency transfer to ${targetFacility} via 108 Emergency Ambulance.`;
    } else if (riskLevel === 'MODERATE') {
      referralDirective = `Continue sub-centre observation; schedule teleconsultation with PHC Medical Officer within 24 hours.`;
    } else {
      referralDirective = `Normal/routine clinical presentation. Sub-centre home care and routine ASHA follow-up advised.`;
    }

    return {
      patientName,
      abhaId,
      symptoms,
      bloodPressure: bp,
      pulseRate: pulse,
      spo2,
      temperature: temp,
      riskScore: finalScore,
      riskLevel,
      protocolTier,
      priority,
      mandatoryReferral,
      regulationProtocol: 'ICMR-NHM Frontline Emergency Standard 2026 (Rural Triage Directive)',
      triggeredRules,
      emergencyFlags,
      frontlineActions,
      referralDirective,
      targetFacility,
      ashaName,
      subCentre
    };
  }

  // Triage Generation & Regulation Data Storing API
  if (pathname === '/api/triage/generate' || (pathname === '/api/triage' && request.method === 'POST')) {
    try {
      const payload = await readJson(request);
      const evalResult = evaluateClinicalTriageRegulations(payload);

      // Deduplication: if an identical triage was registered within the last 15 seconds, return it
      const now = Date.now();
      const existingRecent = localTriageCases.find(c => 
        c.patientName.toLowerCase() === evalResult.patientName.toLowerCase() &&
        (now - new Date(c.createdAt).getTime()) < 15000 &&
        c.bloodPressure === evalResult.bloodPressure &&
        c.symptoms === evalResult.symptoms
      );
      if (existingRecent) {
        const matchingRef = localReferrals.find(r => r.triageId === existingRecent.id);
        return sendJson(response, 200, {
          ok: true,
          data: existingRecent,
          triageCase: existingRecent,
          assessment: existingRecent,
          referral: matchingRef || null,
          message: 'Existing recent triage retrieved (duplicate submission ignored).'
        });
      }

      const shouldRefer = Boolean(payload.initiateReferral === true || evalResult.mandatoryReferral);

      const newCase = {
        id: `trg-${Date.now()}`,
        patientName: evalResult.patientName,
        abhaId: evalResult.abhaId,
        symptoms: evalResult.symptoms,
        bloodPressure: evalResult.bloodPressure,
        pulseRate: evalResult.pulseRate,
        spo2: evalResult.spo2,
        temperature: evalResult.temperature,
        riskScore: evalResult.riskScore,
        riskLevel: evalResult.riskLevel,
        protocolTier: evalResult.protocolTier,
        priority: evalResult.priority,
        mandatoryReferral: evalResult.mandatoryReferral,
        regulationProtocol: evalResult.regulationProtocol,
        triggeredRules: evalResult.triggeredRules,
        emergencyFlags: evalResult.emergencyFlags,
        frontlineActions: evalResult.frontlineActions,
        referralDirective: evalResult.referralDirective,
        ashaName: evalResult.ashaName,
        subCentre: evalResult.subCentre,
        targetFacility: evalResult.targetFacility,
        status: shouldRefer ? 'referred' : 'completed',
        createdAt: new Date().toISOString()
      };

      let linkedReferral = null;
      // ONLY create hospital referral if mandatory (HIGH risk) or explicitly requested
      if (shouldRefer) {
        linkedReferral = {
          id: `ref-${Date.now()}`,
          triageId: newCase.id,
          patientName: newCase.patientName,
          abhaId: newCase.abhaId,
          sourceFacility: newCase.subCentre || 'Sub-Centre 4',
          targetFacility: payload.targetFacility || evalResult.targetFacility || 'District Hospital Diagnostic Hub',
          priority: evalResult.priority,
          transportStatus: 'in_transit',
          currentStage: 2,
          stageName: 'Ambulance 108 In Transit',
          ambulanceNumber: payload.ambulanceNumber || 'MH-12-AMB-108',
          driverName: 'Santosh Jadhav',
          driverPhone: '+91 98220 10811',
          eta: payload.eta || '14 mins',
          bedReserved: evalResult.riskScore >= 7,
          bedAssigned: evalResult.riskScore >= 7 ? 'ICU Bed #4' : 'General Bed #12',
          bedType: evalResult.riskScore >= 7 ? 'ICU Oxygen Bed' : 'General Ward Bed',
          vitalsSummary: `BP: ${newCase.bloodPressure} · SpO2: ${newCase.spo2} · Pulse: ${newCase.pulseRate}`,
          regulationSummary: `${newCase.riskLevel} Risk (${newCase.riskScore}/10) · ${newCase.triggeredRules.slice(0, 2).join('; ')}`,
          notes: newCase.referralDirective,
          statusNote: 'Ambulance 108 dispatched with active mobile monitoring.',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        newCase.referralId = linkedReferral.id;
        localReferrals.unshift(linkedReferral);
      }

      localTriageCases.unshift(newCase);

      return sendJson(response, 201, {
        ok: true,
        data: newCase,
        triageCase: newCase,
        assessment: newCase,
        referral: linkedReferral,
        message: 'Triage assessment and clinical regulation data stored successfully.'
      });
    } catch (err) {
      return sendJson(response, 400, { error: 'Invalid triage payload: ' + err.message });
    }
  }

  // Triage Retrieval API
  if (pathname === '/api/triage' && request.method === 'GET') {
    return sendJson(response, 200, { ok: true, data: localTriageCases });
  }

  // Stock API
  if (pathname === '/api/stock') {
    if (request.method === 'GET') {
      return sendJson(response, 200, { ok: true, data: localInventory });
    }
    if (request.method === 'POST') {
      try {
        const { itemId, action, quantity } = await readJson(request);
        const item = localInventory.find(i => i.id === itemId);
        if (!item) return sendJson(response, 404, { error: 'Item not found.' });
        if (action === 'restock') {
          item.quantity += (Number(quantity) || 100);
          item.status = item.quantity > item.threshold ? 'available' : 'low_stock';
          item.lastRestocked = new Date().toISOString();
        }
        return sendJson(response, 200, { ok: true, data: item });
      } catch (err) {
        return sendJson(response, 400, { error: 'Invalid stock request.' });
      }
    }
  }

  // Referrals API — Multi-Facility Tracking & Query
  if (pathname === '/api/referrals') {
    if (request.method === 'GET') {
      const facilityFilter = (url.searchParams.get('facility') || '').toLowerCase();
      const patientFilter = (url.searchParams.get('patient') || '').toLowerCase();
      const statusFilter = (url.searchParams.get('status') || '').toLowerCase();

      let results = localReferrals;
      if (facilityFilter) {
        results = results.filter(r => 
          (r.targetFacility || '').toLowerCase().includes(facilityFilter) ||
          (r.sourceFacility || '').toLowerCase().includes(facilityFilter)
        );
      }
      if (patientFilter) {
        results = results.filter(r => 
          (r.patientName || '').toLowerCase().includes(patientFilter) ||
          (r.abhaId || '').toLowerCase().includes(patientFilter)
        );
      }
      if (statusFilter) {
        results = results.filter(r => (r.transportStatus || '').toLowerCase() === statusFilter);
      }

      return sendJson(response, 200, { ok: true, data: results });
    }

    if (request.method === 'POST') {
      try {
        const payload = await readJson(request);
        const newRef = {
          id: `ref-${Date.now()}`,
          triageId: payload.triageId || '',
          patientName: payload.patientName || 'Ramesh Patil',
          abhaId: payload.abhaId || '12-3456-7890',
          sourceFacility: payload.sourceFacility || 'Sub-Centre 4',
          targetFacility: payload.targetFacility || 'District Hospital Diagnostic Hub',
          priority: payload.priority || 'URGENT',
          transportStatus: payload.transportStatus || 'in_transit',
          currentStage: Number(payload.currentStage ?? 2),
          stageName: payload.stageName || 'Ambulance 108 In Transit',
          ambulanceNumber: payload.ambulanceNumber || 'MH-12-AMB-108',
          driverName: payload.driverName || 'Santosh Jadhav',
          driverPhone: payload.driverPhone || '+91 98220 10811',
          eta: payload.eta || '14 mins',
          bedReserved: Boolean(payload.bedReserved),
          bedAssigned: payload.bedAssigned || '',
          bedType: payload.bedType || 'General Ward Bed',
          vitalsSummary: payload.vitalsSummary || '',
          regulationSummary: payload.regulationSummary || '',
          notes: payload.notes || 'Emergency clinical referral under ICMR guideline protocol',
          statusNote: payload.statusNote || 'Ambulance dispatched and en route.',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        localReferrals.unshift(newRef);

        // Update corresponding triage case if found
        if (payload.triageId) {
          const matchCase = localTriageCases.find(c => c.id === payload.triageId);
          if (matchCase) {
            matchCase.status = 'referred';
            matchCase.referralId = newRef.id;
          }
        }

        return sendJson(response, 201, { ok: true, data: newRef });
      } catch (err) {
        return sendJson(response, 400, { error: 'Invalid referral payload.' });
      }
    }
  }

  // Update Referral Transit Stage API
  if (pathname === '/api/referrals/update-stage' && request.method === 'POST') {
    try {
      const { referralId, stageIndex, statusNote, transportStatus } = await readJson(request);
      const stageNames = ['Sub-Centre Triage', 'PHC Teleconsult', 'Ambulance 108 In Transit', 'District Hospital Intake'];
      const ref = localReferrals.find(r => r.id === referralId) || localReferrals[0];
      if (!ref) return sendJson(response, 404, { error: 'Referral record not found.' });

      const idx = Number(stageIndex ?? 2);
      ref.currentStage = idx;
      ref.stageName = stageNames[idx] || 'In Transit';
      ref.transportStatus = transportStatus || (idx >= 3 ? 'arrived' : 'in_transit');
      if (statusNote) ref.statusNote = statusNote;
      else if (idx >= 3) ref.statusNote = 'Patient arrived safely at District Hospital Emergency Intake.';
      ref.lastUpdated = new Date().toISOString();

      return sendJson(response, 200, { ok: true, data: ref });
    } catch (err) {
      return sendJson(response, 400, { error: 'Failed to update referral stage: ' + err.message });
    }
  }

  // Hospital Bed Reservation for Incoming Referral API
  if (pathname === '/api/referrals/reserve-bed' && request.method === 'POST') {
    try {
      const { referralId, bedType, bedNumber, hospitalNotes } = await readJson(request);
      const ref = localReferrals.find(r => r.id === referralId) || localReferrals[0];
      if (!ref) return sendJson(response, 404, { error: 'Referral record not found.' });

      ref.bedReserved = true;
      ref.bedType = bedType || (ref.priority === 'CRITICAL' ? 'ICU Oxygen Bed' : 'General Ward Bed');
      ref.bedAssigned = bedNumber || (bedType?.includes('ICU') ? 'ICU Bed #4' : 'Ward Bed #8');
      if (hospitalNotes) ref.statusNote = hospitalNotes;
      ref.lastUpdated = new Date().toISOString();

      // Decrement bed count in inventory if available
      const invBed = localInventory.find(i => bedType?.includes('ICU') ? i.id === 'beds_icu' : i.id === 'beds_general');
      if (invBed && invBed.quantity > 0) {
        invBed.quantity -= 1;
        invBed.status = invBed.quantity <= invBed.threshold ? 'low_stock' : 'available';
      }

      return sendJson(response, 200, {
        ok: true,
        data: ref,
        referral: ref,
        message: `${ref.bedAssigned} reserved for incoming patient ${ref.patientName}.`
      });
    } catch (err) {
      return sendJson(response, 400, { error: 'Failed to reserve facility bed: ' + err.message });
    }
  }

  // Patient Referral Status Retrieval API (Dedicated for Patient Portal)
  if (pathname === '/api/patient/referral' && request.method === 'GET') {
    const patientName = (url.searchParams.get('patientName') || url.searchParams.get('name') || '').toLowerCase();
    const abhaId = (url.searchParams.get('abhaId') || '').toLowerCase();

    // Match patient or fallback to most recent referral (Ramesh Patil)
    let ref = localReferrals.find(r => 
      (patientName && (r.patientName || '').toLowerCase().includes(patientName)) ||
      (abhaId && (r.abhaId || '').toLowerCase().includes(abhaId))
    );
    if (!ref && localReferrals.length > 0) {
      ref = localReferrals[0];
    }

    const linkedTriage = ref && ref.triageId 
      ? localTriageCases.find(t => t.id === ref.triageId)
      : localTriageCases.find(t => t.patientName === (ref?.patientName || 'Ramesh Patil'));

    return sendJson(response, 200, {
      ok: true,
      hasActiveReferral: Boolean(ref && ref.transportStatus !== 'completed'),
      referral: ref || null,
      triageCase: linkedTriage || null
    });
  }

  // Facility Incoming Referrals API (Dedicated for Hospital Dashboard)
  if (pathname === '/api/facility/incoming' && request.method === 'GET') {
    const facilityName = (url.searchParams.get('facilityName') || 'District Hospital').toLowerCase();
    const incoming = localReferrals.filter(r => 
      (r.targetFacility || '').toLowerCase().includes(facilityName) ||
      r.transportStatus === 'in_transit' ||
      r.transportStatus === 'dispatched'
    );
    return sendJson(response, 200, {
      ok: true,
      count: incoming.length,
      incoming
    });
  }

  // Consultations API
  if (pathname === '/api/consultations') {
    if (request.method === 'GET') {
      return sendJson(response, 200, { ok: true, data: localConsultations });
    }
    if (request.method === 'POST') {
      try {
        const payload = await readJson(request);
        const newConsult = {
          id: `cns-${Date.now()}`,
          patientName: payload.patientName || 'Ramesh Patil',
          doctorName: payload.doctorName || 'Dr. Rajesh Kumar',
          tokenNumber: payload.tokenNumber || `Token #${Math.floor(10 + Math.random() * 89)}`,
          scheduledTime: payload.scheduledTime || '2:00 PM Today',
          status: payload.status || 'waiting',
          createdAt: new Date().toISOString()
        };
        localConsultations.unshift(newConsult);
        return sendJson(response, 201, { ok: true, data: newConsult });
      } catch (err) {
        return sendJson(response, 400, { error: 'Invalid consultation request.' });
      }
    }
  }

  // WebRTC Live Video Consultation Signaling Endpoints
  if (pathname === '/api/call/session') {
    if (request.method === 'GET') {
      // Return active session if not expired (stale after 3 minutes)
      if (activeCallSession && Date.now() - (activeCallSession.timestamp || 0) < 180000) {
        return sendJson(response, 200, { ok: true, session: activeCallSession });
      }
      return sendJson(response, 200, { ok: true, session: null });
    }
    if (request.method === 'POST') {
      try {
        const payload = await readJson(request);
        activeCallSession = {
          ...payload,
          timestamp: Date.now()
        };
        // Reset candidates on new call offer
        if (payload.type === 'offer') {
          activeCallCandidates.length = 0;
        } else if (payload.type === 'end') {
          activeCallSession = null;
          activeCallCandidates.length = 0;
        }
        return sendJson(response, 200, { ok: true, session: activeCallSession });
      } catch (err) {
        return sendJson(response, 400, { error: 'Invalid call session payload' });
      }
    }
  }

  if (pathname === '/api/call/candidate') {
    if (request.method === 'POST') {
      try {
        const payload = await readJson(request);
        if (payload.candidate) {
          activeCallCandidates.push({
            id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            ...payload,
            timestamp: Date.now()
          });
          pruneCallCandidates();
        }
        return sendJson(response, 200, { ok: true });
      } catch (err) {
        return sendJson(response, 400, { error: 'Invalid candidate payload' });
      }
    }
  }

  if (pathname === '/api/call/candidates' && request.method === 'GET') {
    const since = Number(url.searchParams.get('since') || 0);
    const role = url.searchParams.get('role') || '';
    pruneCallCandidates();
    const filtered = activeCallCandidates.filter(c => {
      if (c.timestamp < since) return false;
      if (role && c.fromRole === role) return false;
      return true;
    });
    return sendJson(response, 200, { ok: true, candidates: filtered });
  }

  if (pathname === '/api/call/end' && request.method === 'POST') {
    activeCallSession = null;
    activeCallCandidates.length = 0;
    return sendJson(response, 200, { ok: true, ended: true });
  }

  // AI Voice Clinical Parser (Parses natural spoken Hindi / Marathi / English into structured triage fields)
  if (pathname === '/api/ai/parse-voice-dictation' && request.method === 'POST') {
    try {
      const { text, language } = await readJson(request);
      const spokenText = (text || '').trim();
      if (!spokenText) {
        return sendJson(response, 400, { error: 'No spoken text provided.' });
      }

      if (process.env.GEMINI_API_KEY) {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const prompt = `You are a clinical NLP extractor for Indian rural healthcare (National Health Mission).
An ASHA worker dictated the following patient notes in ${language || 'Hindi or English'}:
"${spokenText}"

Extract and standardize into a JSON object:
{
  "patientName": "extracted name or empty string if not mentioned",
  "bloodPressure": "extracted BP format like 150/95 or empty string",
  "pulseRate": "extracted pulse e.g. 98 bpm or empty string",
  "spo2": "extracted oxygen percentage e.g. 94% or empty string",
  "temperature": "extracted temperature e.g. 102°F or empty string",
  "detectedSymptoms": ["array of standardized symptoms like Fever, Cough, Breathlessness, Stomach Pain, Chest Tightness, High BP Spike"],
  "summary": "one clear English translation/summary sentence of the report"
}
Return ONLY valid raw JSON with no markdown wrapping.`;

        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        });

        try {
          const parsed = JSON.parse(aiRes.text.trim());
          return sendJson(response, 200, { ok: true, data: parsed });
        } catch (_) {}
      }

      // Regex / deterministic fallback for rural dictation
      const bpMatch = spokenText.match(/(\d{2,3})\s*(?:by|\/|over)\s*(\d{2,3})/i);
      const pulseMatch = spokenText.match(/(\d{2,3})\s*(?:bpm|pulse|dhadkan|beats)/i);
      const spo2Match = spokenText.match(/(\d{2,3})\s*(?:%|percent|spo2|oxygen)/i);
      const tempMatch = spokenText.match(/(\d{2,3}(?:\.\d)?)\s*(?:degree|f|bukhar|fever)/i);

      const symptoms = [];
      const lower = spokenText.toLowerCase();
      if (lower.includes('fever') || lower.includes('bukhar') || lower.includes('taap')) symptoms.push('Fever (102°F)');
      if (lower.includes('cough') || lower.includes('khansi') || lower.includes('cold')) symptoms.push('Cough & Cold');
      if (lower.includes('breath') || lower.includes('saas') || lower.includes('dum')) symptoms.push('Breathlessness');
      if (lower.includes('chest') || lower.includes('chhati') || lower.includes('pain in chest')) symptoms.push('Chest Tightness');
      if (lower.includes('stomach') || lower.includes('pet') || lower.includes('abdomen')) symptoms.push('Stomach Pain');
      if (lower.includes('bp') || lower.includes('pressure') || lower.includes('chidi')) symptoms.push('High BP Spike');

      return sendJson(response, 200, {
        ok: true,
        data: {
          patientName: '',
          bloodPressure: bpMatch ? `${bpMatch[1]}/${bpMatch[2]}` : '',
          pulseRate: pulseMatch ? `${pulseMatch[1]} bpm` : '',
          spo2: spo2Match ? `${spo2Match[1]}%` : '',
          temperature: tempMatch ? `${tempMatch[1]}°F` : '',
          detectedSymptoms: symptoms.length ? symptoms : ['Fever (102°F)'],
          summary: `Dictated note processed: ${spokenText}`
        }
      });
    } catch (err) {
      return sendJson(response, 500, { error: 'Voice parser error: ' + err.message });
    }
  }

  // Outbreak & Epidemic Surveillance Cluster Data
  if (pathname === '/api/cmo/outbreak-clusters') {
    const clusterData = {
      district: 'Satara District Health Surveillance (IDSP)',
      lastSync: new Date().toISOString(),
      activeThreatLevel: 'WARNING',
      activeClusters: [
        {
          id: 'cls-01',
          name: 'Ward 4 Rampur - Sub-Centre 4',
          disease: 'Dengue & Acute Febrile Illness',
          cases7d: 19,
          growthRate: '+68%',
          riskScore: 'CRITICAL',
          coordinates: { lat: 17.6805, lng: 74.0183 },
          affectedVillages: ['Rampur', 'Khadki', 'Navagaon'],
          recommendedInterventions: [
            'Immediate thermal fogging across Ward 4 perimeter',
            'Dispatch 200 additional NS1 Rapid Antigen test kits to PHC',
            'ASHA door-to-door larval surveillance sweep'
          ]
        },
        {
          id: 'cls-02',
          name: 'Shirwal East - Sub-Centre 2',
          disease: 'Gastroenteritis & Dehydration (Waterborne)',
          cases7d: 14,
          growthRate: '+35%',
          riskScore: 'HIGH',
          coordinates: { lat: 17.712, lng: 74.035 },
          affectedVillages: ['Shirwal Gaon', 'Malwadi'],
          recommendedInterventions: [
            'Superchlorination of community borewell pumps',
            'Emergency distribution of 150 ORS + Zinc packets',
            'Public health boil-water advisory announcement'
          ]
        },
        {
          id: 'cls-03',
          name: 'Wai Valley Sector - Sub-Centre 7',
          disease: 'Seasonal Viral Bronchitis / URTI',
          cases7d: 8,
          growthRate: '+12%',
          riskScore: 'MODERATE',
          coordinates: { lat: 17.653, lng: 73.992 },
          affectedVillages: ['Wai Tola', 'Bhimnagar'],
          recommendedInterventions: [
            'Monitor pediatric respiratory trends via teleconsults',
            'Ensure adequate Amoxicillin suspension buffers'
          ]
        }
      ],
      districtVitals: {
        totalScreenedThisWeek: 428,
        feverCases: 84,
        respiratoryCases: 41,
        waterborneCases: 29,
        rapid108Transfers: 11
      }
    };
    return sendJson(response, 200, { ok: true, data: clusterData });
  }

  // AI Clinical Decision Support (Gemini 3.8 Flash via @google/genai SDK)
  if (pathname === '/api/ai/triage-analyze' && request.method === 'POST') {
    try {
      const { patientName, symptoms, bp, pulse, spo2, temp, language } = await readJson(request);
      const targetLang = language || 'English';

      if (process.env.GEMINI_API_KEY) {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const prompt = `You are a clinical decision support AI assistant supporting frontline ASHA community health workers at a rural primary health sub-centre in India.
Analyze the following patient presentation:
- Patient Name: ${patientName || 'Anonymous Village Resident'}
- Reported Symptoms: ${symptoms || 'General malaise'}
- Blood Pressure: ${bp || 'Not recorded'}
- Pulse: ${pulse || 'Not recorded'}
- SpO2: ${spo2 || 'Not recorded'}
- Body Temperature: ${temp || 'Not recorded'}

Provide a structured, emergency-ready assessment in ${targetLang} language with the following JSON structure:
{
  "triageLevel": "CRITICAL" | "HIGH" | "MODERATE" | "LOW",
  "suspectedConditions": ["string", "string"],
  "emergencyRedFlags": ["string"],
  "immediateFrontlineActions": ["string", "string"],
  "referralRecommendation": "string (e.g. Immediate 108 Ambulance Dispatch to District Hospital or PHC OPD)",
  "ashaGuidanceNotes": "string (clear, actionable, empathetic instruction for the ASHA worker)"
}
Return ONLY valid raw JSON with no markdown backticks.`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        try {
          const parsed = JSON.parse(aiResponse.text.trim());
          return sendJson(response, 200, { ok: true, aiPowered: true, data: parsed });
        } catch (_) {
          return sendJson(response, 200, {
            ok: true,
            aiPowered: true,
            data: {
              triageLevel: "HIGH",
              suspectedConditions: ["Acute Hypertensive Urgency / Respiratory Distress"],
              emergencyRedFlags: ["Elevated BP / Tachycardia"],
              immediateFrontlineActions: ["Keep patient in semi-fowler position", "Administer supplementary oxygen if SpO2 < 94%", "Summon 108 emergency transport"],
              referralRecommendation: "Immediate ambulance transfer to District Hospital Hub",
              ashaGuidanceNotes: "Maintain patient calming protocol and continuous pulse-ox monitoring."
            }
          });
        }
      } else {
        // Deterministic rural clinical guideline fallback (ICMR & MoHFW protocol)
        const spo2Num = parseFloat(spo2) || 98;
        const bpSys = parseFloat((bp || '120/80').split('/')[0]) || 120;
        const isCritical = spo2Num < 90 || bpSys >= 180;
        const isHigh = spo2Num < 94 || bpSys >= 150;

        const triageLevel = isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'MODERATE';
        return sendJson(response, 200, {
          ok: true,
          aiPowered: false,
          data: {
            triageLevel,
            suspectedConditions: isHigh ? ["Acute Respiratory Compromise", "Hypertensive Urgency"] : ["Febrile Illness", "Upper Respiratory Infection"],
            emergencyRedFlags: isHigh ? ["SpO2 below 94%", "Systolic BP above 150 mmHg"] : ["Elevated body temperature"],
            immediateFrontlineActions: [
              "Position patient comfortably in upright semi-fowler posture",
              "Administer ORS fluid if conscious and not vomiting",
              "Continuously re-check vitals every 15 minutes"
            ],
            referralRecommendation: isHigh ? "Escalate via 108 Ambulance to District Hospital Emergency" : "Schedule PHC Teleconsultation token",
            ashaGuidanceNotes: "Clinical assessment based on National Rural Health Mission protocol. Consult Dr. Rajesh Kumar via PHC teleconsult."
          }
        });
      }
    } catch (err) {
      return sendJson(response, 500, { error: 'Clinical analyzer error: ' + err.message });
    }
  }

  return sendJson(response, 404, { error: 'API route not found.' });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname.startsWith('/api/')) return handleApi(request, response, pathname, url);

  const isRootPage = pathname === '/';
  if (isRootPage) {
    let session = getSession(request, url);
    if (!session) {
      const token = crypto.randomBytes(24).toString('hex');
      session = {
        token,
        role: 'asha',
        name: 'Sunita Devi (ASHA)',
        workplace: 'Sub-Centre 4, Ward 4',
        email: 'asha@pulse.in',
        phone: '+91 98765 43210',
        abhaId: '',
        expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
      };
      sessions.set(token, session);
      response.writeHead(302, {
        Location: '/index.html?role=asha',
        'Set-Cookie': `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`,
        'Cache-Control': 'no-store'
      });
      return response.end();
    }
    return redirect(response, '/index.html');
  }
  return serveFile(response, pathname);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Pulse Predictor is running at http://0.0.0.0:${PORT}`);
});
