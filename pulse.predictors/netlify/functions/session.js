exports.handler = async (event) => {
  const cookieHeader = event.headers.cookie || '';
  const cookie = cookieHeader.split(';').map(value => value.trim()).find(value => value.startsWith('pulse_predictor_session='));
  if (!cookie) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Please sign in to continue.' }) };
  }

  try {
    const session = JSON.parse(decodeURIComponent(cookie.slice('pulse_predictor_session='.length)));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ role: session.role, email: session.email })
    };
  } catch (_) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Please sign in to continue.' }) };
  }
};
