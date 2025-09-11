// app/quiz/results/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import Loader from "@/components/loader"
import { Award, Brain, Zap, BookOpen, Share2, Clock, RefreshCw, Star, ArrowRight, Users } from "lucide-react"
import { useRouter } from "next/navigation"

type MLRecommendation = {
  "Job Title": string
  Description: string
  Similarity: number
  "Top 3 Skills": string[]
  "Minimum Education": string
  Priority: "High" | "Low"
}

type QuizResultRow = {
  id: string
  user_id?: string
  quiz_answers?: any
  riasec_scores?: Record<string, number>
  skill_scores?: Record<string, number>
  recommendations?: MLRecommendation[]
  created_at?: string
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<QuizResultRow | null>(null)
  const [history, setHistory] = useState<QuizResultRow[]>([])
  const [retrying, setRetrying] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: rows, error } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching results:", error)
          setResults(null)
          setHistory([])
          setLoading(false)
          return
        }

        const typedRows = (rows || []) as QuizResultRow[]
        setHistory(typedRows)
        const latest = typedRows.length > 0 ? typedRows[0] : null
        setResults(latest)
        setSelectedId(latest?.id ?? null)
      } catch (err) {
        console.error("Results load error:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSelect = (id: string) => {
    setSelectedId(id)
    const row = history.find((r) => r.id === id) || null
    setResults(row)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) {
    return <Loader page="Results" text="Loading your future career possibilities... 🧙‍♀️" />
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
            <CardContent className="p-8">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
              <p className="text-gray-300 mb-4">Take the assessment to generate your personalized recommendations.</p>
              <Button onClick={() => router.push("/quiz")} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Brain className="w-4 h-4 mr-2" /> Take Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const riasecLabels: Record<string, string> = { R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional" }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 mb-4">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Assessment Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Career Recommendations</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Based on your responses, we've identified {results.recommendations?.length ?? 0} career options.
          </p>

          <div className="mt-4">
            <label className="text-sm text-gray-300 mr-2">View attempt:</label>
            <select
              value={selectedId ?? ""}
              onChange={(e) => onSelect(e.target.value)}
              className="bg-white/5 text-black rounded px-3 py-2"
            >
              {history.map((h) => (
                <option key={h.id} value={h.id}>
                  {new Date(h.created_at || "").toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => router.push("/quiz/review")} variant="outline" className="bg-white/10 border-white/20">
              <Clock className="w-4 h-4 mr-2" /> View Quiz History
            </Button>
            <Button onClick={() => router.push("/quiz")} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <RefreshCw className="w-4 h-4 mr-2" /> Retake Quiz
            </Button>
            <Button onClick={() => navigator.share?.({ title: "My Career Results", text: "Check my career matches!" }).catch(() => navigator.clipboard.writeText(window.location.href))} variant="outline" className="bg-white/10 border-white/20">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {results.recommendations?.map((rec, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{rec["Job Title"]}</h3>
                        <span className="text-xs text-gray-300 px-2 py-1 rounded bg-white/5">{rec.Priority} Priority</span>
                      </div>
                      <p className="text-gray-300 mb-4">{rec.Description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-bold">{Math.round((rec.Similarity ?? 0) * 100)}%</span>
                      </div>
                      <p className="text-xs text-gray-400">Match Score</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Top Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {rec["Top 3 Skills"]?.map((s, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-white/5 rounded border border-white/10 text-white">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Education</p>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">{rec["Minimum Education"]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-400">Last updated {new Date(results.created_at || "").toLocaleString()}</div>
                    <Button size="sm" variant="outline" className="bg-white/10 border-white/20">
                      Learn More <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Your Personality Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(results.riasec_scores || {}).map(([k, v]) => (
                    <div key={k} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{(riasecLabels as any)[k] ?? k}</span>
                        <span className="text-white font-medium">{Math.round((v ?? 0) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((v ?? 0) * 100)} className="h-2 bg-white/10" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => router.push("/quiz/review")} className="bg-gradient-to-r from-green-600 to-blue-600">
                    <Clock className="w-4 h-4 mr-2" /> View Quiz History
                  </Button>
                  <Button onClick={() => router.push("/dashboard")} variant="outline" className="bg-white/10 border-white/20">
                    <Users className="w-4 h-4 mr-2" /> Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
