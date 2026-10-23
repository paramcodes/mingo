export type ExerciseType = "multiple_choice" | "typed_recall" | "listening";

export interface Exercise {
	id: string;
	type: ExerciseType;
	prompt: string;
	audioText?: string;
	options?: string[];
	canonicalAnswer: string;
	acceptedVariants?: string[];
	explanation: string;
}

export interface Lesson {
	id: string;
	title: string;
	description: string;
	order: number;
	concepts: string[];
	exercises: Exercise[];
}

export interface Unit {
	id: string;
	title: string;
	description: string;
	order: number;
	lessons: Lesson[];
}

export interface Course {
	id: string;
	version: string;
	title: string;
	sourceLanguage: string;
	targetLanguage: string;
	units: Unit[];
}

export type LessonPathStatus = "completed" | "current" | "locked";

export interface LessonPathItem {
	unitId: string;
	unitTitle: string;
	lessonId: string;
	title: string;
	description: string;
	order: number;
	status: LessonPathStatus;
	score?: number;
	accuracy?: number;
}

/**
 * Validate course content schema integrity at runtime.
 */
export function validateCourse(course: unknown): course is Course {
	if (!course || typeof course !== "object") return false;
	const c = course as Partial<Course>;

	if (
		typeof c.id !== "string" ||
		typeof c.version !== "string" ||
		typeof c.title !== "string" ||
		!Array.isArray(c.units) ||
		c.units.length === 0
	) {
		return false;
	}

	for (const unit of c.units) {
		if (
			typeof unit.id !== "string" ||
			typeof unit.title !== "string" ||
			!Array.isArray(unit.lessons) ||
			unit.lessons.length === 0
		) {
			return false;
		}

		for (const lesson of unit.lessons) {
			if (
				typeof lesson.id !== "string" ||
				typeof lesson.title !== "string" ||
				!Array.isArray(lesson.exercises) ||
				lesson.exercises.length === 0
			) {
				return false;
			}

			for (const ex of lesson.exercises) {
				if (
					typeof ex.id !== "string" ||
					typeof ex.prompt !== "string" ||
					typeof ex.canonicalAnswer !== "string" ||
					typeof ex.explanation !== "string"
				) {
					return false;
				}
				if (
					!["multiple_choice", "typed_recall", "listening"].includes(ex.type)
				) {
					return false;
				}
				if (ex.type === "multiple_choice") {
					if (!Array.isArray(ex.options) || ex.options.length < 2) {
						return false;
					}
				}
			}
		}
	}

	return true;
}
