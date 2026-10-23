import { describe, expect, it } from "bun:test";
import { calculateNextReview, isConceptDue } from "./review.calc";

describe("review.calc", () => {
	const fixedNow = new Date("2026-10-23T12:00:00.000Z");

	it("initializes review interval to 1 day on first correct attempt", () => {
		const next = calculateNextReview({
			isCorrect: true,
			now: fixedNow,
		});

		expect(next.repetitions).toBe(1);
		expect(next.intervalDays).toBe(1.0);
		expect(next.nextReviewAt).toBe("2026-10-24T12:00:00.000Z");
	});

	it("expands interval to 3 days on second consecutive correct attempt", () => {
		const next = calculateNextReview({
			currentState: {
				repetitions: 1,
				intervalDays: 1.0,
				easeFactor: 2.5,
			},
			isCorrect: true,
			now: fixedNow,
		});

		expect(next.repetitions).toBe(2);
		expect(next.intervalDays).toBe(3.0);
		expect(next.nextReviewAt).toBe("2026-10-26T12:00:00.000Z");
	});

	it("multiplies interval by ease factor on third consecutive correct attempt", () => {
		const next = calculateNextReview({
			currentState: {
				repetitions: 2,
				intervalDays: 3.0,
				easeFactor: 2.5,
			},
			isCorrect: true,
			now: fixedNow,
		});

		expect(next.repetitions).toBe(3);
		expect(next.intervalDays).toBe(8); // Math.round(3 * 2.5) = 8
		expect(next.nextReviewAt).toBe("2026-10-31T12:00:00.000Z");
	});

	it("resets interval and repetitions on incorrect attempt", () => {
		const next = calculateNextReview({
			currentState: {
				repetitions: 5,
				intervalDays: 20.0,
				easeFactor: 2.5,
			},
			isCorrect: false,
			now: fixedNow,
		});

		expect(next.repetitions).toBe(0);
		expect(next.intervalDays).toBe(1.0);
		expect(next.easeFactor).toBe(2.3);
		expect(next.nextReviewAt).toBe("2026-10-24T12:00:00.000Z");
	});

	it("evaluates whether a concept is due correctly", () => {
		expect(isConceptDue("2026-10-22T12:00:00.000Z", fixedNow)).toBe(true);
		expect(isConceptDue("2026-10-23T12:00:00.000Z", fixedNow)).toBe(true);
		expect(isConceptDue("2026-10-24T12:00:00.000Z", fixedNow)).toBe(false);
	});
});
