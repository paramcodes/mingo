import { calculateNextReview } from "@/shared/calc/review.calc";
import { ReviewRepository } from "./review.repository";

export class ReviewService {
	constructor(private repo: ReviewRepository = new ReviewRepository()) {}

	recordAttempt(
		learnerId: string,
		conceptId: string,
		isCorrect: boolean,
		now = new Date(),
	) {
		const existing = this.repo.findByConcept(learnerId, conceptId);

		const updated = calculateNextReview({
			currentState: existing
				? {
						repetitions: existing.repetitions,
						intervalDays: existing.interval_days,
						easeFactor: existing.ease_factor,
					}
				: undefined,
			isCorrect,
			now,
		});

		this.repo.saveReview({
			id: existing ? existing.id : crypto.randomUUID(),
			learner_id: learnerId,
			concept_id: conceptId,
			repetitions: updated.repetitions,
			interval_days: updated.intervalDays,
			ease_factor: updated.easeFactor,
			last_reviewed_at: updated.lastReviewedAt,
			next_review_at: updated.nextReviewAt,
		});

		return updated;
	}

	getDueReviews(learnerId: string, referenceTime = new Date().toISOString()) {
		return this.repo.getDueReviews(learnerId, referenceTime);
	}

	getAllReviews(learnerId: string) {
		return this.repo.getAllReviews(learnerId);
	}
}
