"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Home, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotFoundPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Navigation */}
      {/* <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12">
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
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
            About
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
      </nav> */}

      {/* 404 Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-none">
                404
              </h1>
            </div>

            {/* Error Message */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  Oops! It looks like you've wandered off the career path. The page you're looking for doesn't exist or
                  has been moved.
                </p>
                <p className="text-gray-400">
                  Don't worry, even the best career journeys have unexpected detours. Let's get you back on track!
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Home className="mr-2 w-5 h-5" />
                  Go Home
                </Button>
              </Link>
              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-white/20 text-white hover:bg-white/10 font-semibold text-lg bg-transparent"
                >
                  Take Career Quiz
                </Button>
              </Link>
            </div>

            {/* Additional Links */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-gray-400 mb-4">Looking for something specific?</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/about" className="text-blue-400 hover:text-blue-300 transition-colors">
                  About Us
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Contact Support
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Dashboard
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/privacy-policy" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed bottom-8 left-8">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  )
}
