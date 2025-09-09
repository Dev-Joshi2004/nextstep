"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CustomPieChart } from "@/components/ui/pie-chart"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  Brain,
  BookOpen,
  Briefcase,
  User,
  Settings,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Clock,
  Star,
  ArrowRight,
  PieChart,
  LogOut,
} from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  grade?: string
  school?: string
  city?: string
  state?: string
  avatar_url?: string
}

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

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [latestResults, setLatestResults] = useState<CareerRecommendation | null>(null)
  const [quizCount, setQuizCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user)

        // Fetch profile
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profileData)

        // Fetch latest career recommendation
        const { data: careerData } = await supabase
          .from("career_recommendations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()
        setLatestResults(careerData)

        // Count total quizzes taken
        const { count } = await supabase
          .from("career_recommendations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
        setQuizCount(count || 0)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase, router])

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const calculateProfileScore = () => {
    if (!profile) return 0
    const fields = [profile.full_name, profile.phone, profile.grade, profile.school, profile.city, profile.state]
    const completedFields = fields.filter((field) => field && field.trim() !== "").length
    return Math.round((completedFields / fields.length) * 100)
  }

  const getPieChartData = () => {
    if (!latestResults) return []

    const interestColors = {
      realistic: "#10b981",
      investigative: "#3b82f6",
      artistic: "#8b5cf6",
      social: "#f97316",
      enterprising: "#eab308",
      conventional: "#6b7280",
    }

    return [
      { name: "Realistic", value: latestResults.realistic_score, color: interestColors.realistic },
      { name: "Investigative", value: latestResults.investigative_score, color: interestColors.investigative },
      { name: "Artistic", value: latestResults.artistic_score, color: interestColors.artistic },
      { name: "Social", value: latestResults.social_score, color: interestColors.social },
      { name: "Enterprising", value: latestResults.enterprising_score, color: interestColors.enterprising },
      { name: "Conventional", value: latestResults.conventional_score, color: interestColors.conventional },
    ].filter((item) => item.value > 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-xl">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      {/* <nav className="border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NextStep</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {profile?.full_name ? getInitials(profile.full_name) : user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/")
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav> */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "Student"}!
          </h1>
          <p className="text-xl text-gray-300">Here's your career journey overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Quizzes Taken</p>
                  <p className="text-3xl font-bold text-white">{quizCount}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Career Matches</p>
                  <p className="text-3xl font-bold text-white">{latestResults?.recommended_careers?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Course Options</p>
                  <p className="text-3xl font-bold text-white">{latestResults?.recommended_courses?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Profile Score</p>
                  <p className="text-3xl font-bold text-white">{calculateProfileScore()}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Profile */}
            {latestResults ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Award className="w-6 h-6 mr-3" />
                    Your Career Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${getInterestColor(
                        latestResults.primary_interest,
                      )} rounded-full mb-4`}
                    >
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white capitalize mb-2">{latestResults.primary_interest}</h3>
                    <Badge
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 capitalize"
                    >
                      Secondary: {latestResults.secondary_interest}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Top Career Matches
                      </h4>
                      <div className="space-y-2">
                        {latestResults.recommended_careers.slice(0, 3).map((career, index) => (
                          <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white font-medium">{career}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Recommended Courses
                      </h4>
                      <div className="space-y-2">
                        {latestResults.recommended_courses.slice(0, 3).map((course, index) => (
                          <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white font-medium">{course}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Link href="/quiz/results">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        View Detailed Results
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="text-center py-12">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-2xl font-bold text-white mb-4">Take Your First Assessment</h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Discover your career interests and get personalized recommendations by taking our comprehensive
                    assessment.
                  </p>
                  <Link href="/quiz">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Start Assessment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Interest Visualization */}
            {latestResults && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center">
                      <PieChart className="w-5 h-5 mr-3" />
                      Interest Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CustomPieChart data={getPieChartData()} height={300} />
                  </CardContent>
                </Card>

                {/* Progress Bars */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      Interest Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Realistic", score: latestResults.realistic_score, color: "from-green-500 to-teal-500" },
                      {
                        name: "Investigative",
                        score: latestResults.investigative_score,
                        color: "from-blue-500 to-cyan-500",
                      },
                      { name: "Artistic", score: latestResults.artistic_score, color: "from-purple-500 to-pink-500" },
                      { name: "Social", score: latestResults.social_score, color: "from-orange-500 to-red-500" },
                      {
                        name: "Enterprising",
                        score: latestResults.enterprising_score,
                        color: "from-yellow-500 to-orange-500",
                      },
                      {
                        name: "Conventional",
                        score: latestResults.conventional_score,
                        color: "from-gray-500 to-slate-500",
                      },
                    ].map((interest) => (
                      <div key={interest.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{interest.name}</span>
                          <span className="text-gray-300">{Math.round((interest.score / 20) * 100)}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={(interest.score / 20) * 100} className="h-2 bg-white/10" />
                          <div
                            className={`absolute top-0 left-0 h-2 bg-gradient-to-r ${interest.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${(interest.score / 20) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                      {profile?.full_name ? getInitials(profile.full_name) : user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-white">{profile?.full_name || "Student"}</h3>
                  <p className="text-gray-400 text-sm">{profile?.email || user?.email}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  {profile?.grade && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Grade:</span>
                      <span className="text-white text-sm">{profile.grade}</span>
                    </div>
                  )}
                  {profile?.school && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">School:</span>
                      <span className="text-white text-sm">{profile.school}</span>
                    </div>
                  )}
                  {profile?.city && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">City:</span>
                      <span className="text-white text-sm">{profile.city}</span>
                    </div>
                  )}
                </div>

                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/quiz">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 justify-start"
                  >
                    <Brain className="w-4 h-4 mr-3" />
                    {latestResults ? "Retake Assessment" : "Take Assessment"}
                  </Button>
                </Link>
                {latestResults && (
                  <Link href="/quiz/results">
                    <Button
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 justify-start"
                    >
                      <Star className="w-4 h-4 mr-3" />
                      View Results
                    </Button>
                  </Link>
                )}
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 justify-start"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Get Counseling
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestResults ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div>
                        <p className="text-white text-sm">Completed career assessment</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(latestResults.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div>
                        <p className="text-white text-sm">Received career recommendations</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(latestResults.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
