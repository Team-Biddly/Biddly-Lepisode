import { writeFileSync } from 'fs';

describe('CipherModule', () => {
  test('get Ciphers', () => {
    const crypto = require('crypto');

    const ciphers = crypto.getCiphers();

    writeFileSync(
      'ciphers.txt',
      ciphers.map((cipher) => `| "${cipher}"`).join('\n'),
    );
  });

  test('Generate Symmetric Key', () => {
    const crypto = require('crypto');

    const key = crypto.randomBytes(32).toString('hex');

    writeFileSync('symmetric-key.txt', key);
  });

  test('Generate IV', () => {
    const crypto = require('crypto');

    const iv = crypto.randomBytes(16).toString('base64');

    writeFileSync('iv.txt', iv);
  });
});
