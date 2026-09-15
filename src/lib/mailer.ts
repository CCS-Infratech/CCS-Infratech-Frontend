import nodemailer, { type SendMailOptions } from "nodemailer";

const port = Number(process.env.SMTP_PORT) || 587;

/**
 * Shared SMTP transport for the contact / lead / site-visit routes.
 *
 * Works unchanged against Gmail SMTP and Amazon SES SMTP — only the env vars
 * differ. Port 465 is implicit TLS; 587 (and SES's 2587) use STARTTLS, which
 * nodemailer negotiates on its own, so `secure` must be false there.
 */
export const mailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * The From address.
 *
 * With Gmail the SMTP username happens to be the mailbox address, so using
 * SMTP_USER as the sender worked by coincidence. Amazon SES issues an IAM SMTP
 * username (`AKIA…`), which is not an email address at all — sending with it as
 * From is rejected outright. So From gets its own variable, and on SES it must
 * be an identity you have verified.
 */
export const MAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || "";

/** Internal inbox that receives the enquiry itself. */
export const MAIL_TO = process.env.EMAIL_TO;

/**
 * Send a non-critical message (a thank-you or confirmation to the visitor)
 * without letting its failure fail the request.
 *
 * This matters while SES is in the sandbox: sending to an unverified address is
 * rejected, and because the admin notification is sent first, a throw here used
 * to return a 500 for an enquiry that had in fact already been delivered — so
 * the visitor saw an error and submitted again.
 */
export async function sendQuietly(
  options: SendMailOptions,
  label: string,
): Promise<boolean> {
  try {
    await mailTransport.sendMail(options);
    return true;
  } catch (error) {
    console.error(`[mail] ${label} could not be delivered:`, error);
    return false;
  }
}
