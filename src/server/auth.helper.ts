import { cookies } from "next/headers";
import { AuthService, type LearnerProfile } from "@/features/auth/auth.service";

const SESSION_COOKIE_NAME = "mingo_session";

export async function getServerLearner(): Promise<LearnerProfile | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	if (!token) return null;

	const authService = new AuthService();
	return authService.getSessionLearner(token);
}

export async function setSessionCookie(token: string): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	});
}

export async function clearSessionCookie(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE_NAME);
}
