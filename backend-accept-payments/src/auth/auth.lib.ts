import * as crypto from 'crypto';
const algorithm = 'aes-256-cbc';

export function encryptSeedPhrase(seedPhrase, password): string {
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

export function decryptSeedPhrase(encryptedData, password): string | null {
  try {
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
  } catch (e) {
    console.log(e);
    return null;
  }
}
