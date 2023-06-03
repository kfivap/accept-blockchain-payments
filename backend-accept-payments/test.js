const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

function encryptSeedPhrase(seedPhrase, password) {
  const key = crypto
    .createHash('sha256')
    .update(password)
    .digest('base64')
    .substr(0, 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(seedPhrase, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const encryptedData = iv.toString('hex') + encrypted;
  return encryptedData;
}

function decryptSeedPhrase(encryptedData, password) {
  const key = crypto
    .createHash('sha256')
    .update(password)
    .digest('base64')
    .substr(0, 32);
  const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
  const encrypted = encryptedData.slice(32);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Example usage
const seedPhrase = 'example seed phrase';
const password = 'password123';

// Encrypt the seed phrase
const encryptedData = encryptSeedPhrase(seedPhrase, password);
console.log('Encrypted:', encryptedData);

// Decrypt the seed phrase
const decryptedSeedPhrase = decryptSeedPhrase(encryptedData, password);
console.log('Decrypted:', decryptedSeedPhrase);
