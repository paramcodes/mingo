import type { Metadata } from "next";
import "@/app.css";

export const metadata: Metadata = {
	title: "Mingo — Language Learning",
	description:
		"Learn languages through focused, bite-sized lessons with gold-standard retention.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen antialiased bg-[#FAF6EE] text-[#1C1917]">
				{children}
			</body>
		</html>
	);
}
