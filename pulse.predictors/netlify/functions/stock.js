// Netlify Serverless API: /api/stock
let memoryInventory = [
  { id: 'amoxicillin', name: 'Amoxicillin 500mg', category: 'medicine', quantity: 220, unit: 'strips', threshold: 50, status: 'available' },
  { id: 'ifa', name: 'Iron & Folic Acid (IFA)', category: 'medicine', quantity: 18, unit: 'strips', threshold: 25, status: 'low_stock' },
  { id: 'ors', name: 'Oral Rehydration Salts (ORS)', category: 'medicine', quantity: 0, unit: 'packets', threshold: 40, status: 'out_of_stock' },
  { id: 'oxygen', name: 'Oxygen Cylinders (Type D)', category: 'oxygen', quantity: 8, unit: 'cylinders', threshold: 5, status: 'available' },
  { id: 'beds_general', name: 'General Wards Beds', category: 'bed', quantity: 14, unit: 'vacant', threshold: 4, status: 'available' },
  { id: 'beds_icu', name: 'ICU Oxygen Beds', category: 'bed', quantity: 3, unit: 'vacant', threshold: 2, status: 'low_stock' }
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
      body: JSON.stringify({ ok: true, data: memoryInventory })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body || '{}');
      const { itemId, action, quantity } = payload;

      const item = memoryInventory.find(i => i.id === itemId);
      if (!item) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Inventory item not found.' }) };
      }

      if (action === 'restock') {
        const addQty = Number(quantity) || 100;
        item.quantity += addQty;
        item.status = item.quantity > item.threshold ? 'available' : 'low_stock';
        item.lastRestocked = new Date().toISOString();
        item.recentOrder = `Restock order #PHC-${Math.floor(100 + Math.random() * 900)} fulfilled`;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, data: item })
      };
    } catch (err) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON request.' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed.' }) };
};
