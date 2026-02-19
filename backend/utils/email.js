import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your account</h2>
        <p>Thank you for signing up! Please click the button below to verify your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Verify Email</a>
        <p>Or copy and paste this link into your browser:</p>
        <p>${verifyUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
