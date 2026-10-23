import { getDatabase, type ProgressRow } from "@/server/db/client";

export class ProgressRepository {
	private db = getDatabase();

	saveProgress(row: ProgressRow): void {
		const stmt = this.db.prepare(`
      INSERT INTO progress (id, learner_id, lesson_id, score, accuracy, completed_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(learner_id, lesson_id) DO UPDATE SET
        score = excluded.score,
        accuracy = excluded.accuracy,
        completed_at = excluded.completed_at
    `);
		stmt.run(
			row.id,
			row.learner_id,
			row.lesson_id,
			row.score,
			row.accuracy,
			row.completed_at,
		);
	}

	getCompletedLessonIds(learnerId: string): string[] {
		const stmt = this.db.prepare(`
      SELECT lesson_id FROM progress WHERE learner_id = ? ORDER BY completed_at ASC
    `);
		const rows = stmt.all(learnerId) as unknown as Array<{
			lesson_id: string;
		}>;
		return rows.map((r) => r.lesson_id);
	}

	getProgressByLearner(learnerId: string): ProgressRow[] {
		const stmt = this.db.prepare(`
      SELECT * FROM progress WHERE learner_id = ? ORDER BY completed_at DESC
    `);
		return stmt.all(learnerId) as unknown as ProgressRow[];
	}
}
