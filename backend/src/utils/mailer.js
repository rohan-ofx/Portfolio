
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
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      })
    : null;

// Verify SMTP connection when backend starts
if (transporter) {
  transporter.verify()
    .then(() => {
      console.log("SMTP connection successful");
    })
    .catch((error) => {
      console.error("SMTP verification failed:", error.message);
    });
} else {
  console.error("Gmail credentials are missing");
}

const sendContactNotification = async ({
  name,
  email,
  subject,
  message,
}) => {
  if (!transporter) {
    throw new Error("Gmail is not configured.");
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
