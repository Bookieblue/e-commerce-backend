import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (email, otp, context = "Your OTP") => {
  try {
    const info = await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${context} Code`,
      text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
      html: `<p>Your OTP code is <b>${otp}</b>.</p><p>It will expire in 5 minutes.</p>`,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
