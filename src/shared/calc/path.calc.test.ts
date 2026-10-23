import { describe, expect, it } from "bun:test";
import type { Course } from "@/features/course/course.schema";
import { validateCourse } from "@/features/course/course.schema";
import { calculateLearningPath } from "./path.calc";

const sampleCourse: Course = {
	id: "es-en",
	version: "1.0.0",
	title: "Spanish Starter",
	sourceLanguage: "English",
	targetLanguage: "Spanish",
	units: [
		{
			id: "unit-1",
			title: "Greetings",
			description: "Essential greetings",
			order: 1,
			lessons: [
				{
					id: "lesson-1",
					title: "Hello & Goodbye",
					description: "Basic greetings",
					order: 1,
					concepts: ["c-hola", "c-adios"],
					exercises: [
						{
							id: "ex-1",
							type: "multiple_choice",
							prompt: "Translate 'Hello'",
							options: ["Hola", "Adiós", "Gracias"],
							canonicalAnswer: "Hola",
							explanation: "'Hola' means 'Hello'.",
						},
					],
				},
				{
					id: "lesson-2",
					title: "How are you",
					description: "Polite inquiries",
					order: 2,
					concepts: ["c-como-estas"],
					exercises: [
						{
							id: "ex-2",
							type: "typed_recall",
							prompt: "Translate 'How are you?'",
							canonicalAnswer: "¿Cómo estás?",
							acceptedVariants: ["como estas", "cómo estás"],
							explanation: "'¿Cómo estás?' is how are you.",
						},
					],
				},
			],
		},
		{
			id: "unit-2",
			title: "Courtesies",
			description: "Please and thank you",
			order: 2,
			lessons: [
				{
					id: "lesson-3",
					title: "Thanks",
					description: "Expressing gratitude",
					order: 3,
					concepts: ["c-gracias"],
					exercises: [
						{
							id: "ex-3",
							type: "listening",
							prompt: "Listen and choose the matching word",
							audioText: "Gracias",
							options: ["Gracias", "Por favor"],
							canonicalAnswer: "Gracias",
							explanation: "'Gracias' means thank you.",
						},
					],
				},
			],
		},
	],
};

describe("course.schema & path.calc", () => {
	it("validates valid course content and rejects malformed courses", () => {
		expect(validateCourse(sampleCourse)).toBe(true);
		expect(validateCourse(null)).toBe(false);
		expect(validateCourse({ id: "invalid" })).toBe(false);
		expect(
			validateCourse({
				...sampleCourse,
				units: [],
			}),
		).toBe(false);
	});

	it("marks initial lesson as current and subsequent as locked when no progress", () => {
		const pathState = calculateLearningPath(sampleCourse, []);

		expect(pathState.totalLessons).toBe(3);
		expect(pathState.completedCount).toBe(0);
		expect(pathState.percentComplete).toBe(0);
		expect(pathState.resumeLessonId).toBe("lesson-1");

		expect(pathState.items[0].status).toBe("current");
		expect(pathState.items[1].status).toBe("locked");
		expect(pathState.items[2].status).toBe("locked");
	});

	it("advances current status and sets resume point when progress exists", () => {
		const pathState = calculateLearningPath(sampleCourse, ["lesson-1"]);

		expect(pathState.completedCount).toBe(1);
		expect(pathState.percentComplete).toBe(33);
		expect(pathState.resumeLessonId).toBe("lesson-2");

		expect(pathState.items[0].status).toBe("completed");
		expect(pathState.items[1].status).toBe("current");
		expect(pathState.items[2].status).toBe("locked");
	});

	it("handles complete course completion gracefully", () => {
		const pathState = calculateLearningPath(sampleCourse, [
			"lesson-1",
			"lesson-2",
			"lesson-3",
		]);

		expect(pathState.completedCount).toBe(3);
		expect(pathState.percentComplete).toBe(100);
		expect(pathState.resumeLessonId).toBe("lesson-3");
		expect(pathState.items.every((i) => i.status === "completed")).toBe(true);
	});
});
