import { NextResponse } from "next/server";
import { getServerLearner } from "@/server/auth.helper";

export async function GET() {
	const learner = await getServerLearner();
	if (!learner) {
		return NextResponse.json({ authenticated: false }, { status: 401 });
	}
	return NextResponse.json({ authenticated: true, learner });
}
