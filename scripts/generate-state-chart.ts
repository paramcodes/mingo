import fs from "node:fs";
import path from "node:path";
import { render } from "pele";

const stateChartMermaid = `stateDiagram-v2
    direction TB

    [*] --> Anonymous: Open App

    state "Authentication & Onboarding" as AuthFlow {
        Anonymous --> Authenticated: Sign Up / Sign In
        Authenticated --> Onboarding: First Visit
        Onboarding --> CourseConfigured: Select Course & Daily Goal
    }

    state "Guided Learning Path" as PathFlow {
        CourseConfigured --> PathView: View Path
        PathView --> PathView: Inspect Units & Lessons
        state PathView {
            [*] --> Lesson1_Current
            Lesson1_Current --> Lesson2_Locked
            Lesson2_Locked --> Lesson3_Locked
        }
    }

    state "Interactive Lesson Session" as LessonEngine {
        PathView --> ExerciseRunner: Click Start Lesson
        state ExerciseRunner {
            [*] --> DisplayPrompt
            DisplayPrompt --> AwaitingAnswer: Present Options / Input / Audio
            AwaitingAnswer --> CheckingAnswer: Submit Answer
            CheckingAnswer --> CorrectFeedback: Validated Match
            CheckingAnswer --> IncorrectFeedback: Mistake Detected
            CorrectFeedback --> NextExercise: Continue (+XP)
            IncorrectFeedback --> NextExercise: Continue (Review Queued)
            NextExercise --> DisplayPrompt: More Exercises
            NextExercise --> SessionSummary: All Complete
        }
    }

    state "Progress & Persistence" as Persistence {
        SessionSummary --> RecordProgress: Save Score & Accuracy
        RecordProgress --> UpdateSRS: Queue Concepts in SRS
        RecordProgress --> EvaluateStreak: Update Daily Goal & Streak
    }

    state "Spaced Repetition Review" as ReviewEngine {
        UpdateSRS --> ReviewQueue: Due Date Arrived
        ReviewQueue --> ReviewSession: Start Daily Practice
        ReviewSession --> IntervalExpanded: Correct Recall (Interval x Ease)
        ReviewSession --> IntervalReset: Incorrect Recall (Interval = 1 Day)
        IntervalExpanded --> AllCaughtUp: Queue Empty
        IntervalReset --> ReviewQueue: Re-queued
    }

    EvaluateStreak --> PathView: Unlocks Next Lesson Step
    AllCaughtUp --> PathView: Return to Learning Path
`;

export function generateStateChart(): string {
	const result = render(stateChartMermaid);
	const assetsDir = path.join(process.cwd(), "docs", "assets");

	if (!fs.existsSync(assetsDir)) {
		fs.mkdirSync(assetsDir, { recursive: true });
	}

	const svgPath = path.join(assetsDir, "state-chart.svg");
	fs.writeFileSync(svgPath, result.svg, "utf-8");
	console.log(`[pele] State chart SVG written to ${svgPath}`);
	return svgPath;
}

generateStateChart();
