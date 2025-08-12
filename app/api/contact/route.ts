import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = String(body.name || "").trim()
    const email = String(body.email || "").trim()
    const subject = String(body.subject || "").trim()
    const message = String(body.message || "").trim()

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    }

    const env = (globalThis as any)?.process?.env || {}
    const host = env.SMTP_HOST
    const port = Number(env.SMTP_PORT || 587)
    const user = env.SMTP_USER
    const pass = env.SMTP_PASS
    const toEmail = env.TO_EMAIL || env.CONTACT_TO_EMAIL || env.SMTP_USER
    const fromEmail = env.FROM_EMAIL || env.CONTACT_FROM_EMAIL || env.SMTP_USER

    if (!host || !user || !pass || !toEmail || !fromEmail) {
      return new Response(JSON.stringify({ error: "Email transport is not configured" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      })
    }

    const nodemailer = await import("nodemailer")
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const text = `New message from portfolio contact form\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`

    const info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: subject || `New message from ${name}`,
      text,
      replyTo: email,
    })

    return new Response(JSON.stringify({ ok: true, id: info.messageId || null }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
} 