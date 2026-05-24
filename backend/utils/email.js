const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
    console.warn(`[EMAIL MOCKED] To: ${to} | Subject: ${subject}`);
    return true; // Don't crash if credentials are missing
  }

  try {
    const info = await transporter.sendMail({
      from: `"Youth Connect (Minoor)" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendEmail };
