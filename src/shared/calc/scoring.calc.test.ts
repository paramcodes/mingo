import { describe, expect, it } from "bun:test";
import {
	calculateAccuracy,
	checkAnswer,
	normalizeAnswer,
} from "./scoring.calc";

describe("scoring.calc", () => {
	it("normalizes case, whitespace, accents, and punctuation", () => {
		expect(normalizeAnswer("  ¡Hola, mundo!  ")).toBe("hola mundo");
		expect(normalizeAnswer("Café")).toBe("cafe");
		expect(normalizeAnswer("¿Cómo estás?")).toBe("como estas");
	});

	it("matches exact canonical answers", () => {
		const result = checkAnswer("hola", "hola");
		expect(result.isCorrect).toBe(true);
		expect(result.acceptedVariantMatched).toBe("hola");
	});

	it("matches accepted variants with accent differences", () => {
		const result = checkAnswer("buenos dias", "buenos días", [
			"buen día",
			"buenos dias",
		]);
		expect(result.isCorrect).toBe(true);
	});

	it("rejects incorrect answers", () => {
		const result = checkAnswer("adios", "hola", ["buen día"]);
		expect(result.isCorrect).toBe(false);
		expect(result.acceptedVariantMatched).toBeUndefined();
	});

	it("calculates accuracy percentage accurately", () => {
		expect(calculateAccuracy(5, 5)).toBe(100);
		expect(calculateAccuracy(4, 5)).toBe(80);
		expect(calculateAccuracy(0, 10)).toBe(0);
		expect(calculateAccuracy(0, 0)).toBe(0);
	});
});
