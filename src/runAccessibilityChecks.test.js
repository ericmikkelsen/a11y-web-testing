const test = require("node:test");
const assert = require("node:assert/strict");

const {
  runAccessibilityChecks,
  normalizeOptions,
  normalizeFinding,
} = require("./runAccessibilityChecks");

// Entry-point contract behavior.

test("runAccessibilityChecks returns an array for a valid contract shape", async () => {
  const results = await runAccessibilityChecks({
    plugins: [() => []],
    ready: async () => true,
  });

  assert.deepEqual(results, []);
});

test("normalizeOptions validates function hooks and plugins", () => {
  const normalized = normalizeOptions({
    dom: { nodeType: 9 },
    ready: async () => true,
    imageHandler: async () => "https://example.com/image.png",
    plugins: [() => []],
  });

  assert.equal(normalized.plugins.length, 1);
  assert.equal(typeof normalized.ready, "function");
  assert.equal(typeof normalized.imageHandler, "function");
});

// Guardrails for invalid option shapes.

test("normalizeOptions rejects invalid plugins values", () => {
  assert.throws(() => normalizeOptions({ plugins: "not-an-array" }), {
    message: "plugins must be an array when provided.",
  });

  assert.throws(() => normalizeOptions({ plugins: ["not-a-function"] }), {
    message: "plugins[0] must be a function.",
  });
});

test("normalizeOptions ignores unknown options for forward compatibility", () => {
  const normalized = normalizeOptions({
    plugins: [],
    futureOption: true,
  });

  assert.deepEqual(normalized.plugins, []);
});

// Finding schema normalization and validation.

test("normalizeFinding returns a stable serializable schema", () => {
  const normalizedFinding = normalizeFinding({
    violation: true,
    wcagVersion: "2.2",
    ruleId: "img-alt-text",
    rule: "Images must have meaningful alternative text",
    message: "Image is missing alt text",
    target: "img#logo",
    url: "https://example.com/#:~:text=logo",
    wcagURL: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  });

  assert.deepEqual(normalizedFinding, {
    violation: true,
    wcagVersion: "2.2",
    ruleId: "img-alt-text",
    rule: "Images must have meaningful alternative text",
    message: "Image is missing alt text",
    target: "img#logo",
    url: "https://example.com/#:~:text=logo",
    wcagURL: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  });
});

test("normalizeFinding validates required enum and string fields", () => {
  assert.throws(
    () =>
      normalizeFinding({
        violation: "yes",
        wcagVersion: "2.2",
        ruleId: "rule",
        rule: "rule",
        message: "message",
        url: "https://example.com",
      }),
    {
      message: "Finding violation must be true, false, or 'check'.",
    },
  );

  assert.throws(
    () =>
      normalizeFinding({
        violation: true,
        wcagVersion: "3.0",
        ruleId: "rule",
        rule: "rule",
        message: "message",
        url: "https://example.com",
      }),
    {
      message: "Finding wcagVersion must be '2.0', '2.1', '2.2', or false.",
    },
  );

  assert.throws(
    () =>
      normalizeFinding({
        violation: true,
        wcagVersion: "2.2",
        ruleId: 42,
        rule: "rule",
        message: "message",
        url: "https://example.com",
      }),
    {
      message: "Finding fields must be strings when present.",
    },
  );
});