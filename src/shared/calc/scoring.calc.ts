/**
 * Pure calculation functions for answer matching and exercise scoring.
 */

export interface AnswerComparison {
	isCorrect: boolean;
	normalizedInput: string;
	acceptedVariantMatched?: string;
}

/**
 * Normalize an input string by trimming, lowercasing, and normalizing unicode accents.
 */
export function normalizeAnswer(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[.,/#!$%^&*;:{}=\-_`~()?¡¿]/g, "")
		.replace(/\s+/g, " ");
}

/**
 * Check if the learner's answer matches the canonical answer or any accepted variants.
 */
export function checkAnswer(
	userAnswer: string,
	canonicalAnswer: string,
	acceptedVariants: readonly string[] = [],
): AnswerComparison {
	const normalizedUser = normalizeAnswer(userAnswer);
	const normalizedCanonical = normalizeAnswer(canonicalAnswer);

	if (normalizedUser === normalizedCanonical) {
		return {
			isCorrect: true,
			normalizedInput: normalizedUser,
			acceptedVariantMatched: canonicalAnswer,
		};
	}

	for (const variant of acceptedVariants) {
		if (normalizedUser === normalizeAnswer(variant)) {
			return {
				isCorrect: true,
				normalizedInput: normalizedUser,
				acceptedVariantMatched: variant,
			};
		}
	}

	return {
		isCorrect: false,
		normalizedInput: normalizedUser,
	};
}

/**
 * Calculate completion score percentage based on correct answers.
 */
export function calculateAccuracy(
	correctCount: number,
	totalCount: number,
): number {
	if (totalCount <= 0) return 0;
	return Math.round((correctCount / totalCount) * 100);
}
