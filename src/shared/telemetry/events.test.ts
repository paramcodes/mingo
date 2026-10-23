import { describe, expect, it } from "bun:test";
import { createTelemetryEvent, validateTelemetryPayload } from "./events";

describe("telemetry.events", () => {
	it("creates clean event payload and obfuscates learner ID", () => {
		const event = createTelemetryEvent(
			"lesson_completed",
			{
				lessonId: "lesson-1",
				accuracy: 100,
				score: 40,
			},
			"learner-uuid-12345",
		);

		expect(event.event).toBe("lesson_completed");
		expect(event.learnerId).toMatch(/^anon_/);
		expect(event.properties.accuracy).toBe(100);
		expect(validateTelemetryPayload(event)).toBe(true);
	});

	it("strips sensitive data fields like answers, passwords, or emails", () => {
		const event = createTelemetryEvent("lesson_completed", {
			lessonId: "lesson-1",
			userAnswer: "secret answer",
			email: "user@example.com",
			score: 20,
		});

		expect(event.properties.userAnswer).toBeUndefined();
		expect(event.properties.email).toBeUndefined();
		expect(event.properties.score).toBe(20);
		expect(validateTelemetryPayload(event)).toBe(true);
	});

	it("rejects invalid payloads with forbidden keys or bad event names", () => {
		expect(validateTelemetryPayload(null)).toBe(false);
		expect(
			validateTelemetryPayload({
				event: "unknown_event",
				timestamp: new Date().toISOString(),
				properties: {},
			}),
		).toBe(false);

		expect(
			validateTelemetryPayload({
				event: "lesson_completed",
				timestamp: new Date().toISOString(),
				properties: { rawAnswer: "something" },
			}),
		).toBe(false);
	});
});
