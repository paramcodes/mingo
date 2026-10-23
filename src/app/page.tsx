import Link from "next/link";
import { STARTER_COURSE } from "@/features/course/starter-course";
import { ProgressRepository } from "@/features/lesson/progress.repository";
import { getServerLearner } from "@/server/auth.helper";
import { calculateLearningPath } from "@/shared/calc/path.calc";

export default async function HomePage() {
	const learner = await getServerLearner();
	const progressRepo = new ProgressRepository();
	const completedLessonIds = learner
		? progressRepo.getCompletedLessonIds(learner.id)
		: [];

	const pathState = calculateLearningPath(STARTER_COURSE, completedLessonIds);

	return (
		<div className="flex min-h-screen flex-col md:flex-row bg-[#FAF6EE] text-[#1C1917]">
			{/* Navigation Sidebar */}
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
							{learner
								? `Hello, ${learner.displayName}`
								: "Gold-standard learning"}
						</p>
					</div>
				</div>

				<nav className="flex md:flex-col gap-2">
					<Link
						href="/"
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FEF3C7] text-[#92400E] font-semibold text-sm transition-colors border border-[#FCD34D]"
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
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
					>
						<span>Progress</span>
					</Link>
					<Link
						href={learner ? "/onboarding" : "/login"}
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
					>
						<span>{learner ? "Settings" : "Sign In"}</span>
					</Link>
				</nav>

				<div className="hidden md:block pt-4 border-t border-[#E7E5E4]">
					<div className="rounded-xl p-3 bg-[#FFFBEB] border border-[#FCD34D]/60 text-xs text-[#92400E]">
						<p className="font-semibold">
							Daily Goal: {learner?.dailyGoalMinutes || 15} min
						</p>
						<p className="text-[#B45309] mt-0.5">
							{pathState.completedCount} of {pathState.totalLessons} lessons
							completed ({pathState.percentComplete}%)
						</p>
					</div>
				</div>
			</aside>

			{/* Main Guided Course Path Area */}
			<main className="flex-1 p-4 md:p-10 max-w-4xl mx-auto w-full">
				<header className="mb-8">
					<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
						{STARTER_COURSE.title} ({STARTER_COURSE.sourceLanguage} →{" "}
						{STARTER_COURSE.targetLanguage})
					</span>
					<h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] mt-1">
						Your Learning Path
					</h2>
					<p className="text-sm md:text-base text-[#57534E] mt-2">
						Master concepts through bite-sized lessons. Complete a lesson to
						unlock the next step.
					</p>
				</header>

				{/* Prominent Resume Banner */}
				{pathState.resumeLessonId && (
					<div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-[#FEF3C7] to-[#FFFBEB] border border-[#FCD34D] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
						<div>
							<span className="text-xs font-extrabold uppercase text-[#92400E] tracking-wider">
								Next Available Lesson
							</span>
							<h3 className="text-lg font-bold text-[#1C1917] mt-0.5">
								Ready to continue where you left off?
							</h3>
							<p className="text-xs text-[#78716C] mt-1">
								Pick up right at the current lesson to build retention and earn
								XP.
							</p>
						</div>
						<Link
							href={`/lesson/${pathState.resumeLessonId}`}
							className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold text-sm shadow-sm transition-all text-center"
						>
							Start Lesson
						</Link>
					</div>
				)}

				{/* Units & Lesson Flow */}
				<div className="space-y-10">
					{STARTER_COURSE.units.map((unit) => (
						<section key={unit.id} className="space-y-4">
							<div className="border-b border-[#E7E5E4] pb-2">
								<h3 className="text-lg font-extrabold text-[#1C1917]">
									{unit.title}
								</h3>
								<p className="text-xs text-[#78716C]">{unit.description}</p>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{unit.lessons.map((lesson) => {
									const item = pathState.items.find(
										(i) => i.lessonId === lesson.id,
									);
									const status = item?.status || "locked";

									return (
										<div
											key={lesson.id}
											className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
												status === "current"
													? "bg-white border-[#D97706] ring-2 ring-[#D97706]/30 shadow-xs"
													: status === "completed"
														? "bg-white/90 border-[#86EFAC]/80"
														: "bg-[#F3ECE0]/40 border-[#E7E5E4] opacity-75"
											}`}
										>
											<div>
												<div className="flex items-center justify-between mb-2">
													<span
														className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
															status === "completed"
																? "bg-[#DCFCE7] text-[#166534]"
																: status === "current"
																	? "bg-[#FEF3C7] text-[#92400E]"
																	: "bg-[#E7E5E4] text-[#78716C]"
														}`}
													>
														{status === "completed" && "✓ Completed"}
														{status === "current" && "Current"}
														{status === "locked" && "🔒 Locked"}
													</span>
													<span className="text-xs text-[#78716C]">
														{lesson.exercises.length} exercises
													</span>
												</div>
												<h4 className="text-base font-bold text-[#1C1917]">
													{lesson.title}
												</h4>
												<p className="text-xs text-[#57534E] mt-1">
													{lesson.description}
												</p>
											</div>

											<div className="mt-5">
												{status === "locked" ? (
													<button
														type="button"
														disabled
														className="w-full py-2.5 px-4 rounded-xl bg-[#E7E5E4] text-[#78716C] font-bold text-xs cursor-not-allowed"
													>
														Locked
													</button>
												) : (
													<Link
														href={`/lesson/${lesson.id}`}
														className={`block text-center w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition-all ${
															status === "current"
																? "bg-[#D97706] hover:bg-[#B45309] text-white"
																: "bg-[#F3ECE0] hover:bg-[#E7E5E4] text-[#1C1917]"
														}`}
													>
														{status === "current"
															? "Start Lesson"
															: "Review Again"}
													</Link>
												)}
											</div>
										</div>
									);
								})}
							</div>
						</section>
					))}
				</div>
			</main>
		</div>
	);
}
