// Netlify Serverless API: /api/triage
let memoryTriageCases = [
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
      body: JSON.stringify({ ok: true, data: memoryTriageCases })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body || '{}');
      if (!payload.patientName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Patient name is required.' }) };
      }

      const newCase = {
        id: `trg-${Date.now()}`,
        patientName: payload.patientName,
        abhaId: payload.abhaId || 'ABHA-PENDING',
        symptoms: payload.symptoms || 'General Malaise',
        bloodPressure: payload.bloodPressure || '120/80',
        pulseRate: payload.pulseRate || '78 bpm',
        spo2: payload.spo2 || '98%',
        riskScore: Number(payload.riskScore || 5),
        riskLevel: payload.riskLevel || 'MODERATE',
        status: 'pending',
        ashaName: payload.ashaName || 'Sunita Devi',
        subCentre: payload.subCentre || 'Sub-Centre 4',
        createdAt: new Date().toISOString()
      };

      memoryTriageCases.unshift(newCase);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ ok: true, data: newCase })
      };
    } catch (err) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON payload.' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed.' }) };
};
