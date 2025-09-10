// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Loader from "@/components/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CustomPieChart } from "@/components/ui/pie-chart"
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

type QuizResult = {
  id: string
  user_id?: string
  quiz_answers?: any
  riasec_scores?: Record<string, number>
  skill_scores?: Record<string, number>
  recommendations?: any[]
  created_at?: string
}

type Profile = {
  id: string
  full_name?: string
  email?: string
  phone?: string
  grade?: string
  school?: string
  city?: string
  state?: string
  avatar_url?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [latestResult, setLatestResult] = useState<QuizResult | null>(null)
  const [quizCount, setQuizCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user)

        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profileData || null)

        // Get latest quiz_results for this user
        const { data: quizRows } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)

        setLatestResult((quizRows && quizRows[0]) || null)

        // Count total quiz attempts
        const { count } = await supabase.from("quiz_results").select("*", { count: "exact", head: true }).eq("user_id", user.id)
        setQuizCount(count || 0)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const calculateProfileScore = () => {
    if (!profile) return 0
    const fields = [profile.full_name, profile.phone, profile.grade, profile.school, profile.city, profile.state]
    const completed = fields.filter((f) => f && (f as string).trim() !== "").length
    return Math.round((completed / fields.length) * 100)
  }

  const getPieChartData = () => {
    if (!latestResult?.riasec_scores) return []
    const s = latestResult.riasec_scores
    return [
      { name: "Realistic", value: s.R ?? 0, color: "#10b981" },
      { name: "Investigative", value: s.I ?? 0, color: "#3b82f6" },
      { name: "Artistic", value: s.A ?? 0, color: "#8b5cf6" },
      { name: "Social", value: s.S ?? 0, color: "#f97316" },
      { name: "Enterprising", value: s.E ?? 0, color: "#eab308" },
      { name: "Conventional", value: s.C ?? 0, color: "#6b7280" },
    ].filter((i) => i.value > 0)
  }

  if (isLoading) {
    return <Loader page="Dashboard" text="Cooking your career snapshot — 2 minut Sabar Rakh Laadle..." />
  }

  const recommendations = Array.isArray(latestResult?.recommendations) ? latestResult!.recommendations : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "Student"}!
          </h1>
          <p className="text-xl text-gray-300">Here's your career journey overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
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

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Career Matches</p>
                  <p className="text-3xl font-bold text-white">{recommendations.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Course Options</p>
                  <p className="text-3xl font-bold text-white">
                    {/* try to count unique "Minimum Education" as courses placeholder */}
                    {[
                      ...new Set(recommendations.map((r: any) => r["Minimum Education"]).filter(Boolean)),
                    ].length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
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

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {latestResult ? (
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
                      className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4`}
                    >
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Latest Results</h3>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                      {new Date(latestResult.created_at || "").toLocaleDateString() || "—"}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Top Career Matches
                      </h4>
                      <div className="space-y-2">
                        {recommendations.slice(0, 3).map((rec: any, index: number) => (
                          <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white font-medium">{rec["Job Title"]}</p>
                            <p className="text-gray-400 text-sm">{rec.Description}</p>
                          </div>
                        ))}
                        {recommendations.length === 0 && <div className="text-gray-400">No recommendations yet.</div>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Courses / Education
                      </h4>
                      <div className="space-y-2">
                        {[
                          ...new Set(recommendations.map((r: any) => r["Minimum Education"]).filter(Boolean)),
                        ].slice(0, 3).map((edu: string, index: number) => (
                          <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white font-medium">{edu}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Link href="/quiz/results">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
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
                  <p className="text-gray-300 mb-6">Discover your career interests and get personalised recommendations.</p>
                  <Link href="/quiz">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Start Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {latestResult && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      Interest Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Realistic", key: "R" },
                      { name: "Investigative", key: "I" },
                      { name: "Artistic", key: "A" },
                      { name: "Social", key: "S" },
                      { name: "Enterprising", key: "E" },
                      { name: "Conventional", key: "C" },
                    ].map((item) => {
                      const score = latestResult.riasec_scores?.[item.key] ?? 0
                      const percent = Math.round(score * 100)
                      return (
                        <div key={item.key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{item.name}</span>
                            <span className="text-gray-300">{percent}%</span>
                          </div>
                          <Progress value={percent} className="h-2 bg-white/10" />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="space-y-8">
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

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/quiz">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white justify-start">
                    <Brain className="w-4 h-4 mr-3" />
                    Take / Retake Assessment
                  </Button>
                </Link>
                <Link href="/quiz/results">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white justify-start">
                    <Star className="w-4 h-4 mr-3" />
                    View Results
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white justify-start">
                    <User className="w-4 h-4 mr-3" />
                    Get Counseling
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestResult ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div>
                        <p className="text-white text-sm">Completed career assessment</p>
                        <p className="text-gray-400 text-xs">{new Date(latestResult.created_at || "").toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div>
                        <p className="text-white text-sm">Received career recommendations</p>
                        <p className="text-gray-400 text-xs">{new Date(latestResult.created_at || "").toLocaleDateString()}</p>
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
