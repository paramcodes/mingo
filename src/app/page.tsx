export default function HomePage() {
	return (
		<div className="flex min-h-screen flex-col md:flex-row bg-[#FAF6EE] text-[#1C1917]">
			{/* Navigation Shell - Sidebar on desktop, top bar on mobile */}
			<aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E7E5E4] bg-white/80 backdrop-blur-sm p-4 md:p-6 flex md:flex-col justify-between items-center md:items-stretch">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-sm text-white font-bold text-xl">
						M
					</div>
					<div>
						<h1 className="text-xl font-bold tracking-tight text-[#1C1917]">
							Mingo
						</h1>
						<p className="text-xs text-[#78716C] hidden md:block">
							Gold-standard learning
						</p>
					</div>
				</div>

				<nav className="flex md:flex-col gap-2">
					<a
						href="/"
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FEF3C7] text-[#92400E] font-semibold text-sm transition-colors border border-[#FCD34D]"
					>
						<span>Learn</span>
					</a>
					<a
						href="/review"
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
					>
						<span>Review</span>
					</a>
					<a
						href="/progress"
						className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#57534E] hover:bg-[#F3ECE0] font-medium text-sm transition-colors"
					>
						<span>Progress</span>
					</a>
				</nav>

				<div className="hidden md:block pt-4 border-t border-[#E7E5E4]">
					<div className="rounded-xl p-3 bg-[#FFFBEB] border border-[#FCD34D]/60 text-xs text-[#92400E]">
						<p className="font-semibold">Daily Goal: 15 min</p>
						<p className="text-[#B45309] mt-0.5">
							Start a lesson to keep your momentum.
						</p>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 p-4 md:p-10 max-w-4xl mx-auto w-full">
				<header className="mb-8">
					<span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
						Welcome to Mingo
					</span>
					<h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] mt-1">
						Master languages step by step
					</h2>
					<p className="text-sm md:text-base text-[#57534E] mt-2">
						Structured bite-sized lessons, spaced review, and immediate feedback
						designed for lasting retention.
					</p>
				</header>

				{/* Path / Activity preview cards */}
				<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="p-6 rounded-2xl bg-white border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
						<div>
							<div className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] mb-3">
								Unit 1 · Fundamentals
							</div>
							<h3 className="text-lg font-bold text-[#1C1917]">
								Greetings & Essentials
							</h3>
							<p className="text-sm text-[#78716C] mt-1">
								Learn basic salutations, common introductions, and essential
								everyday phrases.
							</p>
						</div>
						<div className="mt-6">
							<button
								type="button"
								className="w-full py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold text-sm shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2"
							>
								Start Lesson
							</button>
						</div>
					</div>

					<div className="p-6 rounded-2xl bg-white border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
						<div>
							<div className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F3ECE0] text-[#57534E] mb-3">
								Spaced Practice
							</div>
							<h3 className="text-lg font-bold text-[#1C1917]">Daily Review</h3>
							<p className="text-sm text-[#78716C] mt-1">
								Strengthen memory pathways with quick retrieval exercises
								scheduled at optimal intervals.
							</p>
						</div>
						<div className="mt-6">
							<button
								type="button"
								className="w-full py-3 px-4 rounded-xl bg-[#F3ECE0] hover:bg-[#E7E5E4] text-[#1C1917] font-bold text-sm transition-all"
							>
								Practice Due Cards
							</button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
