"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Brain, BookOpen, Briefcase, Star, Download, Share2 } from "lucide-react"

interface CareerRecommendation {
  id: string
  realistic_score: number
  investigative_score: number
  artistic_score: number
  social_score: number
  enterprising_score: number
  conventional_score: number
  primary_interest: string
  secondary_interest: string
  recommended_careers: string[]
  recommended_courses: string[]
  created_at: string
}

export default function QuizResultsPage() {
  const [results, setResults] = useState<CareerRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user)

        // Fetch the latest career recommendation
        const { data, error } = await supabase
          .from("career_recommendations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Error fetching results:", error)
          router.push("/quiz")
          return
        }

        setResults(data)
      } catch (error) {
        console.error("Error:", error)
        router.push("/quiz")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [supabase, router])

  const getInterestDescription = (interest: string): string => {
    const descriptions: Record<string, string> = {
      realistic: "You enjoy hands-on work, building things, and practical problem-solving.",
      investigative: "You love analyzing data, conducting research, and solving complex problems.",
      artistic: "You thrive on creativity, innovation, and expressing yourself through various mediums.",
      social: "You're passionate about helping others, working in teams, and making a positive impact.",
      enterprising: "You excel at leadership, business ventures, and taking calculated risks.",
      conventional: "You prefer organized work, attention to detail, and systematic approaches.",
    }
    return descriptions[interest] || ""
  }

  const getInterestColor = (interest: string): string => {
    const colors: Record<string, string> = {
      realistic: "from-green-500 to-teal-500",
      investigative: "from-blue-500 to-cyan-500",
      artistic: "from-purple-500 to-pink-500",
      social: "from-orange-500 to-red-500",
      enterprising: "from-yellow-500 to-orange-500",
      conventional: "from-gray-500 to-slate-500",
    }
    return colors[interest] || "from-blue-500 to-purple-500"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-xl">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Results Found</h2>
            <p className="text-gray-300 mb-6">Please take the quiz first to see your results.</p>
            <Button
              onClick={() => router.push("/quiz")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Take Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalScore = Object.values({
    realistic: results.realistic_score,
    investigative: results.investigative_score,
    artistic: results.artistic_score,
    social: results.social_score,
    enterprising: results.enterprising_score,
    conventional: results.conventional_score,
  }).reduce((sum, score) => sum + score, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Your Career Profile</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Based on your responses, we've identified your career interests and generated personalized recommendations.
          </p>
        </div>

        {/* Primary Interest */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">Your Primary Interest</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${getInterestColor(
                results.primary_interest,
              )} rounded-full mb-6`}
            >
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 capitalize">{results.primary_interest}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {getInterestDescription(results.primary_interest)}
            </p>
          </CardContent>
        </Card>

        {/* Interest Scores */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Your Interest Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { name: "Realistic", score: results.realistic_score, color: "from-green-500 to-teal-500" },
              { name: "Investigative", score: results.investigative_score, color: "from-blue-500 to-cyan-500" },
              { name: "Artistic", score: results.artistic_score, color: "from-purple-500 to-pink-500" },
              { name: "Social", score: results.social_score, color: "from-orange-500 to-red-500" },
              { name: "Enterprising", score: results.enterprising_score, color: "from-yellow-500 to-orange-500" },
              { name: "Conventional", score: results.conventional_score, color: "from-gray-500 to-slate-500" },
            ].map((interest) => (
              <div key={interest.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-lg">{interest.name}</span>
                  <span className="text-gray-300">
                    {interest.score}/20 ({Math.round((interest.score / 20) * 100)}%)
                  </span>
                </div>
                <div className="relative">
                  <Progress value={(interest.score / 20) * 100} className="h-3 bg-white/10" />
                  <div
                    className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${interest.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${(interest.score / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Career Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Briefcase className="w-6 h-6 mr-3" />
                Recommended Careers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommended_careers.map((career, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white">{career}</h3>
                    <p className="text-gray-400 text-sm">
                      High match based on your {results.primary_interest} interests
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-3" />
                Recommended Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommended_courses.map((course, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white">{course}</h3>
                    <p className="text-gray-400 text-sm">Aligns with your career interests and goals</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              View Dashboard
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </Button>
          </div>
          <p className="text-gray-400 text-sm">
            Want to retake the quiz?{" "}
            <button onClick={() => router.push("/quiz")} className="text-blue-400 hover:text-blue-300 underline">
              Click here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
