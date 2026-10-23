import { NextResponse } from "next/server";
import { AuthService } from "@/features/auth/auth.service";
import { getServerLearner } from "@/server/auth.helper";

export async function POST(req: Request) {
	const learner = await getServerLearner();
	if (!learner) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await req.json();
		const { targetCourse, dailyGoalMinutes } = body;

		const authService = new AuthService();
		authService.updatePreferences(
			learner.id,
			targetCourse || learner.targetCourse,
			dailyGoalMinutes || learner.dailyGoalMinutes,
		);

		return NextResponse.json({
			success: true,
			targetCourse: targetCourse || learner.targetCourse,
			dailyGoalMinutes: dailyGoalMinutes || learner.dailyGoalMinutes,
		});
	} catch (err: unknown) {
		const message =
			err instanceof Error
				? err.message
				: "Failed to update onboarding settings";
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 400 },
		);
	}
}
