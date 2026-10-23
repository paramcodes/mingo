import { NextResponse } from "next/server";
import {
	createTelemetryEvent,
	validateTelemetryPayload,
} from "@/shared/telemetry/events";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { event, properties, learnerId } = body;

		const payload = createTelemetryEvent(event, properties, learnerId);

		if (!validateTelemetryPayload(payload)) {
			return NextResponse.json(
				{ error: "Invalid telemetry payload" },
				{ status: 400 },
			);
		}

		// Structured logger output for privacy-conscious telemetry
		console.log(`[telemetry] ${JSON.stringify(payload)}`);

		return NextResponse.json({ success: true });
	} catch (_err) {
		return NextResponse.json({ error: "Failed to log event" }, { status: 400 });
	}
}
