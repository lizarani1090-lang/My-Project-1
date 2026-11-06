const TRIAL_ACCOUNT = {
  email: process.env.ADMIN_USER_ID || 'admin@dksingh@rec',
  password: process.env.ADMIN_PASSWORD || 'dksingh@rec'
};

const ROLE_ACCOUNTS = {
  asha: { role: 'asha', name: 'Sunita Devi (ASHA)', workplace: 'Sub-Centre 4, Ward 4', email: 'asha@pulse.in', aliases: ['asha@pulse.in', 'asha', 'asha@dksingh@rec'], password: 'asha@123' },
  doctor: { role: 'doctor', name: 'Dr. Rajesh Kumar', workplace: 'PHC Ward 4 Clinic', email: 'doctor@pulse.in', aliases: ['doctor@pulse.in', 'doctor', 'doctor@dksingh@rec'], password: 'doctor@123' },
  facility: { role: 'facility', name: 'Rampur PHC Admin', workplace: 'Rural Hospital Logistics', email: 'facility@pulse.in', aliases: ['facility@pulse.in', 'facility', 'facility@dksingh@rec'], password: 'facility@123' },
  patient: { role: 'patient', name: 'Damodar Kumar Singh', workplace: 'ABHA: 91-8507-4746-3815', email: 'damodarkumarsingh8507@gmail.com', abhaId: '91-8507-4746-3815', aliases: ['damodarkumarsingh8507@gmail.com', 'damodar', 'dksingh', 'patient@pulse.in', 'patient', 'patient@dksingh@rec'], password: 'patient@123' }
};

const ROLES = new Set(['asha', 'doctor', 'facility', 'patient']);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }

  try {
    const { email, password, role } = JSON.parse(event.body || '{}');
    if (!ROLES.has(role)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Choose a valid role portal.' }) };
    }

    const normEmail = (email || '').trim().toLowerCase();
    const normPass = (password || '').trim();

    let authenticated = false;
    let userMeta = {};

    if (normEmail === TRIAL_ACCOUNT.email.toLowerCase() && normPass === TRIAL_ACCOUNT.password) {
      authenticated = true;
      const acc = ROLE_ACCOUNTS[role] || {};
      userMeta = { role, email: normEmail, name: acc.name || 'Admin', workplace: acc.workplace || 'District Office' };
    } else {
      const acc = ROLE_ACCOUNTS[role];
      if (acc && acc.aliases.some(a => a.toLowerCase() === normEmail) && normPass === acc.password) {
        authenticated = true;
        userMeta = { role: acc.role, email: acc.email, name: acc.name, workplace: acc.workplace };
      }
    }

    if (!authenticated) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials. Please verify your ID and password or contact your health administrator.' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Set-Cookie': `pulse_predictor_session=${encodeURIComponent(JSON.stringify(userMeta))}; Path=/; Max-Age=28800; SameSite=Lax`
      },
      body: JSON.stringify(userMeta)
    };
  } catch (_) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Please provide valid sign-in details.' }) };
  }
};
