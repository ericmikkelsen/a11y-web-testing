const VALID_VIOLATION_VALUES = new Set([true, false, "check"]);
const VALID_WCAG_VERSIONS = new Set(["2.0", "2.1", "2.2", false]);

/**
 * Normalizes one finding into a stable serializable shape.
 *
 * @param {object} finding
 * @returns {object}
 */
const normalizeFinding = (finding) => {
  if (!finding || typeof finding !== "object" || Array.isArray(finding)) {
    throw new TypeError("Finding must be an object.");
  }

  const violation = normalizeViolation(finding.violation);
  const wcagVersion = normalizeWcagVersion(finding.wcagVersion);

  return {
    violation,
    wcagVersion,
    ruleId: asString(finding.ruleId),
    rule: asString(finding.rule),
    message: asString(finding.message),
    target: asNullableString(finding.target),
    url: asString(finding.url),
    wcagURL: asNullableString(finding.wcagURL),
  };
};

const normalizeViolation = (value) => {
  if (VALID_VIOLATION_VALUES.has(value)) {
    return value;
  }

  throw new TypeError("Finding violation must be true, false, or 'check'.");
};

const normalizeWcagVersion = (value) => {
  if (VALID_WCAG_VERSIONS.has(value)) {
    return value;
  }

  throw new TypeError("Finding wcagVersion must be '2.0', '2.1', '2.2', or false.");
};

const asString = (value) => {
  if (typeof value !== "string") {
    throw new TypeError("Finding fields must be strings when present.");
  }

  return value.trim();
};

const asNullableString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new TypeError("Optional finding fields must be strings when present.");
  }

  return value.trim();
};

module.exports = {
  normalizeFinding,
};