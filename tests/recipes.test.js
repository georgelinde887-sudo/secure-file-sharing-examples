const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSecureLink, verifySecureToken } = require('../nodejs/send-document');

describe('Secure File Sharing Node.js Recipe Tests', () => {
  const secret = 'test-secret-key-node-recipe-32chars!';

  test('creates valid signed link that passes verification', () => {
    const link = createSecureLink('https://vault.acme.com', 'cap-table.pdf', secret, {
      recipientEmail: 'investor@fund.vc',
      expiresInSec: 3600
    });

    assert.ok(link.startsWith('https://vault.acme.com/view?token='));
    const token = link.split('token=')[1];
    const res = verifySecureToken(token, secret);
    assert.equal(res.valid, true);
    assert.equal(res.payload.docId, 'cap-table.pdf');
    assert.equal(res.payload.email, 'investor@fund.vc');
  });

  test('rejects tampered token', () => {
    const link = createSecureLink('https://vault.acme.com', 'doc-1', secret);
    const token = link.split('token=')[1];
    const tampered = token.slice(0, -4) + 'abcd';
    const res = verifySecureToken(tampered, secret);
    assert.equal(res.valid, false);
  });
});
