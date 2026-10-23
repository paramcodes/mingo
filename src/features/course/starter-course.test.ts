import { describe, expect, it } from "bun:test";
import { validateCourse } from "./course.schema";
import { STARTER_COURSE } from "./starter-course";

describe("starter-course", () => {
	it("conforms to the course schema", () => {
		expect(validateCourse(STARTER_COURSE)).toBe(true);
		expect(STARTER_COURSE.units.length).toBeGreaterThan(0);
		expect(STARTER_COURSE.units.every((u) => u.lessons.length > 0)).toBe(true);
	});
});
