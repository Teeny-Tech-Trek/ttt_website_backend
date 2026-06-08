const nodemailer = require("nodemailer");

// SMTP config. Canonical env vars are SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/
// SMTP_FROM. The legacy EMAIL_USER/EMAIL_PASS names are kept as a fallback so an
// existing .env keeps working without edits.
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // 465 = implicit SSL; 587 = STARTTLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  if (!to) {
    console.warn("✉️  Email skipped: no recipient");
    return;
  }
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("✉️  Email skipped: SMTP credentials not configured");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Teeny Tech Trek" <${SMTP_FROM}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

module.exports = sendEmail;
