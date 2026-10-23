/**
 * Zero-dependency Web Crypto password hashing and verification.
 */

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const saltHex = Array.from(salt)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		enc.encode(password),
		{ name: "PBKDF2" },
		false,
		["deriveBits"],
	);

	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		256,
	);

	const hashHex = Array.from(new Uint8Array(derivedBits))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
	password: string,
	storedHash: string,
): Promise<boolean> {
	const [saltHex, expectedHashHex] = storedHash.split(":");
	if (!saltHex || !expectedHashHex) return false;

	const salt = new Uint8Array(
		saltHex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) || [],
	);

	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		enc.encode(password),
		{ name: "PBKDF2" },
		false,
		["deriveBits"],
	);

	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		256,
	);

	const hashHex = Array.from(new Uint8Array(derivedBits))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return hashHex === expectedHashHex;
}
