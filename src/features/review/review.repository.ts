import { type ConceptReviewRow, getDatabase } from "@/server/db/client";

export class ReviewRepository {
	private db = getDatabase();

	saveReview(row: ConceptReviewRow): void {
		const stmt = this.db.prepare(`
      INSERT INTO concept_reviews (id, learner_id, concept_id, repetitions, interval_days, ease_factor, last_reviewed_at, next_review_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(learner_id, concept_id) DO UPDATE SET
        repetitions = excluded.repetitions,
        interval_days = excluded.interval_days,
        ease_factor = excluded.ease_factor,
        last_reviewed_at = excluded.last_reviewed_at,
        next_review_at = excluded.next_review_at
    `);
		stmt.run(
			row.id,
			row.learner_id,
			row.concept_id,
			row.repetitions,
			row.interval_days,
			row.ease_factor,
			row.last_reviewed_at,
			row.next_review_at,
		);
	}

	findByConcept(learnerId: string, conceptId: string): ConceptReviewRow | null {
		const stmt = this.db.prepare(`
      SELECT * FROM concept_reviews WHERE learner_id = ? AND concept_id = ? LIMIT 1
    `);
		const row = stmt.get(learnerId, conceptId);
		return (row as unknown as ConceptReviewRow) ?? null;
	}

	getDueReviews(
		learnerId: string,
		referenceTime = new Date().toISOString(),
	): ConceptReviewRow[] {
		const stmt = this.db.prepare(`
      SELECT * FROM concept_reviews
      WHERE learner_id = ? AND next_review_at <= ?
      ORDER BY next_review_at ASC, repetitions ASC
    `);
		return stmt.all(learnerId, referenceTime) as unknown as ConceptReviewRow[];
	}

	getAllReviews(learnerId: string): ConceptReviewRow[] {
		const stmt = this.db.prepare(`
      SELECT * FROM concept_reviews WHERE learner_id = ? ORDER BY next_review_at ASC
    `);
		return stmt.all(learnerId) as unknown as ConceptReviewRow[];
	}
}
