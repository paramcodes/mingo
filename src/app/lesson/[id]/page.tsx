"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { STARTER_COURSE } from "@/features/course/starter-course";
import { checkAnswer } from "@/shared/calc/scoring.calc";

export default function LessonSessionPage() {
	const params = useParams();
	const router = useRouter();
	const lessonId = typeof params?.id === "string" ? params.id : "lesson-1";

	// Find lesson in starter course
	const lesson =
		STARTER_COURSE.units
			.flatMap((u) => u.lessons)
			.find((l) => l.id === lessonId) || STARTER_COURSE.units[0].lessons[0];

	const exercises = lesson.exercises;
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [typedAnswer, setTypedAnswer] = useState("");
	const [feedback, setFeedback] = useState<{
		isCorrect: boolean;
		explanation: string;
		canonicalAnswer: string;
	} | null>(null);
	const [correctCount, setCorrectCount] = useState(0);
	const [completed, setCompleted] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const currentExercise = exercises[currentIndex];
	const progressPercent = Math.round((currentIndex / exercises.length) * 100);

	const playAudio = useCallback((text?: string) => {
		if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
			window.speechSynthesis.cancel();
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = "es-ES";
			utterance.rate = 0.9;
			window.speechSynthesis.speak(utterance);
		}
	}, []);

	// Auto-play audio on listening exercise
	useEffect(() => {
		if (currentExercise?.type === "listening" && currentExercise.audioText) {
			playAudio(currentExercise.audioText);
		}
	}, [currentExercise, playAudio]);

	function handleVerify() {
		if (!currentExercise || feedback) return;

		let answerToVerify = "";
		if (
			currentExercise.type === "multiple_choice" ||
			currentExercise.type === "listening"
		) {
			if (!selectedOption) return;
			answerToVerify = selectedOption;
		} else if (currentExercise.type === "typed_recall") {
			if (!typedAnswer.trim()) return;
			answerToVerify = typedAnswer;
		}

		const result = checkAnswer(
			answerToVerify,
			currentExercise.canonicalAnswer,
			currentExercise.acceptedVariants,
		);

		if (result.isCorrect) {
			setCorrectCount((prev) => prev + 1);
		}

		setFeedback({
			isCorrect: result.isCorrect,
			explanation: currentExercise.explanation,
			canonicalAnswer: currentExercise.canonicalAnswer,
		});
	}

	async function handleContinue() {
		if (currentIndex + 1 < exercises.length) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedOption(null);
			setTypedAnswer("");
			setFeedback(null);
		} else {
			// Lesson finished
			setSubmitting(true);
			const total = exercises.length;
			const finalAccuracy = Math.round((correctCount / total) * 100);
			const score = correctCount * 10 + 10;

			try {
				await fetch("/api/lesson/complete", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						lessonId: lesson.id,
						accuracy: finalAccuracy,
						score,
						conceptsLearned: lesson.concepts,
					}),
				});
			} catch (_e) {
				// Continue to completion view even if offline
			}

			setCompleted(true);
			setSubmitting(false);
		}
	}

	if (completed) {
		const total = exercises.length;
		const accuracy = Math.round((correctCount / total) * 100);
		const score = correctCount * 10 + 10;

		return (
			<div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4">
				<div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E7E5E4] shadow-sm text-center">
					<div className="h-16 w-16 mx-auto rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center justify-center text-3xl mb-4">
						🏆
					</div>
					<h1 className="text-2xl font-black text-[#1C1917]">
						Lesson Complete!
					</h1>
					<p className="text-sm text-[#57534E] mt-1">
						You finished <span className="font-semibold">{lesson.title}</span>.
					</p>

					<div className="grid grid-cols-2 gap-3 my-6">
						<div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FCD34D]/50">
							<span className="text-xs uppercase font-bold text-[#B45309]">
								Accuracy
							</span>
							<p className="text-2xl font-extrabold text-[#92400E] mt-1">
								{accuracy}%
							</p>
						</div>
						<div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FCD34D]/50">
							<span className="text-xs uppercase font-bold text-[#B45309]">
								XP Earned
							</span>
							<p className="text-2xl font-extrabold text-[#92400E] mt-1">
								+{score}
							</p>
						</div>
					</div>

					<div className="space-y-3">
						<Link
							href="/"
							className="block w-full py-3.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold text-sm shadow-sm transition-all"
						>
							Return to Learning Path
						</Link>
						<Link
							href="/review"
							className="block w-full py-3.5 px-4 rounded-xl bg-[#F3ECE0] hover:bg-[#E7E5E4] text-[#1C1917] font-bold text-sm transition-all"
						>
							Practice in Review
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-between">
			{/* Top Bar with Progress */}
			<header className="p-4 border-b border-[#E7E5E4] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-2xl mx-auto flex items-center gap-4">
					<button
						type="button"
						onClick={() => router.push("/")}
						className="text-[#78716C] hover:text-[#1C1917] p-2 text-xl font-bold"
						aria-label="Exit lesson"
					>
						✕
					</button>

					<div className="flex-1 bg-[#E7E5E4] h-3.5 rounded-full overflow-hidden">
						<div
							className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] h-full rounded-full transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>

					<span className="text-xs font-bold text-[#57534E]">
						{currentIndex + 1} / {exercises.length}
					</span>
				</div>
			</header>

			{/* Main Exercise Area */}
			<main className="max-w-2xl mx-auto w-full flex-1 p-4 sm:p-8 flex flex-col justify-center">
				<div className="mb-6">
					<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
						{currentExercise.type === "multiple_choice" && "Multiple Choice"}
						{currentExercise.type === "typed_recall" && "Typed Recall"}
						{currentExercise.type === "listening" && "Listening Challenge"}
					</span>
					<h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1917] mt-1">
						{currentExercise.prompt}
					</h2>
				</div>

				{/* Audio play button for listening */}
				{currentExercise.type === "listening" && (
					<div className="mb-6 flex justify-center">
						<button
							type="button"
							onClick={() => playAudio(currentExercise.audioText)}
							className="h-16 w-16 rounded-2xl bg-[#FEF3C7] hover:bg-[#FDE68A] active:bg-[#FCD34D] border-2 border-[#D97706] flex items-center justify-center text-2xl shadow-xs transition-all focus:outline-hidden focus:ring-2 focus:ring-[#D97706]"
							aria-label="Play spoken audio"
						>
							🔊
						</button>
					</div>
				)}

				{/* Exercise Input Form */}
				{currentExercise.options && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{currentExercise.options.map((opt, i) => {
							const isSelected = selectedOption === opt;
							return (
								<button
									type="button"
									key={opt}
									disabled={Boolean(feedback)}
									onClick={() => setSelectedOption(opt)}
									className={`p-4 rounded-2xl border-2 text-left font-bold text-base transition-all ${
										isSelected
											? "border-[#D97706] bg-[#FFFBEB] text-[#92400E] shadow-xs"
											: "border-[#E7E5E4] hover:bg-white bg-white/70 text-[#1C1917]"
									} disabled:cursor-not-allowed`}
								>
									<span className="inline-block w-6 text-xs text-[#78716C] font-normal">
										{i + 1}.
									</span>
									{opt}
								</button>
							);
						})}
					</div>
				)}

				{currentExercise.type === "typed_recall" && (
					<div className="mt-2">
						<input
							type="text"
							value={typedAnswer}
							disabled={Boolean(feedback)}
							onChange={(e) => setTypedAnswer(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !feedback) handleVerify();
							}}
							placeholder="Type in Spanish..."
							className="w-full p-4 rounded-2xl border-2 border-[#D6D3D1] bg-white text-[#1C1917] text-lg font-medium focus:border-[#D97706] focus:outline-hidden transition-colors"
						/>
					</div>
				)}
			</main>

			{/* Bottom Action / Feedback Bar */}
			<footer
				className={`p-4 sm:p-6 border-t transition-colors ${
					feedback
						? feedback.isCorrect
							? "bg-[#DCFCE7] border-[#86EFAC]"
							: "bg-[#FEE2E2] border-[#FCA5A5]"
						: "bg-white border-[#E7E5E4]"
				}`}
			>
				<div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
					{feedback ? (
						<div className="w-full sm:w-auto text-left">
							<div className="flex items-center gap-2">
								<span className="text-xl">
									{feedback.isCorrect ? "✓" : "✗"}
								</span>
								<h3
									className={`text-base font-extrabold ${
										feedback.isCorrect ? "text-[#166534]" : "text-[#991B1B]"
									}`}
								>
									{feedback.isCorrect ? "Correct!" : "Incorrect"}
								</h3>
							</div>
							{!feedback.isCorrect && (
								<p className="text-xs text-[#991B1B] font-medium mt-0.5">
									Correct answer:{" "}
									<span className="font-bold">{feedback.canonicalAnswer}</span>
								</p>
							)}
							<p
								className={`text-xs mt-1 ${
									feedback.isCorrect ? "text-[#15803D]" : "text-[#B91C1C]"
								}`}
							>
								{feedback.explanation}
							</p>
						</div>
					) : (
						<div className="hidden sm:block text-xs text-[#78716C]">
							Choose your answer and click check to verify.
						</div>
					)}

					<div className="w-full sm:w-auto">
						{feedback ? (
							<button
								type="button"
								onClick={handleContinue}
								disabled={submitting}
								className={`w-full sm:w-auto py-3 px-8 rounded-xl font-bold text-sm shadow-sm transition-all ${
									feedback.isCorrect
										? "bg-[#166534] hover:bg-[#14532D] text-white"
										: "bg-[#991B1B] hover:bg-[#7F1D1D] text-white"
								}`}
							>
								{currentIndex + 1 < exercises.length
									? "Continue"
									: "Finish Lesson"}
							</button>
						) : (
							<button
								type="button"
								onClick={handleVerify}
								disabled={
									(currentExercise.options && !selectedOption) ||
									(currentExercise.type === "typed_recall" &&
										!typedAnswer.trim())
								}
								className="w-full sm:w-auto py-3 px-8 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold text-sm shadow-sm transition-all focus:outline-hidden disabled:opacity-40 disabled:cursor-not-allowed"
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
