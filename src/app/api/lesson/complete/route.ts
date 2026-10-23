import { NextResponse } from "next/server";
import { STARTER_COURSE } from "@/features/course/starter-course";
import { ProgressRepository } from "@/features/lesson/progress.repository";
import { ReviewService } from "@/features/review/review.service";
import { getServerLearner } from "@/server/auth.helper";

export async function POST(req: Request) {
	const learner = await getServerLearner();
	if (!learner) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await req.json();
		const { lessonId, score, accuracy, conceptsLearned } = body;

		if (!lessonId) {
			return NextResponse.json(
				{ error: "Lesson ID is required" },
				{ status: 400 },
			);
		}

		// Save progress
		const progressRepo = new ProgressRepository();
		progressRepo.saveProgress({
			id: crypto.randomUUID(),
			learner_id: learner.id,
			lesson_id: lessonId,
			score: Number(score) || 10,
			accuracy: Number(accuracy) || 100,
			completed_at: new Date().toISOString(),
		});

		// Initialize spaced repetition reviews for concepts in this lesson
		const reviewService = new ReviewService();
		const concepts =
			Array.isArray(conceptsLearned) && conceptsLearned.length > 0
				? conceptsLearned
				: STARTER_COURSE.units
						.flatMap((u) => u.lessons)
						.find((l) => l.id === lessonId)?.concepts || [];

		for (const conceptId of concepts) {
			reviewService.recordAttempt(learner.id, conceptId, true);
		}

		return NextResponse.json({
			success: true,
			lessonId,
			savedScore: score,
			savedAccuracy: accuracy,
		});
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to record lesson completion";
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 400 },
		);
	}
}
