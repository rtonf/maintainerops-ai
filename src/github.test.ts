import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { fetchPullRequestWorkItem } from "./github.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.GITHUB_TOKEN;
});

test("fetchPullRequestWorkItem paginates changed files", async () => {
  const requestedUrls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    requestedUrls.push(url);

    if (url.endsWith("/repos/owner/repo/pulls/7")) {
      return jsonResponse({
        number: 7,
        title: "Large PR",
        body: "body",
        html_url: "https://github.com/owner/repo/pull/7",
        user: { login: "maintainer" },
        labels: []
      });
    }

    if (url.endsWith("/repos/owner/repo/pulls/7/files?per_page=100&page=1")) {
      return jsonResponse(
        Array.from({ length: 100 }, (_, index) => ({
          filename: `src/file-${index}.ts`,
          status: "modified",
          patch: `@@ file ${index}`
        }))
      );
    }

    if (url.endsWith("/repos/owner/repo/pulls/7/files?per_page=100&page=2")) {
      return jsonResponse([{ filename: "src/file-100.ts", status: "added", patch: "@@ file 100" }]);
    }

    throw new Error(`unexpected fetch: ${url}`);
  }) as typeof fetch;

  const item = await fetchPullRequestWorkItem("owner/repo", 7);

  assert.equal(item.files?.length, 101);
  assert.equal(item.files?.at(-1)?.path, "src/file-100.ts");
  assert.equal(item.files?.at(-1)?.patch, "@@ file 100");
  assert.equal(item.diff, undefined);
  assert.equal(requestedUrls.filter((url) => url.includes("/files?")).length, 2);
});

test("fetchPullRequestWorkItem caps changed file pagination", async () => {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);

    if (url.endsWith("/repos/owner/repo/pulls/8")) {
      return jsonResponse({
        number: 8,
        title: "Huge PR",
        body: "body",
        html_url: "https://github.com/owner/repo/pull/8",
        user: { login: "maintainer" },
        labels: []
      });
    }

    if (url.includes("/repos/owner/repo/pulls/8/files?")) {
      return jsonResponse(
        Array.from({ length: 100 }, (_, index) => ({
          filename: `src/huge-${index}.ts`,
          status: "modified",
          patch: `@@ huge ${index}`
        }))
      );
    }

    throw new Error(`unexpected fetch: ${url}`);
  }) as typeof fetch;

  await assert.rejects(() => fetchPullRequestWorkItem("owner/repo", 8), /Pull request file list exceeds 3000 files/);
});

test("fetchPullRequestWorkItem does not include GitHub response body in errors", async () => {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ message: "secret diagnostic body" }), {
      status: 403,
      statusText: "Forbidden",
      headers: { "content-type": "application/json" }
    })) as typeof fetch;

  await assert.rejects(
    () => fetchPullRequestWorkItem("owner/repo", 9),
    (error) => {
      assert(error instanceof Error);
      assert.match(error.message, /GitHub API error 403 Forbidden/);
      assert.doesNotMatch(error.message, /secret diagnostic body/);
      return true;
    }
  );
});

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}
