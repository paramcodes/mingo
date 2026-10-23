import { NextResponse } from "next/server";
import { ReviewService } from "@/features/review/review.service";
import { getServerLearner } from "@/server/auth.helper";

export async function POST(req: Request) {
	const learner = await getServerLearner();
	if (!learner) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await req.json();
		const { conceptId, isCorrect } = body;

		if (!conceptId) {
			return NextResponse.json(
				{ error: "conceptId is required" },
				{ status: 400 },
			);
		}

		const reviewService = new ReviewService();
		const updated = reviewService.recordAttempt(
			learner.id,
			conceptId,
			Boolean(isCorrect),
		);

		return NextResponse.json({ success: true, updated });
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Failed to record review attempt";
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 400 },
		);
	}
}
