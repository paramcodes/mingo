export default function GlobalLoading() {
	return (
		<div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4">
			<div className="text-center">
				<div className="h-12 w-12 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
				<p className="text-sm font-bold text-[#92400E]">Loading Mingo...</p>
			</div>
		</div>
	);
}
