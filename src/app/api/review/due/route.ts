import { NextResponse } from "next/server";
import { STARTER_COURSE } from "@/features/course/starter-course";
import { ReviewService } from "@/features/review/review.service";
import { getServerLearner } from "@/server/auth.helper";

export async function GET() {
	const learner = await getServerLearner();
	if (!learner) {
		return NextResponse.json({ authenticated: false, due: [] });
	}

	const reviewService = new ReviewService();
	const dueReviews = reviewService.getDueReviews(learner.id);

	// Map concept IDs to exercise/concept cards from starter course
	const allExercises = STARTER_COURSE.units
		.flatMap((u) => u.lessons)
		.flatMap((l) => l.exercises);

	const dueExercises = dueReviews.map((r) => {
		const matched =
			allExercises.find((ex) =>
				ex.canonicalAnswer
					.toLowerCase()
					.includes(r.concept_id.replace("concept-", "")),
			) || allExercises[0];

		return {
			conceptId: r.concept_id,
			repetitions: r.repetitions,
			intervalDays: r.interval_days,
			exercise: matched,
		};
	});

	return NextResponse.json({
		authenticated: true,
		dueCount: dueReviews.length,
		due: dueExercises,
	});
}
