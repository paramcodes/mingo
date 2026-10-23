import Link from "next/link";
import { STARTER_COURSE } from "@/features/course/starter-course";
import { ProgressRepository } from "@/features/lesson/progress.repository";
import { ReviewService } from "@/features/review/review.service";
import { getServerLearner } from "@/server/auth.helper";
import { calculateStreak } from "@/shared/calc/streak.calc";

export default async function ProgressPage() {
	const learner = await getServerLearner();
	const progressRepo = new ProgressRepository();
	const reviewService = new ReviewService();

	const progressRows = learner
		? progressRepo.getProgressByLearner(learner.id)
		: [];
	const allReviews = learner ? reviewService.getAllReviews(learner.id) : [];
	const dueReviews = learner ? reviewService.getDueReviews(learner.id) : [];

	// Extract activity timestamps from lesson completions and reviews
	const activityTimestamps = [
		...progressRows.map((r) => r.completed_at),
		...allReviews.map((r) => r.last_reviewed_at),
	];

	const streak = calculateStreak(activityTimestamps, {
		dailyGoalMinutes: learner?.dailyGoalMinutes || 15,
	});

	const totalXP = progressRows.reduce((acc, curr) => acc + curr.score, 0);
	const avgAccuracy =
		progressRows.length > 0
			? Math.round(
					progressRows.reduce((acc, curr) => acc + curr.accuracy, 0) /
						progressRows.length,
				)
			: 0;

	return (
		<div className="flex min-h-screen flex-col md:flex-row bg-[#FAF6EE] text-[#1C1917]">
			{/* Navigation Shell */}
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
							{learner ? learner.displayName : "Learner Progress"}
						</p>
					</div>
				</div>

				<nav className="flex md:flex-col gap-2">
					<Link
						href="/"
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
					>
						<span>Learn Path</span>
					</Link>
					<Link
						href="/review"
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
					>
						<span>Review</span>
					</Link>
					<Link
						href="/progress"
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FEF3C7] text-[#92400E] font-semibold text-sm transition-colors border border-[#FCD34D]"
					>
						<span>Progress</span>
					</Link>
				</nav>

				<div className="hidden md:block pt-4 border-t border-[#E7E5E4]">
					<Link
						href={learner ? "/onboarding" : "/login"}
						className="text-xs font-semibold text-[#92400E] hover:underline"
					>
						{learner ? "Edit Daily Goal / Course" : "Sign In to Save Progress"}
					</Link>
				</div>
			</aside>

			{/* Main Progress Dashboard */}
			<main className="flex-1 p-4 md:p-10 max-w-4xl mx-auto w-full">
				<header className="mb-8">
					<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
						Learner Analytics
					</span>
					<h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] mt-1">
						Progress & Retention Summary
					</h2>
					<p className="text-sm md:text-base text-[#57534E] mt-2">
						Track your learning streak, daily goal milestones, and memory
						retention.
					</p>
				</header>

				{/* Key Stat Cards Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					{/* Streak Card */}
					<div className="p-5 rounded-3xl bg-white border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
									Streak
								</span>
								<span className="text-2xl">🔥</span>
							</div>
							<div className="text-3xl font-black text-[#1C1917]">
								{streak.currentStreak} Days
							</div>
						</div>
						<p className="text-xs text-[#78716C] mt-3">
							Longest:{" "}
							<span className="font-semibold text-[#1C1917]">
								{streak.longestStreak} days
							</span>
						</p>
					</div>

					{/* Daily Goal Card */}
					<div className="p-5 rounded-3xl bg-white border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
									Daily Goal
								</span>
								<span className="text-2xl">
									{streak.dailyGoalMet ? "🎯" : "⏳"}
								</span>
							</div>
							<div className="text-3xl font-black text-[#1C1917]">
								{streak.estimatedMinutesToday} /{" "}
								{learner?.dailyGoalMinutes || 15}m
							</div>
						</div>
						<p className="text-xs text-[#78716C] mt-3">
							{streak.dailyGoalMet ? (
								<span className="text-[#166534] font-bold">
									Goal achieved today!
								</span>
							) : (
								"Complete lessons to hit goal."
							)}
						</p>
					</div>

					{/* Total XP Card */}
					<div className="p-5 rounded-3xl bg-white border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
									Total XP
								</span>
								<span className="text-2xl">⚡</span>
							</div>
							<div className="text-3xl font-black text-[#1C1917]">
								{totalXP} XP
							</div>
						</div>
						<p className="text-xs text-[#78716C] mt-3">
							Avg Accuracy:{" "}
							<span className="font-semibold text-[#1C1917]">
								{avgAccuracy}%
							</span>
						</p>
					</div>

					{/* Spaced Review Queue Card */}
					<div className="p-5 rounded-3xl bg-white border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
									SRS Due
								</span>
								<span className="text-2xl">🧠</span>
							</div>
							<div className="text-3xl font-black text-[#1C1917]">
								{dueReviews.length} Cards
							</div>
						</div>
						<div className="mt-3">
							{dueReviews.length > 0 ? (
								<Link
									href="/review"
									className="text-xs font-bold text-[#D97706] hover:underline"
								>
									Practice Due Now →
								</Link>
							) : (
								<span className="text-xs text-[#166534] font-medium">
									All caught up
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Course Progress Section */}
				<section className="mb-8 p-6 rounded-3xl bg-white border border-[#E7E5E4] shadow-xs">
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-extrabold text-lg text-[#1C1917]">
							{STARTER_COURSE.title} Progress
						</h3>
						<span className="text-xs font-bold text-[#92400E] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#FCD34D]">
							{progressRows.length} /{" "}
							{STARTER_COURSE.units.flatMap((u) => u.lessons).length} Lessons
							Completed
						</span>
					</div>

					<div className="w-full bg-[#E7E5E4] h-3 rounded-full overflow-hidden mb-2">
						<div
							className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] h-full rounded-full transition-all"
							style={{
								width: `${Math.round(
									(progressRows.length /
										STARTER_COURSE.units.flatMap((u) => u.lessons).length) *
										100,
								)}%`,
							}}
						/>
					</div>
					<p className="text-xs text-[#78716C]">
						Spaced retention algorithm actively schedules {allReviews.length}{" "}
						vocabulary concepts.
					</p>
				</section>

				{/* Recent Activity History */}
				<section className="p-6 rounded-3xl bg-white border border-[#E7E5E4] shadow-xs">
					<h3 className="font-extrabold text-lg text-[#1C1917] mb-4">
						Recent Activity History
					</h3>

					{progressRows.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-sm text-[#78716C]">
								No lesson activity recorded yet.
							</p>
							<Link
								href="/"
								className="inline-block mt-3 py-2 px-5 rounded-xl bg-[#D97706] text-white font-bold text-xs shadow-xs"
							>
								Start First Lesson
							</Link>
						</div>
					) : (
						<div className="divide-y divide-[#E7E5E4]">
							{progressRows.map((row) => (
								<div
									key={row.id}
									className="py-3.5 flex items-center justify-between"
								>
									<div>
										<div className="font-bold text-sm text-[#1C1917]">
											{STARTER_COURSE.units
												.flatMap((u) => u.lessons)
												.find((l) => l.id === row.lesson_id)?.title ||
												row.lesson_id}
										</div>
										<div className="text-xs text-[#78716C]">
											{new Date(row.completed_at).toLocaleDateString(
												undefined,
												{
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												},
											)}
										</div>
									</div>

									<div className="flex items-center gap-3">
										<span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534]">
											{row.accuracy}% accuracy
										</span>
										<span className="text-xs font-extrabold text-[#92400E]">
											+{row.score} XP
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
