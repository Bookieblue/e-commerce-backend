import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
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
      subject: `${context}Code`,
      text: ` Your OTP is ${otp}. It will expire in 5mins  `,
      html: `<p>Your OTP code is <b>${otp}</b> </p>  `,
    });
  } catch (error) {
    console.error("Error sendin email");
    throw error;
  }
};
