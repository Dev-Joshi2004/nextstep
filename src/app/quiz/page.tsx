"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Brain, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { questions } from "@/lib/questions"

interface QuizAnswer {
  questionIndex: number
  questionText: string
  score: number
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
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
  }, [supabase.auth, router])

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score)
  }

  const handleNext = () => {
    if (selectedScore === null) return

    const newAnswer: QuizAnswer = {
      questionIndex: currentQuestion,
      questionText: questions[currentQuestion],
      score: selectedScore,
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedScore(null)
    } else {
      // Quiz completed, calculate results
      calculateAndSaveResults(updatedAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      // Remove the last answer
      const updatedAnswers = answers.slice(0, -1)
      setAnswers(updatedAnswers)
      // Set the selected score to the previous answer if it exists
      const prevAnswer = updatedAnswers[currentQuestion - 1]
      setSelectedScore(prevAnswer ? prevAnswer.score : null)
    }
  }

  const calculateAndSaveResults = async (allAnswers: QuizAnswer[]) => {
    setIsLoading(true)

    try {
      // Calculate RIASEC scores
      const riasecScores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0,
      }

      // Map questions to RIASEC categories (4 questions each)
      allAnswers.forEach((answer, index) => {
        if (index < 4) riasecScores.realistic += answer.score
        else if (index < 8) riasecScores.investigative += answer.score
        else if (index < 12) riasecScores.artistic += answer.score
        else if (index < 16) riasecScores.social += answer.score
        else if (index < 20) riasecScores.enterprising += answer.score
        else riasecScores.conventional += answer.score
      })

      // Find primary and secondary interests
      const sortedScores = Object.entries(riasecScores).sort(([, a], [, b]) => b - a)
      const primaryInterest = sortedScores[0][0]
      const secondaryInterest = sortedScores[1][0]

      // Demo career recommendations based on RIASEC scores
      const careerRecommendations = getCareerRecommendations(primaryInterest, secondaryInterest)
      const courseRecommendations = getCourseRecommendations(primaryInterest, secondaryInterest)

      // Save quiz results to database
      for (const answer of allAnswers) {
        await supabase.from("quiz_results").insert({
          user_id: user.id,
          question_index: answer.questionIndex,
          question_text: answer.questionText,
          answer_score: answer.score,
        })
      }

      // Save career recommendations
      await supabase.from("career_recommendations").insert({
        user_id: user.id,
        realistic_score: riasecScores.realistic,
        investigative_score: riasecScores.investigative,
        artistic_score: riasecScores.artistic,
        social_score: riasecScores.social,
        enterprising_score: riasecScores.enterprising,
        conventional_score: riasecScores.conventional,
        primary_interest: primaryInterest,
        secondary_interest: secondaryInterest,
        recommended_careers: careerRecommendations,
        recommended_courses: courseRecommendations,
      })

      // Redirect to results
      router.push("/quiz/results")
    } catch (error) {
      console.error("Error saving quiz results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Demo function for career recommendations
  const getCareerRecommendations = (primary: string, secondary: string): string[] => {
    const careerMap: Record<string, string[]> = {
      realistic: [
        "Mechanical Engineer",
        "Civil Engineer",
        "Architect",
        "Automotive Engineer",
        "Electronics Engineer",
        "Agricultural Engineer",
      ],
      investigative: [
        "Software Engineer",
        "Data Scientist",
        "Research Scientist",
        "Medical Doctor",
        "Biotechnology Engineer",
        "Computer Science Engineer",
      ],
      artistic: [
        "Graphic Designer",
        "Fashion Designer",
        "Interior Designer",
        "Film Director",
        "Creative Writer",
        "Digital Artist",
      ],
      social: [
        "Clinical Psychologist",
        "Social Worker",
        "Teacher",
        "Counselor",
        "Human Resources Manager",
        "Healthcare Administrator",
      ],
      enterprising: [
        "Business Manager",
        "Marketing Manager",
        "Entrepreneur",
        "Sales Manager",
        "Investment Banker",
        "Management Consultant",
      ],
      conventional: [
        "Chartered Accountant",
        "Financial Analyst",
        "Bank Manager",
        "Operations Manager",
        "Quality Analyst",
        "Administrative Officer",
      ],
    }

    const primaryCareers = careerMap[primary] || []
    const secondaryCareers = careerMap[secondary] || []

    // Combine and return unique careers
    return [...new Set([...primaryCareers.slice(0, 4), ...secondaryCareers.slice(0, 2)])]
  }

  // Demo function for course recommendations
  const getCourseRecommendations = (primary: string, secondary: string): string[] => {
    const courseMap: Record<string, string[]> = {
      realistic: ["B.Tech Mechanical", "B.Tech Civil", "B.Arch", "Diploma in Engineering", "B.Tech Automobile"],
      investigative: ["B.Tech Computer Science", "B.Sc Data Science", "MBBS", "B.Tech Biotechnology", "B.Sc Physics"],
      artistic: ["B.Des", "B.F.A", "B.Arch", "Mass Communication", "Fashion Design"],
      social: ["B.A Psychology", "B.Ed", "B.S.W", "B.A Sociology", "BBA Human Resources"],
      enterprising: ["BBA", "B.Com", "CA", "MBA", "B.Tech + MBA"],
      conventional: ["B.Com", "BBA", "CA", "CS", "B.Com (Hons)"],
    }

    const primaryCourses = courseMap[primary] || []
    const secondaryCourses = courseMap[secondary] || []

    return [...new Set([...primaryCourses.slice(0, 3), ...secondaryCourses.slice(0, 2)])]
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8">
          <CardContent className="text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Responses</h2>
            <p className="text-gray-300">
              Our AI is processing your answers to generate personalized recommendations...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Career Assessment Quiz</h1>
          <p className="text-gray-300 text-lg">Answer honestly to get the most accurate career recommendations</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-gray-300">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>

        {/* Question Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8 transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center leading-relaxed">
              {questions[currentQuestion]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating Scale */}
            <div className="text-center mb-6">
              <p className="text-gray-300 mb-4">Rate how much this applies to you:</p>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>

            {/* Score Buttons */}
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4, 5].map((score) => (
                <Button
                  key={score}
                  variant={selectedScore === score ? "default" : "outline"}
                  size="lg"
                  className={`w-16 h-16 rounded-full text-xl font-bold transition-all duration-300 ${
                    selectedScore === score
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105"
                  }`}
                  onClick={() => handleScoreSelect(score)}
                >
                  {score}
                </Button>
              ))}
            </div>

            {/* Scale Labels */}
            <div className="flex justify-between text-xs text-gray-400 px-4">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {selectedScore ? "Click Next to continue" : "Please select a rating"}
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={selectedScore === null}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
          >
            {currentQuestion === questions.length - 1 ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Finish Quiz
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Question Counter */}
        <div className="text-center mt-8">
          <div className="inline-flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index < currentQuestion
                    ? "bg-green-500"
                    : index === currentQuestion
                      ? "bg-blue-500 scale-125"
                      : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
