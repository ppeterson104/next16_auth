import nodemailer from 'nodemailer';

function env(name: string) {
  const value = process.env[name];

  return value && value.length > 0 ? value : undefined;
}

const transporter = (() => {
  const user = env('EMAIL_SERVER_USER');
  const pass = env('EMAIL_SERVER_PASSWORD');

  if (!user || !pass) {
    console.warn('[mail] Email server credentials are not set.');
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }
  return nodemailer.createTransport({
    host: env('EMAIL_SERVER_HOST') ?? 'smtp.gmail.com',
    port: Number(env('EMAIL_SERVER_PORT') || 587),
    secure: Number(env('EMAIL_SERVER_PORT') || 587) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
})();

export async function sendVerificationMail(to: string, url: string) {
  const from = env('EMAIL_FROM') || 'no-reply@example.com';
  const res = await transporter.sendMail({
    from,
    to,
    subject: 'Verify your email address',
    html: `
      <p>Please click the link below to verify your email address:</p>
      <a href="${url}">Verify Email</a>
    `,
  });

  return res;
}

export async function sendResetMail(to: string, url: string) {
  const from = env('EMAIL_FROM') || 'no-reply@example.com';
  const res = await transporter.sendMail({
    from,
    to,
    subject: 'Reset your password',
    html: `
      <p>Please click the link below to reset your password:</p>
      <a href="${url}">Reset Password</a>
      <p>Note: This link will expire in 30 minutes.</p>
    `,
  });

  return res;
}
