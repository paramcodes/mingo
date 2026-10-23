/**
 * Privacy-conscious product telemetry events.
 * Enforces data minimization: never includes user input, exercise answers, or PII.
 */

export type EventName =
	| "onboarding_completed"
	| "lesson_started"
	| "lesson_completed"
	| "review_completed"
	| "return_visit";

export interface TelemetryPayload {
	event: EventName;
	timestamp: string;
	learnerId?: string;
	properties: Record<string, string | number | boolean>;
}

const FORBIDDEN_PROPERTY_KEYS = [
	"password",
	"userAnswer",
	"answer",
	"email",
	"prompt",
	"input",
	"raw",
];

export function createTelemetryEvent(
	event: EventName,
	properties: Record<string, string | number | boolean> = {},
	learnerId?: string,
): TelemetryPayload {
	// Strip any accidentally passed sensitive keys
	const cleanProperties: Record<string, string | number | boolean> = {};

	for (const [key, value] of Object.entries(properties)) {
		const lowerKey = key.toLowerCase();
		const isForbidden = FORBIDDEN_PROPERTY_KEYS.some((fk) =>
			lowerKey.includes(fk),
		);
		if (!isForbidden) {
			cleanProperties[key] = value;
		}
	}

	return {
		event,
		timestamp: new Date().toISOString(),
		learnerId: learnerId ? hashLearnerId(learnerId) : undefined,
		properties: cleanProperties,
	};
}

function hashLearnerId(id: string): string {
	// Simple deterministic obfuscation for analytics
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = (hash << 5) - hash + id.charCodeAt(i);
		hash |= 0;
	}
	return `anon_${Math.abs(hash).toString(16)}`;
}

export function validateTelemetryPayload(
	payload: unknown,
): payload is TelemetryPayload {
	if (!payload || typeof payload !== "object") return false;
	const p = payload as Partial<TelemetryPayload>;

	if (
		!p.event ||
		![
			"onboarding_completed",
			"lesson_started",
			"lesson_completed",
			"review_completed",
			"return_visit",
		].includes(p.event)
	) {
		return false;
	}

	if (!p.timestamp || typeof p.timestamp !== "string") return false;
	if (!p.properties || typeof p.properties !== "object") return false;

	// Verify no forbidden keys exist in properties
	for (const key of Object.keys(p.properties)) {
		const lower = key.toLowerCase();
		if (FORBIDDEN_PROPERTY_KEYS.some((fk) => lower.includes(fk))) {
			return false;
		}
	}

	return true;
}
