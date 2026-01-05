import crypto from 'crypto';

export default function generateTokenHash(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
