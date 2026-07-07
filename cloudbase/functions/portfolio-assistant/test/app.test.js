const assert = require("node:assert/strict");
const test = require("node:test");

const { createApp } = require("../app");

async function withServer(app, callback) {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  try {
    await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

test("returns a DeepSeek answer for an allowed request", async () => {
  const fetchImpl = async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.model, "deepseek-v4-flash");
    assert.equal(body.thinking.type, "disabled");
    return Response.json({ choices: [{ message: { content: "她完成了 **PawCare** 等代表项目。" } }] });
  };
  const app = createApp({ fetchImpl, apiKey: "test-key" });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://jasmne666.github.io" },
      body: JSON.stringify({ question: "她有哪些代表作品？", history: [] }),
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://jasmne666.github.io");
    assert.deepEqual(await response.json(), {
      answer: "她完成了 PawCare 等代表项目。",
      model: "deepseek-v4-flash",
    });
  });
});

test("rejects unknown origins", async () => {
  const app = createApp({ apiKey: "test-key", fetchImpl: async () => Response.json({}) });
  await withServer(app, async (baseUrl) => {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://example.com" },
      body: JSON.stringify({ question: "她有哪些代表作品？" }),
    });
    assert.equal(response.status, 403);
  });
});

test("reports missing server-side configuration", async () => {
  const app = createApp({ apiKey: "", fetchImpl: async () => Response.json({}) });
  await withServer(app, async (baseUrl) => {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://jasmne666.github.io" },
      body: JSON.stringify({ question: "她有哪些代表作品？" }),
    });
    assert.equal(response.status, 503);
  });
});
