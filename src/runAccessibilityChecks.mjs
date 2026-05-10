import { normalizeFinding } from "./normalizeFinding.mjs";

/**
 * @typedef {object} RunAccessibilityChecksOptions
 * @property {Document|object|null} [dom]
 * @property {() => Promise<boolean>} [ready]
 * @property {(target: unknown) => Promise<string>} [imageHandler]
 * @property {Array<(context: object) => Promise<object[]|object>|object[]|object>} [plugins]
 */

/**
 * Contract-first entrypoint. Chapter 01 validates input and preserves a stable API.
 * Later chapters execute hooks and tests.
 *
 * @param {RunAccessibilityChecksOptions} [options]
 * @returns {Promise<object[]>}
 */
const runAccessibilityChecks = async (options = {}) => {
  // This entrypoint currently validates and normalizes the public contract.
  const normalizedOptions = normalizeOptions(options);

  void normalizedOptions;

  return [];
};

/**
 * @param {RunAccessibilityChecksOptions} options
 * @returns {RunAccessibilityChecksOptions}
 */
const normalizeOptions = (options) => {
  if (!options || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("runAccessibilityChecks options must be an object.");
  }

  // Keep this object shape stable for downstream execution and serialization.
  const normalized = {
    dom: options.dom ?? null,
    ready: options.ready,
    imageHandler: options.imageHandler,
    plugins: options.plugins ?? [],
  };

  if (normalized.ready !== undefined && typeof normalized.ready !== "function") {
    throw new TypeError("ready must be a function when provided.");
  }

  if (normalized.imageHandler !== undefined && typeof normalized.imageHandler !== "function") {
    throw new TypeError("imageHandler must be a function when provided.");
  }

  if (!Array.isArray(normalized.plugins)) {
    throw new TypeError("plugins must be an array when provided.");
  }

  // Plugins are the extension point; each entry must be executable.
  normalized.plugins.forEach((testFn, index) => {
    if (typeof testFn !== "function") {
      throw new TypeError(`plugins[${index}] must be a function.`);
    }
  });

  return normalized;
};

export { runAccessibilityChecks, normalizeOptions, normalizeFinding };