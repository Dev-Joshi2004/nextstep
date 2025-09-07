"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Users, Target, Award, ArrowRight, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">CareerPath</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      <div className="px-6 lg:px-12 pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto pt-20 pb-32">
          <div
            className={`text-center transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/10 mb-8">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-300">Empowering Students Since 2024</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              About
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                CareerPath
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to eliminate career confusion for Indian students by providing AI-powered guidance
              tailored to the Indian education system and job market.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transform transition-all duration-1000 delay-200 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Our
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Every year, millions of Indian students complete their 12th grade feeling lost and confused about their
                career choices. We believe every student deserves clarity and confidence in their career decisions.
              </p>
              <div className="space-y-4">
                {[
                  "Provide personalized career guidance based on scientific assessments",
                  "Bridge the gap between student interests and career opportunities",
                  "Offer India-specific recommendations aligned with our education system",
                  "Make career counseling accessible to students across all backgrounds",
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`relative transform transition-all duration-1000 delay-400 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
            >
              <div className="w-full h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-lg border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">10,000+ Students Guided</h3>
                  <p className="text-gray-300">Helping students find their perfect career path</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              How It
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our scientifically-backed approach combines psychology, data science, and deep understanding of the Indian
              job market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take Assessment",
                description:
                  "Complete our comprehensive 24-question assessment based on the RIASEC career interest model.",
                icon: Brain,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "AI Analysis",
                description:
                  "Our advanced algorithms analyze your responses and match them with career profiles and opportunities.",
                icon: Target,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Get Recommendations",
                description:
                  "Receive personalized career paths, course suggestions, and college recommendations tailored for you.",
                icon: Award,
                gradient: "from-green-500 to-teal-500",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className={`bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${600 + index * 200}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-bold text-white/10 mb-4">{step.step}</div>
                  <div
                    className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Our
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're a passionate team of educators, psychologists, and technologists dedicated to transforming career
              guidance in India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Priya Sharma",
                role: "Career Psychologist",
                description: "15+ years in career counseling and student psychology",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                name: "Rahul Gupta",
                role: "AI/ML Engineer",
                description: "Expert in machine learning and educational technology",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                name: "Anita Patel",
                role: "Education Specialist",
                description: "Former principal with deep knowledge of Indian education system",
                gradient: "from-green-500 to-teal-500",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className={`bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${800 + index * 200}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-12 backdrop-blur-lg border border-white/10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Career Journey?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of students who have discovered their perfect career path with our AI-powered assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-16 px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Free Assessment
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-12 border-white/20 text-white hover:bg-white/10 font-bold text-xl bg-transparent"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
