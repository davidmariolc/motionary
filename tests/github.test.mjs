import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchRepositoryStars, repositoryUrl } from "../lib/github.ts";

const zeroStars = 0;
const multipleStars = 1234;

test("the GitHub button links to the public Motionary repository", () => {
  assert.equal(repositoryUrl, "https://github.com/davidmariolc/motionary");
});

for (const count of [zeroStars, multipleStars]) {
  test(`repository stars accept ${count} without requiring credentials`, async (context) => {
    context.mock.method(globalThis, "fetch", (url, options) => {
      assert.equal(url, "https://api.github.com/repos/davidmariolc/motionary");
      assert.equal(options.headers.Authorization, undefined);
      assert.ok(options.signal instanceof AbortSignal);
      return Promise.resolve(new Response(`{"stargazers_count": ${count}}`));
    });
    assert.equal(await fetchRepositoryStars(), count);
  });
}

test("repository stars reject rate limits and network failures", async (context) => {
  context.mock.method(globalThis, "fetch", () =>
    Promise.resolve(new Response(null, { status: 429 }))
  );
  await assert.rejects(
    fetchRepositoryStars(),
    /GitHub repository request failed/u
  );
  context.mock.restoreAll();
  context.mock.method(globalThis, "fetch", () =>
    Promise.reject(new TypeError("Network unavailable"))
  );
  await assert.rejects(fetchRepositoryStars(), /Network unavailable/u);
});

for (const payload of [
  "null",
  "{}",
  '{"stargazers_count": -1}',
  '{"stargazers_count": 1.5}',
  '{"stargazers_count": "12"}',
]) {
  test(`repository stars reject invalid payload ${payload}`, async (context) => {
    context.mock.method(globalThis, "fetch", () => {
      return Promise.resolve(
        new Response(payload, {
          headers: { "Content-Type": "application/json" },
        })
      );
    });
    await assert.rejects(fetchRepositoryStars(), /invalid star count/u);
  });
}
