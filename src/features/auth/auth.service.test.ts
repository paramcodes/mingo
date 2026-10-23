import { beforeEach, describe, expect, it } from "bun:test";
import { getDatabase } from "@/server/db/client";
import { AuthService } from "./auth.service";

describe("auth.service", () => {
	let authService: AuthService;

	beforeEach(() => {
		// Clean test database tables
		const db = getDatabase();
		db.exec("DELETE FROM sessions;");
		db.exec("DELETE FROM learners;");
		authService = new AuthService();
	});

	it("signs up a new learner and returns profile with valid session", async () => {
		const result = await authService.signUp({
			email: "learner@example.com",
			password: "password123",
			displayName: "Language Learner",
			targetCourse: "es-en",
			dailyGoalMinutes: 15,
		});

		expect(result.token).toBeDefined();
		expect(result.profile.email).toBe("learner@example.com");
		expect(result.profile.displayName).toBe("Language Learner");
		expect(result.profile.targetCourse).toBe("es-en");
		expect(result.profile.dailyGoalMinutes).toBe(15);

		const sessionLearner = authService.getSessionLearner(result.token);
		expect(sessionLearner).not.toBeNull();
		expect(sessionLearner?.id).toBe(result.profile.id);
	});

	it("prevents duplicate account creation", async () => {
		await authService.signUp({
			email: "unique@example.com",
			password: "password123",
		});

		expect(
			authService.signUp({
				email: "unique@example.com",
				password: "differentpassword",
			}),
		).rejects.toThrow("An account with this email already exists");
	});

	it("authenticates valid credentials and rejects invalid ones", async () => {
		await authService.signUp({
			email: "login@example.com",
			password: "correctpassword",
		});

		const signInResult = await authService.signIn({
			email: "login@example.com",
			password: "correctpassword",
		});
		expect(signInResult.token).toBeDefined();

		expect(
			authService.signIn({
				email: "login@example.com",
				password: "wrongpassword",
			}),
		).rejects.toThrow("Invalid email or password");
	});

	it("invalidates session upon signOut", async () => {
		const { token } = await authService.signUp({
			email: "signout@example.com",
			password: "password123",
		});

		expect(authService.getSessionLearner(token)).not.toBeNull();
		authService.signOut(token);
		expect(authService.getSessionLearner(token)).toBeNull();
	});

	it("updates learner course and daily goal preferences", async () => {
		const { token, profile } = await authService.signUp({
			email: "prefs@example.com",
			password: "password123",
			targetCourse: "es-en",
			dailyGoalMinutes: 10,
		});

		authService.updatePreferences(profile.id, "fr-en", 20);

		const updated = authService.getSessionLearner(token);
		expect(updated?.targetCourse).toBe("fr-en");
		expect(updated?.dailyGoalMinutes).toBe(20);
	});
});
