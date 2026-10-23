/**
 * Pure calculation functions for learner streaks and daily goals.
 */

export interface StreakResult {
	currentStreak: number;
	longestStreak: number;
	isActiveToday: boolean;
	totalActiveDays: number;
	dailyGoalMet: boolean;
	estimatedMinutesToday: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDateString(date: Date): string {
	return date.toISOString().split("T")[0];
}

/**
 * Calculates current and longest streak from timestamp history.
 * Pure function: deterministic, handles day boundaries and missing days.
 */
export function calculateStreak(
	activityTimestamps: readonly string[],
	options: {
		dailyGoalMinutes?: number;
		now?: Date;
		minutesPerLesson?: number;
		minutesPerReview?: number;
	} = {},
): StreakResult {
	const now = options.now ?? new Date();
	const dailyGoalMinutes = options.dailyGoalMinutes ?? 15;
	const minutesPerActivity = options.minutesPerLesson ?? 5;

	if (activityTimestamps.length === 0) {
		return {
			currentStreak: 0,
			longestStreak: 0,
			isActiveToday: false,
			totalActiveDays: 0,
			dailyGoalMet: false,
			estimatedMinutesToday: 0,
		};
	}

	const todayStr = toDateString(now);
	const yesterdayDate = new Date(now.getTime() - MS_PER_DAY);
	const yesterdayStr = toDateString(yesterdayDate);

	// Count today's activities for daily goal
	let todayActivityCount = 0;
	const uniqueDateSet = new Set<string>();

	for (const ts of activityTimestamps) {
		const dStr = ts.split("T")[0];
		uniqueDateSet.add(dStr);
		if (dStr === todayStr) {
			todayActivityCount++;
		}
	}

	const sortedDates = Array.from(uniqueDateSet).sort((a, b) =>
		a < b ? 1 : -1,
	);
	const isActiveToday = uniqueDateSet.has(todayStr);

	// Calculate current streak
	let currentStreak = 0;
	let expectedDate: Date;

	if (isActiveToday) {
		currentStreak = 1;
		expectedDate = new Date(now.getTime() - MS_PER_DAY);
	} else if (uniqueDateSet.has(yesterdayStr)) {
		currentStreak = 1;
		expectedDate = new Date(yesterdayDate.getTime() - MS_PER_DAY);
	} else {
		currentStreak = 0;
		expectedDate = new Date(0);
	}

	if (currentStreak > 0) {
		while (uniqueDateSet.has(toDateString(expectedDate))) {
			currentStreak++;
			expectedDate = new Date(expectedDate.getTime() - MS_PER_DAY);
		}
	}

	// Calculate longest streak across history
	let longestStreak = currentStreak;
	if (sortedDates.length > 0) {
		// Ascending order for longest streak run calculation
		const ascDates = Array.from(uniqueDateSet).sort();
		let tempStreak = 1;

		for (let i = 1; i < ascDates.length; i++) {
			const prev = new Date(ascDates[i - 1]).getTime();
			const curr = new Date(ascDates[i]).getTime();
			const diffDays = Math.round((curr - prev) / MS_PER_DAY);

			if (diffDays === 1) {
				tempStreak++;
			} else {
				longestStreak = Math.max(longestStreak, tempStreak);
				tempStreak = 1;
			}
		}
		longestStreak = Math.max(longestStreak, tempStreak);
	}

	const estimatedMinutesToday = todayActivityCount * minutesPerActivity;
	const dailyGoalMet = estimatedMinutesToday >= dailyGoalMinutes;

	return {
		currentStreak,
		longestStreak,
		isActiveToday,
		totalActiveDays: uniqueDateSet.size,
		dailyGoalMet,
		estimatedMinutesToday,
	};
}
