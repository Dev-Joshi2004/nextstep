"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Brain, Clock, ArrowLeft, RotateCcw } from "lucide-react"

interface QuizAttempt {
    id: string
    created_at: string
    answers: {
        question_index: number
        question_text: string
        answer_score: number
    }[]
}

export default function ReviewQuestionsPage() {
    const [attempts, setAttempts] = useState<QuizAttempt[]>([])
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchQuizHistory = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                if (!user) {
                    router.push("/auth/login")
                    return
                }
                setUser(user)

                // Fetch all quiz results grouped by creation date
                const { data: quizResults, error } = await supabase
                    .from("quiz_results")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })

                if (error) {
                    console.error("Error fetching quiz history:", error)
                    return
                }

                // Group results by date (assuming all questions from one attempt have similar timestamps)
                const groupedAttempts: { [key: string]: any[] } = {}

                quizResults?.forEach((result) => {
                    const dateKey = new Date(result.created_at).toDateString()
                    if (!groupedAttempts[dateKey]) {
                        groupedAttempts[dateKey] = []
                    }
                    groupedAttempts[dateKey].push(result)
                })

                // Convert to attempts array
                const attemptsArray: QuizAttempt[] = Object.entries(groupedAttempts).map(([date, results]) => ({
                    id: date,
                    created_at: results[0].created_at,
                    answers: results
                        .sort((a, b) => a.question_index - b.question_index)
                        .map((r) => ({
                            question_index: r.question_index,
                            question_text: r.question_text,
                            answer_score: r.answer_score,
                        })),
                }))

                setAttempts(attemptsArray)
                if (attemptsArray.length > 0) {
                    setSelectedAttempt(attemptsArray[0])
                }
            } catch (error) {
                console.error("Error:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuizHistory()
    }, [supabase, router])

    const getScoreColor = (score: number): string => {
        if (score <= 2) return "bg-red-500/20 text-red-300 border-red-500/30"
        if (score <= 3) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
        return "bg-green-500/20 text-green-300 border-green-500/30"
    }

    const getScoreLabel = (score: number): string => {
        const labels = ["", "Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
        return labels[score] || ""
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-white text-center">
                    <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <p className="text-xl">Loading your quiz history...</p>
                </div>
            </div>
        )
    }

    if (attempts.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
                <div className="max-w-4xl mx-auto pt-8">
                    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                        <CardContent className="text-center py-12">
                            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h2 className="text-2xl font-bold text-white mb-4">No Quiz History Found</h2>
                            <p className="text-gray-300 mb-6">
                                You haven't taken any quizzes yet. Take your first assessment to get started!
                            </p>
                            <Button
                                onClick={() => router.push("/quiz")}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Take Quiz Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-6xl mx-auto pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Quiz History</h1>
                        <p className="text-gray-300">Review your previous quiz attempts and answers</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard")}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <Button
                            onClick={() => router.push("/quiz")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Retake Quiz
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Attempts Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    Quiz Attempts ({attempts.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {attempts.map((attempt, index) => (
                                    <button
                                        key={attempt.id}
                                        onClick={() => setSelectedAttempt(attempt)}
                                        className={`w-full p-3 rounded-lg text-left transition-all ${selectedAttempt?.id === attempt.id
                                                ? "bg-blue-500/20 border border-blue-500/30"
                                                : "bg-white/5 hover:bg-white/10 border border-white/10"
                                            }`}
                                    >
                                        <div className="text-white font-medium">Attempt #{attempts.length - index}</div>
                                        <div className="text-gray-400 text-sm">{new Date(attempt.created_at).toLocaleDateString()}</div>
                                        <div className="text-gray-400 text-xs">{attempt.answers.length} questions answered</div>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Selected Attempt Details */}
                    <div className="lg:col-span-3">
                        {selectedAttempt && (
                            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        Quiz Attempt - {new Date(selectedAttempt.created_at).toLocaleDateString()}
                                    </CardTitle>
                                    <p className="text-gray-300">
                                        Completed at {new Date(selectedAttempt.created_at).toLocaleTimeString()}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {selectedAttempt.answers.map((answer, index) => (
                                            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-white font-medium text-lg leading-relaxed flex-1 mr-4">
                                                        {index + 1}. {answer.question_text}
                                                    </h3>
                                                    <Badge className={`${getScoreColor(answer.answer_score)} border`}>
                                                        {answer.answer_score}/5
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400 text-sm">
                                                        Your response: {getScoreLabel(answer.answer_score)}
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        {[1, 2, 3, 4, 5].map((score) => (
                                                            <div
                                                                key={score}
                                                                className={`w-3 h-3 rounded-full ${score <= answer.answer_score ? "bg-blue-500" : "bg-white/20"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                                        <h4 className="text-white font-semibold mb-2">Attempt Summary</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-blue-400">{selectedAttempt.answers.length}</div>
                                                <div className="text-gray-400 text-sm">Questions</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-green-400">
                                                    {Math.round(
                                                        (selectedAttempt.answers.reduce((sum, a) => sum + a.answer_score, 0) /
                                                            selectedAttempt.answers.length) *
                                                        20,
                                                    )}
                                                    %
                                                </div>
                                                <div className="text-gray-400 text-sm">Avg Score</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-purple-400">
                                                    {selectedAttempt.answers.filter((a) => a.answer_score >= 4).length}
                                                </div>
                                                <div className="text-gray-400 text-sm">High Scores</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-yellow-400">
                                                    {selectedAttempt.answers.filter((a) => a.answer_score <= 2).length}
                                                </div>
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
