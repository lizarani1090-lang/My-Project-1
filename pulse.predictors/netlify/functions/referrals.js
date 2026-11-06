// Netlify Serverless API: /api/referrals
let memoryReferrals = [
  {
    id: 'ref-1',
    patientName: 'Ramesh Patil',
    sourceFacility: 'PHC Ward 4',
    targetFacility: 'District Hospital Diagnostic Hub',
    priority: 'CRITICAL',
    transportStatus: 'in_transit',
    ambulanceNumber: 'MH-12-AMB-108',
    notes: 'Acute respiratory distress & Stage-2 hypertension.',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
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
      body: JSON.stringify({ ok: true, data: memoryReferrals })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body || '{}');
      if (!payload.patientName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Patient name is required.' }) };
      }

      const newRef = {
        id: `ref-${Date.now()}`,
        patientName: payload.patientName,
        sourceFacility: payload.sourceFacility || 'Sub-Centre 4',
        targetFacility: payload.targetFacility || 'District Hospital Diagnostic Hub',
        priority: payload.priority || 'URGENT',
        transportStatus: payload.transportStatus || 'dispatched',
        ambulanceNumber: payload.ambulanceNumber || 'MH-12-AMB-108',
        notes: payload.notes || 'Emergency clinical referral from Sub-Centre',
        createdAt: new Date().toISOString()
      };

      memoryReferrals.unshift(newRef);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ ok: true, data: newRef })
      };
    } catch (err) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed.' }) };
};
