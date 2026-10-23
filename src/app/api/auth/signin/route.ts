import { NextResponse } from "next/server";
import { AuthService } from "@/features/auth/auth.service";
import { setSessionCookie } from "@/server/auth.helper";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password } = body;

		const authService = new AuthService();
		const { token, profile } = await authService.signIn({ email, password });

		await setSessionCookie(token);

		return NextResponse.json({ success: true, profile });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Invalid credentials";
		return NextResponse.json(
			{ success: false, error: message },
			{ status: 401 },
		);
	}
}
