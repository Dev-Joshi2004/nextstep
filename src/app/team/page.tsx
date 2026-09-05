"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, MapPin, Calendar, Users, Award, Zap, Router } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import ContactPage from "../contact/page"
import { useRouter } from "next/navigation"
import QuizPage from "../quiz/page"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  bio: string
  quote: string
  image: string
  skills: string[]
  institution: string
  location: string
  joinDate: string
  social: {
    linkedin?: string
    github?: string
    email: string
  }
  // achievements: string[]
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Mayank Baliyan",
    role: "ML Engineer",
    department: "Engineering",
    bio: "Leading AI innovation in machine learning and career analytics.",
    quote: "Technology should empower people to discover their true potential.",
    image: "/mayank.jpg",
    skills: ["Python", "Numpy", "Pandas", "Machine Learning"],
    institution: "Student at ADGIPS",
    location: "New Delhi",
    joinDate: "2023",
    social: {
      linkedin: "http://linkedin.com/in/mayank-baliyan-6710252a1",
      github: "https://github.com/Mayank-110",
      email: "baliyan.mayank.2@gmail.com",
    },
    // achievements: ["AI Innovation Award 2023", "Published 25+ Research Papers", "TEDx Speaker"],
  },
  {
    id: "2",
    name: "Kanishk Mishra",
    role: "Backend developer",
    department: "Engineering",
    bio: "Transforms backend architectures into efficient, production-ready systems with expertise in Python, databases, and Django.",
    quote: "Every algorithm should tell a story that helps someone find their path.",
    image: "/kanishk.jpg",
    skills: [" Python", "PostgreSQL", "SQLite", "Django"],
    institution: "Student at ADGIPS",
    location: "New Delhi",
    joinDate: "2023",
    social: {
      linkedin: "https://www.linkedin.com/in/kanishk-kumar-83603b194?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/KanishkMishra143",
      email: "kanishk.kumar412@gmail.com",
    },
    // achievements: ["Google AI Residency", "Open Source Contributor", "ML Conference Speaker"],
  },
  {
    id: "3",
    name: "Karan Jha",
    role: "Head of Product Design",
    department: "Design",
    bio: "Creates intuitive experiences that make career discovery accessible.",
    quote: "Great design makes complex decisions feel simple and empowering.",
    image: "/karan.jpg",
    skills: ["UX Design", "Product Strategy", "User Research", "Prototyping","Nextjs","postgresql"],
    institution: "Student at ADGIPS",
    location: "New Delhi",
    joinDate: "2023",
    social: {
      linkedin: "https://www.linkedin.com/in/karanjhaa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app ",
      github:"https://github.com/Karan-jhaa",
      email: "kjha32990@gmail.com",
    },
    // achievements: ["Design Excellence Award", "Mentor at ADPList", "Featured in Design+Code"],
  },
  {
    id: "4",
    name: "Dimple",
    role: "Data Scientist",
    department: "Analytics",
    bio: "Transforms career data into actionable insights.",
    quote: "Data tells us where we've been, but insights show us where we can go.",
    image: "/dimple.jpg",
    skills: ["Python, Pandas, Numpy , Machine,  Learning, Power BI"],
    institution: "Student at ADGIPS",
    location: "New Delhi",
    joinDate: "2023",
    social: {
      linkedin: "https://www.linkedin.com/in/dimple-saxena-2b146a361?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/Dimple043-tech",
      email: "dimplesaxenax@gmail.com",
    },
    // achievements: ["Kaggle Grandmaster", "Published in Nature", "Data Science Bootcamp Instructor"],
  },
  {
    id: "5",
    name: "Mrunmai Tayade",
    role: "Content Lead",
    department: "Content",
    bio: "Bridges the gap between technology and human guidance.",
    quote: "Technology amplifies human wisdom, but never replaces the human touch.",
    image: "/mrunmai.jpg",
    skills: ["Communication", "Content Creation", "Presentation Design", "Documentation", "Team Collaboration"],
    institution: "Student at ADGIPS",
    location: "New Delhi",
    joinDate: "2023",
    social: {
      linkedin: "https://www.linkedin.com/in/mrunmai-tayade-517b61374?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github:"https://github.com/mrunmaitayade",
      email: "tayademrunmai@gmail.com",
    },
    // achievements: ["Certified Career Counselor", "Author of 2 Books", "1000+ Students Mentored"],
  },
  {
    id: "6",
    name: "Dev Joshi",
    role: "Full Stack Developer",
    department: "Engineering",
    bio: "Builds scalable platforms that connect students with their future. Passionate about clean code and user experience.",
    quote: "Code is poetry that solves real problems for real people.",
    image: "/dev.jpg",
    skills: ["React", "Node.js", "TypeScript", "postgresql","figma"],
    institution: "Student at ADGIPs",
    location: "New Delhi",
    joinDate: "2023",
    social: {
      linkedin: "https://www.linkedin.com/in/dev-joshi-069870370?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/Dev-Joshi2004",
      email: "devjoshi981852@gmail.com",
    },
    // achievements: ["Open Source Maintainer", "Tech Meetup Organizer", "Hackathon Winner"],
  },
]

export default function TeamPage() {
  const router= useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All")
  const departments = ["All", "Engineering", "Design", "Analytics", "Content"]

  const filteredMembers =
    selectedDepartment === "All"
      ? teamMembers
      : teamMembers.filter((member) => member.department === selectedDepartment)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden  py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">Meet Our Team</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
              The Minds Behind Your
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse"> Career Journey</span>
            </h1>
            <p className="text-xl text-white/50 mb-8 text-pretty max-w-3xl mx-auto leading-relaxed">
              We're a diverse team of technologists, designers, and career experts united by one mission: helping you
              discover and pursue your ideal career path through the power of AI.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                <span>Innovative Career Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>AI-First Approach</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span>Empowering Students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Filter */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? "default" : "secondary"}
                onClick={() => setSelectedDepartment(dept)}
                className="rounded-full transition-all duration-300"
              >
                {dept}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member, index) => (
              <Card
                key={member.id}
                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-border bg-card overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                   <div className="flex gap-2">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="secondary" className="rounded-full p-2">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="secondary" className="rounded-full p-2">
                          <Github className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                   {member.social.email && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.social.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="secondary" className="rounded-full p-2">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-card-foreground mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-2">{member.role}</p>
                      <Badge variant="secondary" className="text-xs">
                        {member.department}
                      </Badge>
                    </div>
                  </div>

                  <blockquote className="text-sm text-muted-foreground italic mb-4 border-l-2 border-accent pl-3">
                    "{member.quote}"
                  </blockquote>

                  <p className="text-sm text-card-foreground mb-4 leading-relaxed">{member.bio}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{member.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Joined {member.joinDate} • {member.institution}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-card-foreground mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* <div>
                    <p className="text-xs font-medium text-card-foreground mb-2">Recent Achievements</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {member.achievements.slice(0, 2).map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Award className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Career Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our team is here to guide you every step of the way. Take our AI-powered assessment and discover your ideal
            career path today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full" onClick={()=>router.push("/quiz")} >
              Take Career Assessment
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-transparent" onClick={()=>router.push("/contact")}>
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
