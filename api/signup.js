export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fullname, email, username, password, sec, token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Missing reCAPTCHA token' });
  }

  const params = new URLSearchParams();
  params.append('secret', process.env.RECAPTCHA_SECRET_KEY);
  params.append('response', token);

  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    return res.status(403).json({ message: 'reCAPTCHA verification failed', verifyData });
  }

  return res.status(200).json({
    message: 'Account Created',
    user: { fullname, email, username, sec }
  });
}

