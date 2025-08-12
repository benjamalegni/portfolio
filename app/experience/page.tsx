"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Clock, AlertTriangle, CheckCircle, XCircle, GraduationCap, Award } from "lucide-react"
import { resume } from "@/data/resume"

export default function OperationsPage() {
  const [selectedOperation, setSelectedOperation] = useState(null)

  // Work experience from resume (optional)
  const professionalExperience: Array<{
    title: string
    company: string
    location?: string
    startDate?: string
    endDate?: string
    description?: string
    achievements?: string[]
  }> = Array.isArray((resume as any).workExperience) ? ((resume as any).workExperience as any[]) : []

  // Education from resume
  const education = resume.education.map((e) => ({
    degree: e.degree,
    university: e.university,
    location: e.location,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
  }))

  // Certifications from resume
  const certifications = resume.certifications.map((c) => ({
    name: c.name,
    organization: c.organization,
    date: c.date,
    details: c.details,
  }))

  // Achievements: not present in resume; keep empty
  const achievementsAndRecognitions: Array<{
    title: string
    organization?: string
    date?: string
    description?: string
  }> = []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-white/20 text-white"
      case "planning":
        return "bg-orange-500/20 text-orange-500"
      case "completed":
        return "bg-white/20 text-white"
      case "compromised":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-500"
      case "high":
        return "bg-orange-500/20 text-orange-500"
      case "medium":
        return "bg-neutral-500/20 text-neutral-300"
      case "low":
        return "bg-white/20 text-white"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Target className="w-4 h-4" />
      case "planning":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "compromised":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">PROFESSIONAL EXPERIENCE</h1>
          <p className="text-sm text-neutral-400">Career overview and accomplishments</p>
        </div>
      </div>

      {/* Professional Experience Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-wider">WORK EXPERIENCE</h2>
        <div className="space-y-4">
          {professionalExperience.length === 0 ? (
            <p className="text-neutral-500 text-sm">No work experience provided.</p>
          ) : (
            professionalExperience.map((experience, index) => (
              <Card
                key={index}
                className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-white tracking-wider">{experience.title}</CardTitle>
                  <p className="text-xs text-neutral-400 font-mono">
                    {experience.company}
                    {experience.location ? ` - ${experience.location}` : ""}
                  </p>
                  {(experience.startDate || experience.endDate) && (
                    <p className="text-xs text-neutral-400 font-mono">
                      {experience.startDate || ""} {experience.endDate ? `- ${experience.endDate}` : ""}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {experience.description && (
                    <p className="text-sm text-neutral-300">{experience.description}</p>
                  )}
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-neutral-300 tracking-wider">ACHIEVEMENTS</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {experience.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-neutral-300">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-wider">EDUCATION</h2>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <Card
              key={index}
              className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-white tracking-wider">{edu.degree}</CardTitle>
                    <p className="text-xs text-neutral-400 font-mono">{edu.university}</p>
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-xs text-neutral-400 font-mono">
                        {edu.startDate || ""} {edu.endDate ? `- ${edu.endDate}` : ""}
                      </p>
                    )}
                  </div>
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </CardHeader>
              {edu.description && (
                <CardContent className="space-y-4">
                  <p className="text-sm text-neutral-300">{edu.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-wider">CERTIFICATIONS</h2>
        <div className="space-y-4">
          {certifications.length === 0 ? (
            <p className="text-neutral-500 text-sm">No certifications provided.</p>
          ) : (
            certifications.map((cert, index) => (
              <Card
                key={index}
                className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-white tracking-wider">{cert.name}</CardTitle>
                  <p className="text-xs text-neutral-400 font-mono">{cert.organization}</p>
                  <p className="text-xs text-neutral-400 font-mono">Date: {cert.date}</p>
                </CardHeader>
                {cert.details && (
                  <CardContent>
                    <p className="text-sm text-neutral-300">{cert.details}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Achievements and Recognitions Section 
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-wider">ACHIEVEMENTS & RECOGNITIONS</h2>
        <div className="space-y-4">
          {achievementsAndRecognitions.length === 0 ? (
            <p className="text-neutral-500 text-sm">No achievements provided.</p>
          ) : (
            achievementsAndRecognitions.map((achievement, index) => (
              <Card
                key={index}
                className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-white tracking-wider">{achievement.title}</CardTitle>
                      {achievement.organization && (
                        <p className="text-xs text-neutral-400 font-mono">{achievement.organization}</p>
                      )}
                      {achievement.date && (
                        <p className="text-xs text-neutral-400 font-mono">Date: {achievement.date}</p>
                      )}
                    </div>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </CardHeader>
                {achievement.description && (
                  <CardContent className="space-y-4">
                    <p className="text-sm text-neutral-300">{achievement.description}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
      */}
    </div>
  )
}
