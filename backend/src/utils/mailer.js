
const resendApiKey = process.env.RESEND_API_KEY;
const gmailUser = process.env.GMAIL_USER;

const sendContactNotification = async ({
  name,
  email,
  subject,
  message,
}) => {
  if (!resendApiKey || !gmailUser) {
    throw new Error("Resend API key or Gmail address is missing.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: [gmailUser],
      reply_to: email,
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
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Resend API error (${response.status}): ${
        result.message || JSON.stringify(result)
      }`
    );
  }

  console.log("Resend email accepted:", result.id);
};

export default sendContactNotification;
