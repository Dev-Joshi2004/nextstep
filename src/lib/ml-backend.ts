export interface QuizAnswer {
  questionIndex: number
  questionText: string
  score: number
}

export interface MLRecommendationRequest {
  R: number
  I: number
  A: number
  S: number
  E: number
  C: number
  Problem_Solving: number
  Critical_Thinking: number
  Communication: number
  Teamwork: number
  Creativity: number
  Time_Management: number
  top_n: number
}

export interface MLRecommendation {
  "Job Title": string
  Description: string
  Similarity: number
  "Top 3 Skills": string[]
  "Minimum Education": string
  Priority: "High" | "Low"
}

export interface MLResponse {
  recommendations: MLRecommendation[]
}

// Convert quiz answers to RIASEC scores
export function calculateRIASECScores(answers: QuizAnswer[]): {
  R: number
  I: number
  A: number
  S: number
  E: number
  C: number
} {
  // RIASEC mapping based on question groups (4 questions each)
  // Questions 0-3: Realistic (R) - hands-on, practical work
  // Questions 4-7: Investigative (I) - analytical, research-oriented
  // Questions 8-11: Artistic (A) - creative, expressive
  // Questions 12-15: Social (S) - helping, teaching others
  // Questions 16-19: Enterprising (E) - leadership, business
  // Questions 20-23: Conventional (C) - organized, detail-oriented

  const riasecGroups = {
    R: answers.slice(0, 4),
    I: answers.slice(4, 8),
    A: answers.slice(8, 12),
    S: answers.slice(12, 16),
    E: answers.slice(16, 20),
    C: answers.slice(20, 24),
  }

  const riasecScores = {} as any

  for (const [category, categoryAnswers] of Object.entries(riasecGroups)) {
    const totalScore = categoryAnswers.reduce((sum, answer) => sum + answer.score, 0)
    // Normalize to 0-1 scale (4 questions * 5 max score = 20 max, so divide by 20)
    riasecScores[category] = totalScore / 20
  }

  return riasecScores
}

// Convert quiz answers to skill scores
export function calculateSkillScores(answers: QuizAnswer[]): {
  Problem_Solving: number
  Critical_Thinking: number
  Communication: number
  Teamwork: number
  Creativity: number
  Time_Management: number
} {
  // Map quiz answers to skills based on question content
  // This is a simplified mapping - in a real system you'd have more sophisticated logic

  const investigativeScore = answers.slice(4, 8).reduce((sum, a) => sum + a.score, 0) / 20
  const artisticScore = answers.slice(8, 12).reduce((sum, a) => sum + a.score, 0) / 20
  const socialScore = answers.slice(12, 16).reduce((sum, a) => sum + a.score, 0) / 20
  const enterprisingScore = answers.slice(16, 20).reduce((sum, a) => sum + a.score, 0) / 20
  const conventionalScore = answers.slice(20, 24).reduce((sum, a) => sum + a.score, 0) / 20
  const realisticScore = answers.slice(0, 4).reduce((sum, a) => sum + a.score, 0) / 20

  return {
    Problem_Solving: (investigativeScore + realisticScore) / 2,
    Critical_Thinking: investigativeScore,
    Communication: (socialScore + enterprisingScore) / 2,
    Teamwork: socialScore,
    Creativity: artisticScore,
    Time_Management: conventionalScore,
  }
}

// Call ML backend API
export async function getMLRecommendations(riasecScores: any, skillScores: any, topN = 5): Promise<MLResponse> {
  const requestData: MLRecommendationRequest = {
    ...riasecScores,
    ...skillScores,
    top_n: topN,
  }

  console.log("[v0] Calling ML backend with data:", requestData)

  const response = await fetch("https://nextstepbackend-2arp.onrender.com/recommend_jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] ML backend error:", response.status, errorText)
    throw new Error(`ML backend error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  console.log("[v0] ML backend response:", result)
  return result
}
