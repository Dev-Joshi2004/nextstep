// app/quiz/review/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Loader from "@/components/loader"
import { Brain, Clock, ArrowLeft, RotateCcw } from "lucide-react"

type QuizResultRow = {
    id: string
    user_id?: string
    quiz_answers?: any // stored jsonb
    created_at?: string
}

type ParsedAnswer = {
    score: number
    questionText: string
    questionIndex: number
}

export default function ReviewQuestionsPage() {
    const [attempts, setAttempts] = useState<QuizResultRow[]>([])
    const [selectedAttempt, setSelectedAttempt] = useState<QuizResultRow | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true)
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                if (!user) {
                    router.push("/auth/login")
                    return
                }
                setUser(user)

                const { data: quizResults, error } = await supabase
                    .from("quiz_results")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })

                if (error) {
                    console.error("Error fetching quiz history:", error)
                    setAttempts([])
                    setSelectedAttempt(null)
                    setIsLoading(false)
                    return
                }

                const rows = (quizResults || []) as QuizResultRow[]
                setAttempts(rows)
                setSelectedAttempt(rows[0] || null)
            } catch (err) {
                console.error("Fetch history error:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHistory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading) {
        return <Loader page="History" text="Digging up your past brilliance... ⛏️" />
    }

    if (attempts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
                <div className="max-w-4xl mx-auto pt-8">
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                        <CardContent className="text-center py-12">
                            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h2 className="text-2xl font-bold text-white mb-4">No Quiz History Found</h2>
                            <p className="text-gray-300 mb-6">You haven't taken any quizzes yet. Take your first assessment to get started!</p>
                            <Button onClick={() => router.push("/quiz")} className="bg-gradient-to-r from-blue-600 to-purple-600">
                                Take Quiz Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const parseAnswers = (row: QuizResultRow): ParsedAnswer[] => {
        try {
            // quiz_answers may already be JSON object when coming from Supabase client
            if (!row.quiz_answers) return []
            if (typeof row.quiz_answers === "string") {
                return JSON.parse(row.quiz_answers)
            }
            return row.quiz_answers
        } catch (err) {
            console.warn("Failed to parse answers", err)
            return []
        }
    }

    const selectedParsed = selectedAttempt ? parseAnswers(selectedAttempt) : []

    const getScoreColor = (score: number) => {
        if (score <= 2) return "bg-red-500/20 text-red-300 border-red-500/30"
        if (score <= 3) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
        return "bg-green-500/20 text-green-300 border-green-500/30"
    }

    const getScoreLabel = (score: number) => {
        const labels = ["", "Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        return labels[score] || ""
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-6xl mx-auto pt-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Quiz History</h1>
                        <p className="text-gray-300">Review your previous quiz attempts and answers</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => router.push("/dashboard")} className="bg-white/10 border-white/20 text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                        <Button onClick={() => router.push("/quiz")} className="bg-gradient-to-r from-blue-600 to-purple-600">
                            <RotateCcw className="w-4 h-4 mr-2" /> Retake Quiz
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Clock className="w-5 h-5 mr-2" /> Attempts ({attempts.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {attempts.map((att, idx) => (
                                    <button
                                        key={att.id}
                                        onClick={() => setSelectedAttempt(att)}
                                        className={`w-full p-3 rounded-lg text-left transition-all ${selectedAttempt?.id === att.id ? "bg-blue-500/20 border border-blue-500/30" : "bg-white/5 hover:bg-white/10 border border-white/10"}`}
                                    >
                                        <div className="text-white font-medium">Attempt #{attempts.length - idx}</div>
                                        <div className="text-gray-400 text-sm">{new Date(att.created_at || "").toLocaleDateString()}</div>
                                        <div className="text-gray-400 text-xs">{parseAnswers(att).length} questions</div>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        {selectedAttempt && (
                            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                                <CardHeader>
                                    <CardTitle className="text-white">Quiz Attempt - {new Date(selectedAttempt.created_at || "").toLocaleDateString()}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {selectedParsed.map((answer, i) => (
                                            <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-white font-medium text-lg leading-relaxed flex-1 mr-4">
                                                        {i + 1}. {answer.questionText}
                                                    </h3>
                                                    <Badge className={`${getScoreColor(answer.score)} border`}>{answer.score}/5</Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400 text-sm">Your response: {getScoreLabel(answer.score)}</span>
                                                    <div className="flex space-x-1">
                                                        {[1, 2, 3, 4, 5].map((score) => (
                                                            <div key={score} className={`w-3 h-3 rounded-full ${score <= answer.score ? "bg-blue-500" : "bg-white/20"}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                                        <h4 className="text-white font-semibold mb-2">Attempt Summary</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-blue-400">{selectedParsed.length}</div>
                                                <div className="text-gray-400 text-sm">Questions</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-green-400">
                                                    {Math.round((selectedParsed.reduce((sum, a) => sum + a.score, 0) / (selectedParsed.length || 1)) * 20)}%
                                                </div>
                                                <div className="text-gray-400 text-sm">Avg Score</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-purple-400">{selectedParsed.filter((a) => a.score >= 4).length}</div>
                                                <div className="text-gray-400 text-sm">High Scores</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-yellow-400">{selectedParsed.filter((a) => a.score <= 2).length}</div>
                                                <div className="text-gray-400 text-sm">Low Scores</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
