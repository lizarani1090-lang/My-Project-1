exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'pulse_predictor_session=; Path=/; Max-Age=0; SameSite=Lax'
    },
    body: JSON.stringify({ ok: true })
  };
};
