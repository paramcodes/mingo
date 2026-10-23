import {
	getDatabase,
	type LearnerRow,
	type SessionRow,
} from "@/server/db/client";

export class AuthRepository {
	private db = getDatabase();

	createLearner(learner: LearnerRow): void {
		const stmt = this.db.prepare(`
      INSERT INTO learners (id, email, password_hash, display_name, target_course, daily_goal_minutes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
		stmt.run(
			learner.id,
			learner.email,
			learner.password_hash,
			learner.display_name,
			learner.target_course,
			learner.daily_goal_minutes,
			learner.created_at,
		);
	}

	findByEmail(email: string): LearnerRow | null {
		const stmt = this.db.prepare(`
      SELECT * FROM learners WHERE email = ? LIMIT 1
    `);
		const row = stmt.get(email.toLowerCase().trim());
		return (row as unknown as LearnerRow) ?? null;
	}

	findById(id: string): LearnerRow | null {
		const stmt = this.db.prepare(`
      SELECT * FROM learners WHERE id = ? LIMIT 1
    `);
		const row = stmt.get(id);
		return (row as unknown as LearnerRow) ?? null;
	}

	createSession(session: SessionRow): void {
		const stmt = this.db.prepare(`
      INSERT INTO sessions (token, learner_id, expires_at)
      VALUES (?, ?, ?)
    `);
		stmt.run(session.token, session.learner_id, session.expires_at);
	}

	findSession(token: string): (SessionRow & { learner: LearnerRow }) | null {
		const stmt = this.db.prepare(`
      SELECT s.token, s.learner_id, s.expires_at,
             l.email, l.display_name, l.target_course, l.daily_goal_minutes, l.created_at, l.password_hash
      FROM sessions s
      JOIN learners l ON s.learner_id = l.id
      WHERE s.token = ? AND s.expires_at > ?
      LIMIT 1
    `);

		const row = stmt.get(token, new Date().toISOString()) as unknown as
			| (SessionRow & {
					email: string;
					display_name: string;
					target_course: string;
					daily_goal_minutes: number;
					created_at: string;
					password_hash: string;
			  })
			| undefined;

		if (!row) return null;

		return {
			token: row.token,
			learner_id: row.learner_id,
			expires_at: row.expires_at,
			learner: {
				id: row.learner_id,
				email: row.email,
				display_name: row.display_name,
				target_course: row.target_course,
				daily_goal_minutes: row.daily_goal_minutes,
				created_at: row.created_at,
				password_hash: row.password_hash,
			},
		};
	}

	deleteSession(token: string): void {
		const stmt = this.db.prepare(`
      DELETE FROM sessions WHERE token = ?
    `);
		stmt.run(token);
	}

	updatePreferences(
		id: string,
		targetCourse: string,
		dailyGoalMinutes: number,
	): void {
		const stmt = this.db.prepare(`
      UPDATE learners
      SET target_course = ?, daily_goal_minutes = ?
      WHERE id = ?
    `);
		stmt.run(targetCourse, dailyGoalMinutes, id);
	}
}
