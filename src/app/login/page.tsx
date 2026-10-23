"use client";

import { useState } from "react";

export default function LoginPage() {
	const [mode, setMode] = useState<"signin" | "signup">("signup");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const endpoint =
			mode === "signup" ? "/api/auth/signup" : "/api/auth/signin";
		const body =
			mode === "signup"
				? { email, password, displayName }
				: { email, password };

		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await res.json();
			if (!res.ok || !data.success) {
				setError(data.error || "An error occurred");
				setLoading(false);
				return;
			}

			if (mode === "signup") {
				window.location.href = "/onboarding";
			} else {
				window.location.href = "/";
			}
		} catch (_err) {
			setError("Network error. Please try again.");
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#FAF6EE] px-4 py-12">
			<div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E7E5E4] shadow-sm">
				<div className="flex flex-col items-center mb-6">
					<div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white font-extrabold text-2xl shadow-xs">
						M
					</div>
					<h1 className="text-2xl font-black text-[#1C1917] mt-3">
						{mode === "signup"
							? "Create your Mingo account"
							: "Welcome back to Mingo"}
					</h1>
					<p className="text-xs text-[#78716C] mt-1 text-center">
						{mode === "signup"
							? "Save progress, build your streak, and unlock spaced review."
							: "Continue your language learning streak."}
					</p>
				</div>

				{/* Mode switcher tabs */}
				<div className="flex bg-[#F3ECE0] p-1 rounded-xl mb-6">
					<button
						type="button"
						onClick={() => {
							setMode("signup");
							setError(null);
						}}
						className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
							mode === "signup"
								? "bg-white text-[#92400E] shadow-xs"
								: "text-[#57534E] hover:text-[#1C1917]"
						}`}
					>
						Sign Up
					</button>
					<button
						type="button"
						onClick={() => {
							setMode("signin");
							setError(null);
						}}
						className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
							mode === "signin"
								? "bg-white text-[#92400E] shadow-xs"
								: "text-[#57534E] hover:text-[#1C1917]"
						}`}
					>
						Sign In
					</button>
				</div>

				{error && (
					<div
						role="alert"
						className="mb-4 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs font-medium"
					>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{mode === "signup" && (
						<div>
							<label
								htmlFor="displayName"
								className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1.5"
							>
								Display Name
							</label>
							<input
								id="displayName"
								type="text"
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								placeholder="e.g. Maria"
								className="w-full px-4 py-2.5 rounded-xl border border-[#D6D3D1] bg-[#FAF6EE]/50 focus:bg-white text-[#1C1917] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D97706] transition-colors"
							/>
						</div>
					)}

					<div>
						<label
							htmlFor="email"
							className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1.5"
						>
							Email Address
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="learner@example.com"
							className="w-full px-4 py-2.5 rounded-xl border border-[#D6D3D1] bg-[#FAF6EE]/50 focus:bg-white text-[#1C1917] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D97706] transition-colors"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-1.5"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							minLength={6}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="At least 6 characters"
							className="w-full px-4 py-2.5 rounded-xl border border-[#D6D3D1] bg-[#FAF6EE]/50 focus:bg-white text-[#1C1917] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D97706] transition-colors"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-bold text-sm shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2 disabled:opacity-50 mt-6"
					>
						{loading
							? "Processing..."
							: mode === "signup"
								? "Get Started"
								: "Sign In"}
					</button>
				</form>
			</div>
		</div>
	);
}
