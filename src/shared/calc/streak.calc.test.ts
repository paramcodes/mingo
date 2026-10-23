import { describe, expect, it } from "bun:test";
import { calculateStreak } from "./streak.calc";

describe("streak.calc", () => {
	const fixedNow = new Date("2026-10-23T14:00:00.000Z"); // Today is 2026-10-23

	it("returns zero streak for empty history", () => {
		const result = calculateStreak([], { now: fixedNow });
		expect(result.currentStreak).toBe(0);
		expect(result.longestStreak).toBe(0);
		expect(result.isActiveToday).toBe(false);
	});

	it("calculates active streak when learner completed activity today", () => {
		const history = [
			"2026-10-23T10:00:00.000Z", // today
			"2026-10-22T09:00:00.000Z", // yesterday
			"2026-10-21T11:00:00.000Z", // 2 days ago
		];

		const result = calculateStreak(history, { now: fixedNow });
		expect(result.isActiveToday).toBe(true);
		expect(result.currentStreak).toBe(3);
		expect(result.longestStreak).toBe(3);
	});

	it("preserves streak if learner was active yesterday but not yet today", () => {
		const history = [
			"2026-10-22T09:00:00.000Z", // yesterday
			"2026-10-21T11:00:00.000Z", // 2 days ago
		];

		const result = calculateStreak(history, { now: fixedNow });
		expect(result.isActiveToday).toBe(false);
		expect(result.currentStreak).toBe(2);
		expect(result.longestStreak).toBe(2);
	});

	it("resets current streak to 0 if yesterday was missed", () => {
		const history = [
			"2026-10-21T11:00:00.000Z", // 2 days ago
			"2026-10-20T10:00:00.000Z", // 3 days ago
		];

		const result = calculateStreak(history, { now: fixedNow });
		expect(result.isActiveToday).toBe(false);
		expect(result.currentStreak).toBe(0);
		expect(result.longestStreak).toBe(2);
	});

	it("calculates daily goal completion based on today's activities", () => {
		const history = [
			"2026-10-23T08:00:00.000Z",
			"2026-10-23T12:00:00.000Z",
			"2026-10-23T13:30:00.000Z",
		];

		// 3 activities * 5 min = 15 min; goal is 15 min
		const result = calculateStreak(history, {
			now: fixedNow,
			dailyGoalMinutes: 15,
		});
		expect(result.estimatedMinutesToday).toBe(15);
		expect(result.dailyGoalMet).toBe(true);
	});
});
