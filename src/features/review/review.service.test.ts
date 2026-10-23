import { beforeEach, describe, expect, it } from "bun:test";
import { getDatabase } from "@/server/db/client";
import { ReviewService } from "./review.service";

describe("review.service", () => {
	let service: ReviewService;
	const learner1 = "learner-1111-1111";
	const learner2 = "learner-2222-2222";

	beforeEach(() => {
		const db = getDatabase();
		db.exec("DELETE FROM concept_reviews;");
		db.exec("DELETE FROM learners;");

		// Seed learners for foreign key constraints
		db.exec(`
      INSERT INTO learners (id, email, password_hash, display_name, created_at)
      VALUES
        ('${learner1}', 'l1@test.com', 'hash', 'L1', '2026-01-01'),
        ('${learner2}', 'l2@test.com', 'hash', 'L2', '2026-01-01');
    `);

		service = new ReviewService();
	});

	it("schedules next review on correct answer and isolates between learners", () => {
		const baseDate = new Date("2026-10-23T10:00:00.000Z");

		service.recordAttempt(learner1, "concept-hola", true, baseDate);
		service.recordAttempt(learner2, "concept-adios", true, baseDate);

		// Learner 1 should only see concept-hola
		const l1Reviews = service.getAllReviews(learner1);
		expect(l1Reviews.length).toBe(1);
		expect(l1Reviews[0].concept_id).toBe("concept-hola");

		// Learner 2 should only see concept-adios
		const l2Reviews = service.getAllReviews(learner2);
		expect(l2Reviews.length).toBe(1);
		expect(l2Reviews[0].concept_id).toBe("concept-adios");
	});

	it("identifies concepts due for review accurately based on timestamp", () => {
		const pastDate = new Date("2026-10-20T10:00:00.000Z");
		service.recordAttempt(learner1, "concept-due", true, pastDate);

		// Check with current reference date
		const checkDate = new Date("2026-10-23T10:00:00.000Z");
		const due = service.getDueReviews(learner1, checkDate.toISOString());

		expect(due.length).toBe(1);
		expect(due[0].concept_id).toBe("concept-due");
	});
});
