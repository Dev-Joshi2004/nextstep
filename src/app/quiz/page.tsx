// app/quiz/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Brain, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { questions } from "@/lib/questions"
import Loader from "@/components/loader"

type QuizAnswer = {
  questionIndex: number
  questionText: string
  score: number
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
    }
    checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // If there's a completed quiz stored for this user, redirect to results
    try {
      const stored = localStorage.getItem("quizResults")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.userId === user?.id && parsed?.status === "completed") {
          router.push("/quiz/results")
        }
      }
    } catch (err) {
      // ignore
    }
  }, [user, router])

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score)
    setError(null)
  }

  const handleNext = () => {
    if (selectedScore === null) return
    const newAnswer: QuizAnswer = {
      questionIndex: currentQuestion,
      questionText: questions[currentQuestion],
      score: selectedScore,
    }
    const updated = [...answers, newAnswer]
    setAnswers(updated)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1)
      setSelectedScore(null)
    } else {
      calculateAndSaveResults(updated)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion === 0) return
    setCurrentQuestion((c) => c - 1)
    const updated = answers.slice(0, -1)
    setAnswers(updated)
    const prev = updated[updated.length - 1]
    setSelectedScore(prev ? prev.score : null)
  }

  const calculateAndSaveResults = async (allAnswers: QuizAnswer[]) => {
    setIsLoading(true)
    setLoadingProgress(10)
    setError(null)

    try {
      // store session in case of interruption
      localStorage.setItem("currentQuizSession", JSON.stringify({ answers: allAnswers, startedAt: new Date().toISOString(), userId: user?.id, status: "processing" }))
      setLoadingProgress(30)

      // send to API
      const res = await fetch("/api/ml-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAnswers: allAnswers, userId: user?.id || null }),
      })

      setLoadingProgress(60)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.error || "Failed to get recommendations")
      }

      const result = await res.json()
      setLoadingProgress(90)

      // Save client-side summary for quick UI access
      const completeResults = {
        recommendations: result.recommendations || [],
        riasecScores: result.riasecScores || {},
        skillScores: result.skillScores || {},
        completedAt: new Date().toISOString(),
        userId: user?.id,
        answers: allAnswers,
        status: "completed",
        quizResultId: result.quiz_result_id || null,
      }

      localStorage.setItem("quizResults", JSON.stringify(completeResults))
      localStorage.removeItem("currentQuizSession")
      setLoadingProgress(100)

      // quick delay for UX then navigate
      setTimeout(() => {
        router.push("/quiz/results")
      }, 400)
    } catch (err: any) {
      console.error("Quiz processing error:", err)
      setError(err?.message || "Something went wrong processing your quiz.")
      localStorage.setItem("currentQuizSession", JSON.stringify({ answers: allAnswers, startedAt: new Date().toISOString(), userId: user?.id, status: "failed", error: err?.message }))
    } finally {
      setIsLoading(false)
      setLoadingProgress(0)
    }
  }

  if (!user) {
    return <Loader page="Quiz" text="Checking you are human... (or at least a student) 🕵️" />
  }

  if (isLoading) {
    return <Loader page="Quiz" text={`Cooking up your destiny... ${loadingProgress}%`} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Career Assessment Quiz</h1>
          <p className="text-gray-300 text-lg">Answer honestly to get accurate recommendations</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-gray-300">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">{questions[currentQuestion]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 mb-4">Rate how much this applies to you:</p>
              <div className="flex justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((score) => (
                  <Button
                    key={score}
                    variant={selectedScore === score ? "default" : "outline"}
                    size="lg"
                    className={`w-16 h-16 rounded-full text-xl font-bold ${selectedScore === score ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-white/10 border-white/20 text-white"}`}
                    onClick={() => handleScoreSelect(score)}
                  >
                    {score}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="outline" size="lg" onClick={handlePrevious} disabled={currentQuestion === 0} className="bg-white/10 border-white/20 text-white">
            <ArrowLeft className="w-5 h-5 mr-2" /> Previous
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">{selectedScore ? "Click Next" : "Please select a rating"}</p>
          </div>

          <Button size="lg" onClick={handleNext} disabled={selectedScore === null} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {currentQuestion === questions.length - 1 ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Finish Quiz
              </>
            ) : (
              <>
                Next <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-6 text-center text-red-400">
            <AlertCircle className="inline-block w-5 h-5 mr-2" />
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
