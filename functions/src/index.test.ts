import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev("src/index.ts", {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("should return a json with a svg", async () => {
		const resp = await worker.fetch();
		console.log(resp)
		if (resp) {
			expect(resp.status).toBe(405);
			expect(await resp.text()).toBe("Method not allowed");
		}
	});
});
