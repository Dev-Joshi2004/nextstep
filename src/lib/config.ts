// Configuration for the ML career recommendation system

export const config = {
  // ML Backend Configuration
  mlBackend: {
    baseUrl: process.env.NEXT_PUBLIC_ML_BACKEND_URL || "https://nextstepbackend-2arp.onrender.com",
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    redirectUrl: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "",
  },

  // App Configuration
  app: {
    name: "NextStep AI",
    description: "AI-powered career recommendations",
    version: "1.0.0",
    supportEmail: "support@nextstep.ai",
  },

  // Quiz Configuration
  quiz: {
    totalQuestions: 24,
    maxScore: 5,
    minScore: 1,
    timeoutMinutes: 30,
  },

  // API Configuration
  api: {
    timeout: 10000, // 10 seconds
    retryAttempts: 2,
  },
} as const

export type Config = typeof config
