import { describe, expect, it } from "bun:test";
import { hashPassword, verifyPassword } from "./auth.crypto";

describe("auth.crypto", () => {
	it("hashes password and verifies successfully", async () => {
		const password = "SuperSecretPassword123!";
		const hash = await hashPassword(password);

		expect(hash).toContain(":");
		const isMatch = await verifyPassword(password, hash);
		expect(isMatch).toBe(true);
	});

	it("rejects invalid passwords", async () => {
		const hash = await hashPassword("RightPassword");
		const isMatch = await verifyPassword("WrongPassword", hash);
		expect(isMatch).toBe(false);
	});

	it("handles malformed hash strings gracefully", async () => {
		expect(await verifyPassword("foo", "")).toBe(false);
		expect(await verifyPassword("foo", "invalidhashformat")).toBe(false);
	});
});
