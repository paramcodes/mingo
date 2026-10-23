import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E7E5E4] shadow-xs text-center">
				<div className="h-16 w-16 mx-auto rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center justify-center text-3xl mb-4">
					🔍
				</div>
				<h1 className="text-2xl font-black text-[#1C1917]">Page Not Found</h1>
				<p className="text-sm text-[#57534E] mt-2">
					The lesson, unit, or route you are looking for does not exist.
				</p>

				<div className="mt-6">
					<Link
						href="/"
						className="inline-block w-full py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-xs transition-all"
					>
						Back to Learning Path
					</Link>
				</div>
			</div>
		</div>
	);
}
