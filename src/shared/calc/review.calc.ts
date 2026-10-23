/**
 * Pure calculation functions for Spaced Repetition (SRS) scheduling.
 */

export interface ReviewState {
	repetitions: number;
	intervalDays: number;
	easeFactor: number;
	lastReviewedAt: string;
	nextReviewAt: string;
}

export interface ReviewCalculationInput {
	currentState?: Partial<ReviewState>;
	isCorrect: boolean;
	now?: Date;
}

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculates updated review state after an exercise attempt.
 * Pure function: deterministic, zero external dependencies.
 */
export function calculateNextReview(
	input: ReviewCalculationInput,
): ReviewState {
	const now = input.now ?? new Date();
	const prevReps = input.currentState?.repetitions ?? 0;
	const prevInterval = input.currentState?.intervalDays ?? 0;
	const prevEase = input.currentState?.easeFactor ?? DEFAULT_EASE_FACTOR;

	if (!input.isCorrect) {
		// Reset on error: drop interval back to 1 day, reset streak
		const newEase = Math.max(MIN_EASE_FACTOR, prevEase - 0.2);
		const nextReview = new Date(now.getTime() + 1 * MS_PER_DAY);

		return {
			repetitions: 0,
			intervalDays: 1.0,
			easeFactor: Number(newEase.toFixed(2)),
			lastReviewedAt: now.toISOString(),
			nextReviewAt: nextReview.toISOString(),
		};
	}

	// Correct answer: increment repetitions and expand interval
	let newInterval: number;
	const newReps = prevReps + 1;

	if (newReps === 1) {
		newInterval = 1.0;
	} else if (newReps === 2) {
		newInterval = 3.0;
	} else {
		newInterval = Math.round(prevInterval * prevEase);
	}

	// Minor ease bonus for continuous success
	const newEase = Math.min(2.5, prevEase + 0.05);
	const nextReview = new Date(now.getTime() + newInterval * MS_PER_DAY);

	return {
		repetitions: newReps,
		intervalDays: newInterval,
		easeFactor: Number(newEase.toFixed(2)),
		lastReviewedAt: now.toISOString(),
		nextReviewAt: nextReview.toISOString(),
	};
}

/**
 * Check if a concept is due for review at a given reference time.
 */
export function isConceptDue(
	nextReviewAt: string,
	referenceTime = new Date(),
): boolean {
	const reviewDate = new Date(nextReviewAt);
	return reviewDate.getTime() <= referenceTime.getTime();
}
