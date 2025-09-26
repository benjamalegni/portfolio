import express from "express";
import bodyParser from "body-parser";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS headers (customize PERMITTED_ORIGIN in env if needed)
app.use((req, res, next) => {
  const allowedOrigin = process.env.CORS_ALLOW_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();

});

// accept JSON payloads
app.use(bodyParser.json());

//resend obj
const resend = new Resend(process.env.RESEND_KEY);


const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
const toEmail = process.env.TO_EMAIL || process.env.FROM_EMAIL || "lukabenjaminmalegni@gmail.com";

app.get(["/", "/api/contact"], (_req, res) => {
  res.status(200).type("text/plain").send("Contact API server is running.");
});

app.post(["/api/contact", "/contact"], async (req, res) => {
  if (!process.env.RESEND_KEY) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const { name, email, subject, message } = req.body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  const trimmedSubject = subject?.trim();
  const emailSubject = trimmedSubject ? `Portfolio • ${trimmedSubject}` : "New message from portfolio";
  const sanitizedEmail = String(email).replace(/[\r\n]/g, "").trim();
  const sanitizedMessage = String(message ?? "").trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111">
      <h2>New portfolio message</h2>
      <p><strong>From:</strong> ${name} &lt;${sanitizedEmail}&gt;</p>
      ${trimmedSubject ? `<p><strong>Subject:</strong> ${trimmedSubject}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${sanitizedMessage.replace(/\n/g, "<br/>")}</p>
    </div>
  `;

  try {
    const { id } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: sanitizedEmail || undefined,
      subject: emailSubject,
      html: htmlContent,
    });

    return res.status(200).json({ ok: true, id });

  } catch (error) {

    console.error("Resend contact form error", error);
    const errorMessage = error?.message || "Failed to send message.";
    return res.status(500).json({ error: errorMessage });
  }
});

const port = process.env.PORT || 3001;


app.listen(port, () => {
  console.log(`contact API server running on port ${port}`);
});
