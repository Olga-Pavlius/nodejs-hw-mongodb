import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';

const transport = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: Number(getEnvVar('SMTP_PORT')),
  secure: false,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export async function sendMail(to, subject, html) {
  try {
    const from = getEnvVar('EMAIL_FROM');
    await transport.sendMail({ from, to, subject, html });
    console.log(`Email sent to ${to}`);
  } catch (err) {
     console.error('Error sending email:', err);
    throw createHttpError(500, 'Failed to send email');
  }
}
