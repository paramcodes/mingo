import type { Course, LessonPathItem } from "@/features/course/course.schema";

export interface PathStateCalculation {
	items: LessonPathItem[];
	resumeLessonId: string;
	completedCount: number;
	totalLessons: number;
	percentComplete: number;
}

/**
 * Pure calculation to compute lesson statuses (completed, current, locked)
 * and determine the resume point based on completed lesson IDs.
 */
export function calculateLearningPath(
	course: Course,
	completedLessonIds: Set<string> | readonly string[],
): PathStateCalculation {
	const completedSet =
		completedLessonIds instanceof Set
			? completedLessonIds
			: new Set(completedLessonIds);

	const items: LessonPathItem[] = [];
	let foundCurrent = false;
	let resumeLessonId = "";

	// Flatten all lessons across units in order
	for (const unit of course.units) {
		for (const lesson of unit.lessons) {
			const isCompleted = completedSet.has(lesson.id);

			let status: "completed" | "current" | "locked";
			if (isCompleted) {
				status = "completed";
			} else if (!foundCurrent) {
				status = "current";
				foundCurrent = true;
				resumeLessonId = lesson.id;
			} else {
				status = "locked";
			}

			items.push({
				unitId: unit.id,
				unitTitle: unit.title,
				lessonId: lesson.id,
				title: lesson.title,
				description: lesson.description,
				order: lesson.order,
				status,
			});
		}
	}

	// If all lessons are completed, resume defaults to the last lesson
	if (!resumeLessonId && items.length > 0) {
		resumeLessonId = items[items.length - 1].lessonId;
	}

	const totalLessons = items.length;
	const completedCount = items.filter((i) => i.status === "completed").length;
	const percentComplete =
		totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

	return {
		items,
		resumeLessonId,
		completedCount,
		totalLessons,
		percentComplete,
	};
}
