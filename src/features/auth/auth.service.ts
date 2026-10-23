import { hashPassword, verifyPassword } from "./auth.crypto";
import { AuthRepository } from "./auth.repository";

export interface LearnerProfile {
	id: string;
	email: string;
	displayName: string;
	targetCourse: string;
	dailyGoalMinutes: number;
	createdAt: string;
}

export class AuthService {
	constructor(private repo: AuthRepository = new AuthRepository()) {}

	async signUp(input: {
		email: string;
		password: string;
		displayName?: string;
		targetCourse?: string;
		dailyGoalMinutes?: number;
	}): Promise<{ token: string; profile: LearnerProfile }> {
		const email = input.email.toLowerCase().trim();
		if (!email?.includes("@")) {
			throw new Error("Invalid email address");
		}
		if (!input.password || input.password.length < 6) {
			throw new Error("Password must be at least 6 characters");
		}

		const existing = this.repo.findByEmail(email);
		if (existing) {
			throw new Error("An account with this email already exists");
		}

		const passwordHash = await hashPassword(input.password);
		const id = crypto.randomUUID();
		const now = new Date().toISOString();
		const displayName = input.displayName?.trim() || email.split("@")[0];
		const targetCourse = input.targetCourse || "es-en";
		const dailyGoalMinutes = input.dailyGoalMinutes || 15;

		this.repo.createLearner({
			id,
			email,
			password_hash: passwordHash,
			display_name: displayName,
			target_course: targetCourse,
			daily_goal_minutes: dailyGoalMinutes,
			created_at: now,
		});

		const token = crypto.randomUUID();
		const expiresAt = new Date(
			Date.now() + 30 * 24 * 60 * 60 * 1000,
		).toISOString();
		this.repo.createSession({ token, learner_id: id, expires_at: expiresAt });

		return {
			token,
			profile: {
				id,
				email,
				displayName,
				targetCourse,
				dailyGoalMinutes,
				createdAt: now,
			},
		};
	}

	async signIn(input: {
		email: string;
		password: string;
	}): Promise<{ token: string; profile: LearnerProfile }> {
		const email = input.email.toLowerCase().trim();
		const learner = this.repo.findByEmail(email);
		if (!learner) {
			throw new Error("Invalid email or password");
		}

		const isValid = await verifyPassword(input.password, learner.password_hash);
		if (!isValid) {
			throw new Error("Invalid email or password");
		}

		const token = crypto.randomUUID();
		const expiresAt = new Date(
			Date.now() + 30 * 24 * 60 * 60 * 1000,
		).toISOString();
		this.repo.createSession({
			token,
			learner_id: learner.id,
			expires_at: expiresAt,
		});

		return {
			token,
			profile: {
				id: learner.id,
				email: learner.email,
				displayName: learner.display_name,
				targetCourse: learner.target_course,
				dailyGoalMinutes: learner.daily_goal_minutes,
				createdAt: learner.created_at,
			},
		};
	}

	signOut(token: string): void {
		if (token) {
			this.repo.deleteSession(token);
		}
	}

	getSessionLearner(token: string): LearnerProfile | null {
		if (!token) return null;
		const session = this.repo.findSession(token);
		if (!session) return null;

		return {
			id: session.learner.id,
			email: session.learner.email,
			displayName: session.learner.display_name,
			targetCourse: session.learner.target_course,
			dailyGoalMinutes: session.learner.daily_goal_minutes,
			createdAt: session.learner.created_at,
		};
	}

	updatePreferences(
		learnerId: string,
		targetCourse: string,
		dailyGoalMinutes: number,
	): void {
		this.repo.updatePreferences(learnerId, targetCourse, dailyGoalMinutes);
	}
}
