"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Exercise } from "@/features/course/course.schema";
import { checkAnswer } from "@/shared/calc/scoring.calc";

interface DueItem {
	conceptId: string;
	repetitions: number;
	intervalDays: number;
	exercise: Exercise;
}

export default function ReviewPage() {
	const [loading, setLoading] = useState(true);
	const [dueItems, setDueItems] = useState<DueItem[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<{
		isCorrect: boolean;
		explanation: string;
	} | null>(null);
	const [completedCount, setCompletedCount] = useState(0);

	useEffect(() => {
		async function fetchDue() {
			try {
				const res = await fetch("/api/review/due");
				const data = await res.json();
				if (data.due) {
					setDueItems(data.due);
				}
			} catch (_e) {
				// handled by empty state
			} finally {
				setLoading(false);
			}
		}
		fetchDue();
	}, []);

	const currentItem = dueItems[currentIndex];

	async function handleVerify() {
		if (!currentItem || feedback || !selectedOption) return;

		const result = checkAnswer(
			selectedOption,
			currentItem.exercise.canonicalAnswer,
			currentItem.exercise.acceptedVariants,
		);

		setFeedback({
			isCorrect: result.isCorrect,
			explanation: currentItem.exercise.explanation,
		});

		// Record attempt in SRS scheduler
		try {
			await fetch("/api/review/attempt", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					conceptId: currentItem.conceptId,
					isCorrect: result.isCorrect,
				}),
			});
		} catch (_err) {
			// continue
		}

		setCompletedCount((prev) => prev + 1);
	}

	function handleContinue() {
		if (currentIndex + 1 < dueItems.length) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedOption(null);
			setFeedback(null);
		} else {
			// All due items finished
			setCurrentIndex(dueItems.length);
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4">
				<div className="text-center">
					<div className="h-10 w-10 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-sm font-semibold text-[#57534E]">
						Loading your review cards...
					</p>
				</div>
			</div>
		);
	}

	// Empty state: No reviews due or review completed
	if (dueItems.length === 0 || currentIndex >= dueItems.length) {
		return (
			<div className="min-h-screen bg-[#FAF6EE] flex flex-col md:flex-row">
				<aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E7E5E4] bg-white/80 backdrop-blur-sm p-4 md:p-6 flex md:flex-col justify-between items-center md:items-stretch">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-xs text-white font-bold text-xl">
							M
						</div>
						<div>
							<h1 className="text-xl font-bold tracking-tight text-[#1C1917]">
								Mingo
							</h1>
							<p className="text-xs text-[#78716C] hidden md:block">
								Spaced Review
							</p>
						</div>
					</div>

					<nav className="flex md:flex-col gap-2">
						<Link
							href="/"
							className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
						>
							Learn
						</Link>
						<Link
							href="/review"
							className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FEF3C7] text-[#92400E] font-semibold text-sm transition-colors border border-[#FCD34D]"
						>
							Review
						</Link>
						<Link
							href="/progress"
							className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
						>
							Progress
						</Link>
						<Link
							href="/login"
							className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
						>
							Account
						</Link>
					</nav>
					<div className="hidden md:block" />
				</aside>

				<main className="flex-1 p-6 md:p-12 max-w-2xl mx-auto flex items-center justify-center">
					<div className="w-full bg-white rounded-3xl p-8 border border-[#E7E5E4] shadow-xs text-center">
						<div className="h-16 w-16 mx-auto rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-3xl mb-4">
							✨
						</div>
						<h2 className="text-2xl font-black text-[#1C1917]">
							{completedCount > 0 ? "Review Complete!" : "All Caught Up!"}
						</h2>
						<p className="text-sm text-[#57534E] mt-2">
							{completedCount > 0
								? `You practiced ${completedCount} concept${completedCount > 1 ? "s" : ""} and strengthened memory pathways.`
								: "No review cards are currently due. Complete more lessons to queue concepts for spaced practice."}
						</p>

						<div className="mt-8 space-y-3">
							<Link
								href="/"
								className="block w-full py-3.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold text-sm shadow-sm transition-all"
							>
								Continue Learning Path
							</Link>
						</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-between">
			<header className="p-4 border-b border-[#E7E5E4] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-xl mx-auto flex items-center justify-between">
					<Link
						href="/"
						className="text-xs font-bold text-[#78716C] hover:text-[#1C1917]"
					>
						← Exit Review
					</Link>
					<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
						Spaced Review · {currentIndex + 1} of {dueItems.length}
					</span>
					<div className="w-12" />
				</div>
			</header>

			<main className="max-w-xl mx-auto w-full flex-1 p-6 flex flex-col justify-center">
				<div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] shadow-xs">
					<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
						Recall Challenge
					</span>
					<h2 className="text-xl font-extrabold text-[#1C1917] mt-1 mb-6">
						{currentItem.exercise.prompt}
					</h2>

					{currentItem.exercise.options && (
						<div className="space-y-3">
							{currentItem.exercise.options.map((opt) => {
								const isSelected = selectedOption === opt;
								return (
									<button
										type="button"
										key={opt}
										disabled={Boolean(feedback)}
										onClick={() => setSelectedOption(opt)}
										className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all ${
											isSelected
												? "border-[#D97706] bg-[#FFFBEB] text-[#92400E]"
												: "border-[#E7E5E4] hover:bg-[#FAF6EE] text-[#1C1917]"
										} disabled:cursor-not-allowed`}
									>
										{opt}
									</button>
								);
							})}
						</div>
					)}
				</div>
			</main>

			<footer
				className={`p-4 border-t transition-colors ${
					feedback
						? feedback.isCorrect
							? "bg-[#DCFCE7] border-[#86EFAC]"
							: "bg-[#FEE2E2] border-[#FCA5A5]"
						: "bg-white border-[#E7E5E4]"
				}`}
			>
				<div className="max-w-xl mx-auto flex items-center justify-between gap-4">
					{feedback ? (
						<div className="text-left flex-1">
							<span
								className={`text-sm font-extrabold block ${
									feedback.isCorrect ? "text-[#166534]" : "text-[#991B1B]"
								}`}
							>
								{feedback.isCorrect
									? "Correct! Interval extended."
									: "Incorrect. Scheduled for tomorrow."}
							</span>
							<p className="text-xs text-[#57534E] mt-0.5">
								{feedback.explanation}
							</p>
						</div>
					) : (
						<div className="text-xs text-[#78716C]">
							Select an answer and check.
						</div>
					)}

					<div>
						{feedback ? (
							<button
								type="button"
								onClick={handleContinue}
								className="py-3 px-6 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold text-sm transition-all"
							>
								Next Card
							</button>
						) : (
							<button
								type="button"
								onClick={handleVerify}
								disabled={!selectedOption}
								className="py-3 px-6 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm transition-all disabled:opacity-40"
							>
								Check
							</button>
						)}
					</div>
				</div>
			</footer>
		</div>
	);
}
