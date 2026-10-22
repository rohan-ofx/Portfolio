
import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

const transporter =
  gmailUser && gmailAppPassword
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      })
    : null;

const sendContactNotification = async ({
  name,
  email,
  subject,
  message,
}) => {
  if (!transporter) {
    throw new Error(
      "Gmail is not configured. Check GMAIL_USER and GMAIL_APP_PASSWORD in backend .env."
    );
  }

  await transporter.sendMail({
    from: `"Portfolio Contact Form" <${gmailUser}>`,
    to: gmailUser,
    replyTo: email,
    subject: `New Portfolio Message: ${subject || "No subject"}`,
    text: [
      "You received a new message through your portfolio contact form.",
      "",
      `Name: ${name}`,
      `Visitor Email: ${email}`,
      `Subject: ${subject || "No subject"}`,
      "",
      "Message:",
      message,
    ].join("\n"),
  });
};

export default sendContactNotification;
