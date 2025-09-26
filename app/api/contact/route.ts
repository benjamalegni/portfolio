import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_KEY)
const fallbackFromEmail = process.env.FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>"
const toEmail = process.env.TO_EMAIL || process.env.FROM_EMAIL || "lukabenjaminmalegni@gmail.com"

export async function POST(request: Request) {
  if (!process.env.RESEND_KEY) {
    return Response.json({ error: "Email service is not configured." }, { status: 500 })
  }

  let payload: { name?: string; email?: string; subject?: string; message?: string }
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  const name = payload.name?.trim()
  const email = payload.email?.trim()
  const subject = payload.subject?.trim()
  const message = payload.message?.trim()

  if (!name || !email || !message) {
    return Response.json({ error: "Name, email and message are required." }, { status: 400 })
  }

  const emailSubject = subject ? `Portfolio • ${subject}` : "New message from portfolio"
  const sanitizedEmail = email.replace(/[\r\n]/g, "").trim()
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111">
      <h2>New portfolio message</h2>
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    </div>
  `

  try {
    const  id  = await resend.emails.send({
      from: fallbackFromEmail,
      to: [toEmail],
      replyTo: sanitizedEmail || undefined,
      subject: emailSubject,
      html: htmlContent,
    })

    return Response.json({ ok: true, id })
  } catch (error: any) {
    console.error("Resend contact form error", error)
    const message = error?.message || "Failed to send message."
    return Response.json({ error: message }, { status: 500 })
  }
}

export const runtime = "nodejs"
