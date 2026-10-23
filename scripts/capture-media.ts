import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function runCommand(cmd: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const proc = spawn("bash", ["-c", cmd]);
		let stdout = "";
		let stderr = "";
		proc.stdout.on("data", (d) => {
			stdout += d;
		});
		proc.stderr.on("data", (d) => {
			stderr += d;
		});
		proc.on("close", (code) => {
			if (code === 0) resolve(stdout);
			else reject(new Error(`Command failed (${code}): ${stderr || stdout}`));
		});
	});
}

async function main() {
	const screenshotsDir = path.join(
		process.cwd(),
		"docs",
		"assets",
		"screenshots",
	);
	const framesDir = path.join(process.cwd(), ".data", "video-frames");

	fs.mkdirSync(screenshotsDir, { recursive: true });
	fs.mkdirSync(framesDir, { recursive: true });

	const port = 3336;
	const server = spawn("bun", ["run", "start", "--", "-p", String(port)], {
		stdio: "ignore",
	});

	await sleep(2500);

	try {
		console.log("Navigating to Login...");
		await runCommand(
			`agent-browser --engine chrome open http://localhost:${port}/login`,
		);
		await runCommand("agent-browser set viewport 1280 800");
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_01.png")}`,
		);

		console.log("Filling Sign Up...");
		await runCommand('agent-browser fill "#displayName" "Maria"');
		await runCommand(
			'agent-browser fill "#email" "readme_learner@example.com"',
		);
		await runCommand('agent-browser fill "#password" "password123"');
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_02.png")}`,
		);
		await runCommand("agent-browser click \"button[type='submit']\"");
		await sleep(1500);

		console.log("Onboarding...");
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "01-onboarding.png")}`,
		);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_03.png")}`,
		);
		await runCommand('agent-browser click "#complete-onboarding-btn"');
		await sleep(1500);

		console.log("Learning Path Initial...");
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "02-learning-path.png")}`,
		);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_04.png")}`,
		);

		console.log("Starting Lesson...");
		await runCommand("agent-browser click \"a[href='/lesson/lesson-1']\"");
		await sleep(1500);

		console.log("Exercise 1...");
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "03-exercise-multiple-choice.png")}`,
		);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_05.png")}`,
		);
		await runCommand('agent-browser find role button click --name "1. Hola"');
		await runCommand('agent-browser find role button click --name "Check"');
		await sleep(500);
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "04-exercise-feedback.png")}`,
		);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_06.png")}`,
		);
		await runCommand('agent-browser find role button click --name "Continue"');
		await sleep(800);

		console.log("Exercise 2...");
		await runCommand(
			'agent-browser fill "input[placeholder=\'Type in Spanish...\']" "Buenos días"',
		);
		await runCommand('agent-browser find role button click --name "Check"');
		await sleep(500);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_07.png")}`,
		);
		await runCommand('agent-browser find role button click --name "Continue"');
		await sleep(800);

		console.log("Exercise 3...");
		await runCommand(
			'agent-browser find role button click --name "1. ¿Cómo estás?"',
		);
		await runCommand('agent-browser find role button click --name "Check"');
		await sleep(500);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_08.png")}`,
		);
		await runCommand(
			'agent-browser find role button click --name "Finish Lesson"',
		);
		await sleep(1500);

		console.log("Lesson Completed Screen...");
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "05-lesson-completed.png")}`,
		);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_09.png")}`,
		);

		console.log("Return to Learning Path...");
		await runCommand(
			'agent-browser find role link click --name "Return to Learning Path"',
		);
		await sleep(1500);
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "06-path-unlocked.png")}`,
		);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_10.png")}`,
		);

		console.log("Spaced Review Screen...");
		await runCommand('agent-browser find role link click --name "Review"');
		await sleep(1500);
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "07-spaced-review.png")}`,
		);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_11.png")}`,
		);

		console.log("Progress Analytics Dashboard...");
		await runCommand('agent-browser find role link click --name "Progress"');
		await sleep(1500);
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "08-progress-dashboard.png")}`,
		);
		await runCommand(
			`agent-browser screenshot ${path.join(framesDir, "frame_12.png")}`,
		);

		console.log("Mobile Viewport...");
		await runCommand("agent-browser set viewport 390 844");
		await runCommand(`agent-browser open "http://localhost:${port}/"`);
		await sleep(1000);
		await runCommand(
			`agent-browser screenshot ${path.join(screenshotsDir, "09-mobile-responsive.png")}`,
		);

		await runCommand("agent-browser close --all");

		console.log("Generating animated GIF & MP4 demo via ffmpeg...");
		const gifPath = path.join(process.cwd(), "docs", "assets", "demo.gif");
		const mp4Path = path.join(process.cwd(), "docs", "assets", "demo.mp4");

		// Duplicate frames for smooth pacing
		await runCommand(
			`ffmpeg -y -framerate 0.65 -i "${framesDir}/frame_%02d.png" -vf "scale=1200:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" "${gifPath}"`,
		);

		await runCommand(
			`ffmpeg -y -framerate 0.65 -i "${framesDir}/frame_%02d.png" -c:v libx264 -pix_fmt yuv420p -vf "scale=1200:-2" "${mp4Path}"`,
		);

		console.log("Media generation completed successfully!");
	} finally {
		server.kill();
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
