"use client";

import { useState } from "react";

const COURSES = [
	{
		id: "es-en",
		title: "Spanish Essentials",
		flag: "🇪🇸",
		description:
			"Master salutations, courtesies, and everyday survival phrases.",
	},
	{
		id: "fr-en",
		title: "French Foundations",
		flag: "🇫🇷",
		description:
			"Pronunciation, basic introductions, and conversational fundamentals.",
	},
	{
		id: "de-en",
		title: "German Core",
		flag: "🇩🇪",
		description:
			"Essential grammar, greetings, and daily practical vocabulary.",
	},
];

const GOALS = [
	{ minutes: 5, label: "Casual", description: "5 minutes / day" },
	{ minutes: 10, label: "Regular", description: "10 minutes / day" },
	{
		minutes: 15,
		label: "Serious",
		description: "15 minutes / day (Recommended)",
	},
	{ minutes: 20, label: "Intense", description: "20 minutes / day" },
];

export default function OnboardingPage() {
	const [selectedCourse, setSelectedCourse] = useState("es-en");
	const [selectedGoal, setSelectedGoal] = useState(15);
	const [saving, setSaving] = useState(false);

	async function handleComplete() {
		setSaving(true);
		try {
			await fetch("/api/onboarding", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					targetCourse: selectedCourse,
					dailyGoalMinutes: selectedGoal,
				}),
			});
			window.location.href = "/";
		} catch (_err) {
			window.location.href = "/";
		}
	}

	return (
		<div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4 py-12">
			<div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E5E4] shadow-sm">
				<header className="mb-8 text-center">
					<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
						Learner Onboarding
					</span>
					<h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] mt-1">
						Personalize your study plan
					</h1>
					<p className="text-sm text-[#57534E] mt-2">
						Choose your language focus and daily commitment to build a lasting
						habit.
					</p>
				</header>

				{/* Step 1: Course selection */}
				<section className="mb-8">
					<h2 className="text-sm font-bold uppercase tracking-wider text-[#57534E] mb-3">
						1. Choose your course
					</h2>
					<div className="grid grid-cols-1 gap-3">
						{COURSES.map((course) => {
							const isSelected = selectedCourse === course.id;
							return (
								<button
									type="button"
									key={course.id}
									onClick={() => setSelectedCourse(course.id)}
									className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${
										isSelected
											? "border-[#D97706] bg-[#FFFBEB] ring-2 ring-[#D97706]/40 shadow-xs"
											: "border-[#E7E5E4] hover:bg-[#FAF6EE]/50 bg-white"
									}`}
								>
									<span className="text-3xl p-1">{course.flag}</span>
									<div className="flex-1">
										<h3 className="font-bold text-[#1C1917] text-base">
											{course.title}
										</h3>
										<p className="text-xs text-[#78716C] mt-0.5">
											{course.description}
										</p>
									</div>
								</button>
							);
						})}
					</div>
				</section>

				{/* Step 2: Goal selection */}
				<section className="mb-8">
					<h2 className="text-sm font-bold uppercase tracking-wider text-[#57534E] mb-3">
						2. Set your daily goal
					</h2>
					<div className="grid grid-cols-2 gap-3">
						{GOALS.map((goal) => {
							const isSelected = selectedGoal === goal.minutes;
							return (
								<button
									type="button"
									key={goal.minutes}
									onClick={() => setSelectedGoal(goal.minutes)}
									className={`p-3.5 rounded-2xl border text-left transition-all ${
										isSelected
											? "border-[#D97706] bg-[#FFFBEB] ring-2 ring-[#D97706]/40 shadow-xs"
											: "border-[#E7E5E4] hover:bg-[#FAF6EE]/50 bg-white"
									}`}
								>
									<div className="font-bold text-sm text-[#1C1917]">
										{goal.label}
									</div>
									<div className="text-xs text-[#78716C] mt-0.5">
										{goal.description}
									</div>
								</button>
							);
						})}
					</div>
				</section>

				<button
					id="complete-onboarding-btn"
					type="button"
					onClick={handleComplete}
					disabled={saving}
					className="w-full py-3.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold text-sm shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2 disabled:opacity-50"
				>
					{saving ? "Saving Preferences..." : "Continue to Learning Path"}
				</button>
			</div>
		</div>
	);
}
