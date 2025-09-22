"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe } from "lucide-react"
import { Mail, Phone, Linkedin, ExternalLink, Download } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<null | { ok: boolean; error?: string }>(null)

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const resumeUrl = `${basePath}/resume.pdf`

  async function submit() {
    setSending(true)
    setResult(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { 
        setResult({ ok: false, error: data?.error || "Failed to send" })
      } else {
        setResult({ ok: true })
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      }
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "Failed to send" })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CONTACT & NETWORKING</h1>
          <p className="text-sm text-neutral-400">Get in touch with me</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4 space-y-4">
            <CardTitle className="text-lg font-bold text-white">Contact Information</CardTitle>
            <div className="flex items-center gap-2 text-neutral-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:lukabenjaminmalegni@gmail.com" className="hover:text-white">
                lukabenjaminmalegni@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Phone className="w-4 h-4" />
              <a href="tel:+15551234567" className="hover:text-white">
                +54 2267 469069
              </a>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Globe className="w-4 h-4" />
              <span>Helsinki, Finland</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4 space-y-4">
            <CardTitle className="text-lg font-bold text-white">Connect With Me</CardTitle>
            <div className="flex gap-4">
              <a href="https://ar.linkedin.com/in/lukamalegni/es" className="text-neutral-400 hover:text-white">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4 space-y-4">
            <CardTitle className="text-lg font-bold text-white">Resume</CardTitle>
            <div className="rounded border border-neutral-700 overflow-hidden bg-neutral-800">
              <iframe src={resumeUrl} className="w-full h-64" title="Resume preview" />
            </div>
            <div className="flex gap-2">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" /> View
                </Button>
              </a>
              <a href={resumeUrl} download>
                <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SEND ME A MESSAGE!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your Name"
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Your Email"
                type="email"
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Input
              placeholder="Subject"
              className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Input
              placeholder="Your Message"
              className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <Button
                disabled={sending}
                onClick={async () => {
                  // If statically exported (GitHub Pages), API route won't exist
                  const isStatic = true
                  if (isStatic) {
                    setResult({ ok: false, error: "Contact form is disabled on static deploy (GitHub Pages)." })
                    return
                  }
                  await submit()
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>
              {result && (
                <span className={`text-xs ${result.ok ? "text-green-500" : "text-red-500"}`}>
                  {result.ok ? "Message sent!" : result.error}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
