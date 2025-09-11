"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, MapPin, Calendar, Users, Award, Zap } from "lucide-react"
import { useState } from "react"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  bio: string
  quote: string
  image: string
  skills: string[]
  experience: string
  location: string
  joinDate: string
  social: {
    linkedin?: string
    github?: string
    email: string
  }
  achievements: string[]
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    role: "Chief Technology Officer",
    department: "Engineering",
    bio: "Leading AI innovation with 12+ years in machine learning and career analytics. PhD in Computer Science from Stanford.",
    quote: "Technology should empower people to discover their true potential.",
    image: "/professional-woman-tech-leader.png",
    skills: ["Machine Learning", "Python", "TensorFlow", "Leadership"],
    experience: "12+ years",
    location: "San Francisco, CA",
    joinDate: "2021",
    social: {
      linkedin: "https://linkedin.com/in/sarahchen",
      github: "https://github.com/sarahchen",
      email: "sarah@nextstep.ai",
    },
    achievements: ["AI Innovation Award 2023", "Published 25+ Research Papers", "TEDx Speaker"],
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Senior ML Engineer",
    department: "Engineering",
    bio: "Specializes in recommendation systems and natural language processing. Former Google AI researcher.",
    quote: "Every algorithm should tell a story that helps someone find their path.",
    image: "/professional-hispanic-man-engineer.jpg",
    skills: ["Deep Learning", "NLP", "Scala", "Data Engineering"],
    experience: "8+ years",
    location: "Austin, TX",
    joinDate: "2022",
    social: {
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      github: "https://github.com/mrodriguez",
      email: "marcus@nextstep.ai",
    },
    achievements: ["Google AI Residency", "Open Source Contributor", "ML Conference Speaker"],
  },
  {
    id: "3",
    name: "Priya Patel",
    role: "Head of Product Design",
    department: "Design",
    bio: "Creates intuitive experiences that make career discovery accessible. Previously at Airbnb and Figma.",
    quote: "Great design makes complex decisions feel simple and empowering.",
    image: "/professional-indian-woman-designer.jpg",
    skills: ["UX Design", "Product Strategy", "User Research", "Prototyping"],
    experience: "10+ years",
    location: "New York, NY",
    joinDate: "2021",
    social: {
      linkedin: "https://linkedin.com/in/priyapatel",
      email: "priya@nextstep.ai",
    },
    achievements: ["Design Excellence Award", "Mentor at ADPList", "Featured in Design+Code"],
  },
  {
    id: "4",
    name: "James Kim",
    role: "Data Scientist",
    department: "Analytics",
    bio: "Transforms career data into actionable insights. PhD in Statistics with expertise in behavioral analytics.",
    quote: "Data tells us where we've been, but insights show us where we can go.",
    image: "/professional-asian-man-data-scientist.jpg",
    skills: ["Statistics", "R", "SQL", "Data Visualization"],
    experience: "6+ years",
    location: "Seattle, WA",
    joinDate: "2022",
    social: {
      linkedin: "https://linkedin.com/in/jameskim",
      github: "https://github.com/jkim",
      email: "james@nextstep.ai",
    },
    achievements: ["Kaggle Grandmaster", "Published in Nature", "Data Science Bootcamp Instructor"],
  },
  {
    id: "5",
    name: "Elena Vasquez",
    role: "Career Counselor & Content Lead",
    department: "Content",
    bio: "Bridges the gap between technology and human guidance. Licensed career counselor with 15+ years experience.",
    quote: "Technology amplifies human wisdom, but never replaces the human touch.",
    image: "/professional-latina-woman-counselor.jpg",
    skills: ["Career Counseling", "Content Strategy", "Psychology", "Communication"],
    experience: "15+ years",
    location: "Denver, CO",
    joinDate: "2021",
    social: {
      linkedin: "https://linkedin.com/in/elenavasquez",
      email: "elena@nextstep.ai",
    },
    achievements: ["Certified Career Counselor", "Author of 2 Books", "1000+ Students Mentored"],
  },
  {
    id: "6",
    name: "Alex Thompson",
    role: "Full Stack Developer",
    department: "Engineering",
    bio: "Builds scalable platforms that connect students with their future. Passionate about clean code and user experience.",
    quote: "Code is poetry that solves real problems for real people.",
    image: "/professional-person-developer-coding.jpg",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    experience: "7+ years",
    location: "Portland, OR",
    joinDate: "2023",
    social: {
      linkedin: "https://linkedin.com/in/alexthompson",
      github: "https://github.com/athompson",
      email: "alex@nextstep.ai",
    },
    achievements: ["Open Source Maintainer", "Tech Meetup Organizer", "Hackathon Winner"],
  },
]

export default function TeamPage() {
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
                <span>50+ Years Combined Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>AI-First Approach</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span>10,000+ Students Helped</span>
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
                        <Button size="sm" variant="secondary" className="rounded-full p-2">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                      {member.social.github && (
                        <Button size="sm" variant="secondary" className="rounded-full p-2">
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" className="rounded-full p-2">
                        <Mail className="w-4 h-4" />
                      </Button>
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
                        Joined {member.joinDate} • {member.experience}
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

                  <div>
                    <p className="text-xs font-medium text-card-foreground mb-2">Recent Achievements</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {member.achievements.slice(0, 2).map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Award className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Start Your Career Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our team is here to guide you every step of the way. Take our AI-powered assessment and discover your ideal
            career path today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full">
              Take Career Assessment
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-transparent">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
