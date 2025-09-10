// TypeScript types for the enhanced database schema

export interface QuizResult {
  id: string
  user_id: string
  quiz_answers: QuizAnswer[]
  riasec_scores: RIASECScores
  skill_scores: SkillScores
  recommendations: MLRecommendation[]
  completed_at: string
  created_at: string
  updated_at: string
}

export interface QuizAnswer {
  questionIndex: number
  questionText: string
  score: number
}

export interface RIASECScores {
  R: number // Realistic
  I: number // Investigative
  A: number // Artistic
  S: number // Social
  E: number // Enterprising
  C: number // Conventional
}

export interface SkillScores {
  Problem_Solving: number
  Critical_Thinking: number
  Communication: number
  Teamwork: number
  Creativity: number
  Time_Management: number
}

export interface MLRecommendation {
  "Job Title": string
  Description: string
  Similarity: number
  "Top 3 Skills": string[]
  "Minimum Education": string
  Priority: "High" | "Low"
}

export interface CareerRecommendation {
  id: string
  user_id: string
  quiz_result_id: string
  job_title: string
  description: string
  similarity_score: number
  top_skills: string[]
  minimum_education: string | null
  priority: "High" | "Low"
  rank_order: number
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  grade: string | null
  school: string | null
  city: string | null
  state: string | null
  avatar_url: string | null
  bio: string | null
  interests: string[] | null
  career_goals: string | null
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  inquiry_type: string | null
  created_at: string
  status: "new" | "in_progress" | "resolved"
}

export interface UserQuizHistory {
  id: string
  user_id: string
  full_name: string | null
  email: string | null
  completed_at: string
  riasec_scores: RIASECScores
  skill_scores: SkillScores
  recommendation_count: number
  avg_similarity_score: number
  max_similarity_score: number
}

// Database helper functions
export type Database = {
  public: {
    Tables: {
      quiz_results: {
        Row: QuizResult
        Insert: Omit<QuizResult, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<QuizResult, "id" | "created_at">>
      }
      career_recommendations: {
        Row: CareerRecommendation
        Insert: Omit<CareerRecommendation, "id" | "created_at">
        Update: Partial<Omit<CareerRecommendation, "id" | "created_at">>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "created_at" | "updated_at">
        Update: Partial<Omit<Profile, "id" | "created_at">>
      }
      contact_submissions: {
        Row: ContactSubmission
        Insert: Omit<ContactSubmission, "id" | "created_at">
        Update: Partial<Omit<ContactSubmission, "id" | "created_at">>
      }
    }
    Views: {
      user_quiz_history: {
        Row: UserQuizHistory
      }
    }
  }
}
