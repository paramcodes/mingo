"use client";

import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Unhandled application error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E7E5E4] shadow-xs text-center">
				<div className="h-16 w-16 mx-auto rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center text-3xl mb-4">
					⚠️
				</div>
				<h1 className="text-2xl font-black text-[#1C1917]">
					Something went wrong
				</h1>
				<p className="text-sm text-[#57534E] mt-2">
					We encountered an unexpected error while loading this page.
				</p>

				<div className="mt-6 flex flex-col gap-3">
					<button
						type="button"
						onClick={() => reset()}
						className="w-full py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-xs transition-all"
					>
						Try Again
					</button>
					<a
						href="/"
						className="w-full py-3 px-4 rounded-xl bg-[#F3ECE0] hover:bg-[#E7E5E4] text-[#1C1917] font-bold text-sm transition-all text-center"
					>
						Return Home
					</a>
				</div>
			</div>
		</div>
	);
}
