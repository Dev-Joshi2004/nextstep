"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Brain, Target, Users, Zap, Rocket, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-12 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/10 mb-8">
              <Rocket className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-300"> Innovative Career Guidance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Perfect Career
              </span>
              After 12th
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Stop feeling confused about your future. Our AI-powered career assessment helps Indian students find their
              ideal career path with personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Free Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 border-white/20 text-white hover:bg-white/10 font-semibold text-lg bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* 3D Cards Section */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
            {[
              {
                icon: Target,
                title: "Personalized Assessment",
                description: "24 carefully crafted questions to understand your interests and strengths",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Advanced algorithms analyze your responses for accurate career matching",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: BookOpen,
                title: "Detailed Roadmap",
                description: "Get specific courses, colleges, and career paths tailored for you",
                gradient: "from-green-500 to-teal-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6 lg:p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
            {[
              { number: "24", label: "Assessment Questions" },
              { number: "900+", label: "Career Paths" },
              { number: "AI", label: "Powered Analysis" },
              { number: "Free", label: "Assessment" },
            ].map((stat, index) => (
              <div key={index} className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NextStep?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              We understand the unique challenges faced by Indian students and provide solutions tailored to the Indian
              education system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 px-4">
              {[
                {
                  icon: CheckCircle,
                  title: "India-Specific Guidance",
                  description: "Career paths aligned with Indian education system, entrance exams, and job market",
                },
                {
                  icon: Users,
                  title: "Expert Counselors",
                  description: "Access to certified career counselors who understand Indian student challenges",
                },
                {
                  icon: Zap,
                  title: "Instant Results",
                  description: "Get your personalized career report within minutes of completing the assessment",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative px-4">
              <div className="w-full h-80 sm:h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-lg border border-white/10 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500/0 to-purple-600/0 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    {/* <Brain className="w-6 h-6 text-white" /> */}
                    <Image src="/next-step-logo.png" alt="NextStep Logo" width={50} height={50} className="size-full" priority />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">AI-Powered Assessment</h3>
                  <p className="text-gray-300">Advanced algorithms working for your future</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 sm:p-12 backdrop-blur-lg border border-white/10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Discover Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dream Career?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Be among the first to experience our innovative career assessment platform. Start your journey today with
              our free assessment.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg sm:text-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Your Free Assessment
                <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
