const crypto = require('node:crypto');

/**
 * Node.js Recipe: Minting Signed Ephemeral Access Links with HMAC-SHA256
 */
function createSecureLink(baseUrl, documentId, secretKey, options = {}) {
  const expiresInSec = options.expiresInSec || 3600;
  const recipientEmail = (options.recipientEmail || '').toLowerCase().trim();
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSec;

  const payload = {
    docId: documentId,
    email: recipientEmail,
    exp: expiresAt,
    nonce: crypto.randomBytes(6).toString('hex')
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payloadB64)
    .digest('base64url');

  const token = `${payloadB64}.${signature}`;
  return `${baseUrl}/view?token=${token}`;
}

function verifySecureToken(token, secretKey) {
  const [payloadB64, sig] = (token || '').split('.');
  if (!payloadB64 || !sig) return { valid: false, error: 'Malformed token' };

  const expectedSig = crypto.createHmac('sha256', secretKey).update(payloadB64).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return { valid: false, error: 'Signature mismatch' };
  }

  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
  const now = Math.floor(Date.now() / 1000);
  if (now > payload.exp) {
    return { valid: false, error: 'Token expired' };
  }

  return { valid: true, payload };
}

if (require.main === module) {
  const secret = 'super-production-secret-signing-key-2026';
  const link = createSecureLink('https://share.acme.com', 'series-a-deck.pdf', secret, {
    recipientEmail: 'investor@sequoia.com',
    expiresInSec: 1800
  });
  console.log('Generated Secure Link:\n', link);
  const token = link.split('token=')[1];
  console.log('Verification Result:\n', verifySecureToken(token, secret));
}

module.exports = { createSecureLink, verifySecureToken };
