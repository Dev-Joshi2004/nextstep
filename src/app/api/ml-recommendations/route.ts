import { type NextRequest, NextResponse } from "next/server";
import {
  calculateRIASECScores,
  calculateSkillScores,
  getMLRecommendations,
  type QuizAnswer,
} from "@/lib/ml-backend";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizAnswers } = body as { quizAnswers: QuizAnswer[] };

    console.log("[v0] Processing quiz answers:", quizAnswers.length);

    // Validate input
    if (
      !quizAnswers ||
      !Array.isArray(quizAnswers) ||
      quizAnswers.length !== 24
    ) {
      return NextResponse.json(
        { error: "Invalid quiz answers. Expected 24 answers." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log(
        "[v0] No authenticated user, proceeding without database save"
      );
    }

    // Calculate RIASEC and skill scores
    const riasecScores = calculateRIASECScores(quizAnswers);
    const skillScores = calculateSkillScores(quizAnswers);

    console.log("[v0] Calculated RIASEC scores:", riasecScores);
    console.log("[v0] Calculated skill scores:", skillScores);

    // Get ML recommendations
    const mlResponse = await getMLRecommendations(riasecScores, skillScores, 8);

    if (user) {
      try {
        // Save main quiz result
        const { data: quizResult, error: quizError } = await supabase
          .from("quiz_results")
          .insert({
            user_id: user.id,
            quiz_answers: quizAnswers,
            riasec_scores: riasecScores,
            skill_scores: skillScores,
            recommendations: mlResponse.recommendations,
            completed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (quizError) {
          console.error("[v0] Error saving quiz result:", quizError);
        } else {
          console.log("[v0] Quiz result saved successfully:", quizResult.id);

          // Save individual career recommendations
          if (
            mlResponse.recommendations &&
            mlResponse.recommendations.length > 0
          ) {
            const recommendationsToInsert = mlResponse.recommendations.map(
              (rec: any, index: number) => ({
                user_id: user.id,
                quiz_result_id: quizResult.id,
                job_title: rec.job_title || rec.title || "Unknown",
                description: rec.description || "No description available",
                similarity_score: rec.similarity_score || rec.score || 0,
                top_skills: rec.top_skills || rec.skills || [],
                minimum_education:
                  rec.minimum_education || rec.education || "Not specified",
                priority: rec.priority || (index < 3 ? "High" : "Low"),
                rank_order: index + 1,
              })
            );

            const { error: recError } = await supabase
              .from("career_recommendations")
              .insert(recommendationsToInsert);

            if (recError) {
              console.error(
                "[v0] Error saving career recommendations:",
                recError
              );
            } else {
              console.log("[v0] Career recommendations saved successfully");
              // Optionally, you can return the saved recommendations
              return NextResponse.json({
                success: true,
                riasecScores,
                skillScores,
                recommendations: mlResponse.recommendations,
              });
            }
          }
        }
      } catch (dbError) {
        console.error("[v0] Database operation failed:", dbError);
        // Continue execution even if database save fails
      }
    }

    // Return recommendations
    return NextResponse.json({
      success: true,
      riasecScores,
      skillScores,
      recommendations: mlResponse.recommendations,
    });
  } catch (error) {
    console.error("[v0] Error in ML recommendations API:", error);

    // Return detailed error for debugging
    return NextResponse.json(
      {
        error: "Failed to get ML recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
