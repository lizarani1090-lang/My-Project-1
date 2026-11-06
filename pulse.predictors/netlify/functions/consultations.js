// Netlify Serverless API: /api/consultations
let memoryConsultations = [
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

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, data: memoryConsultations })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body || '{}');
      const newConsult = {
        id: `cns-${Date.now()}`,
        patientName: payload.patientName || 'Ramesh Patil',
        doctorName: payload.doctorName || 'Dr. Rajesh Kumar',
        tokenNumber: payload.tokenNumber || `Token #${Math.floor(10 + Math.random() * 89)}`,
        scheduledTime: payload.scheduledTime || '2:00 PM Today',
        status: payload.status || 'waiting',
        prescription: payload.prescription || null,
        createdAt: new Date().toISOString()
      };

      memoryConsultations.unshift(newConsult);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ ok: true, data: newConsult })
      };
    } catch (err) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid consultation request.' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed.' }) };
};
