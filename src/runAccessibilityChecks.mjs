import { normalizeFinding } from './normalizeFinding.mjs';

/**
 * @callback PluginFn
 * @param {object} context
 * @returns {Promise<object[]>|object[]}
 */

/**
 * @typedef {object} RunAccessibilityChecksOptions
 * @property {Document|object|null} [dom]
 * @property {() => Promise<boolean>} [ready]
 * @property {(target: unknown) => Promise<string>} [imageHandler]
 * @property {PluginFn[]} [plugins]
 */

/**
 * Orchestrates readiness and plugin execution for one DOM context.
 *
 * @param {RunAccessibilityChecksOptions} [options]
 * @returns {Promise<object[]>}
 */
const runAccessibilityChecks = async (options = {}) => {
	const { ready, plugins, dom, imageHandler } = normalizeOptions(options);
	const findings = [];
	const isReady = await ready();

	if (isReady === false) {
		return [];
	}

	for (const plugin of plugins) {
		const pluginResult = await plugin({
			dom,
			imageHandler,
		});

		if (!Array.isArray(pluginResult)) {
			throw new TypeError('plugins must return an array of findings.');
		}

		findings.push(...pluginResult);
	}

	return findings;
};

/**
 * Wraps a readiness hook with strict boolean-return validation.
 *
 * @param {() => Promise<boolean>} ready
 * @returns {() => Promise<boolean>}
 */
const wrapReadyHook = (ready) => {
	return async () => {
		const isReady = await ready();

		if (typeof isReady !== 'boolean') {
			throw new TypeError('ready must resolve to a boolean value.');
		}

		return isReady;
	};
};

/**
 * Wraps an image handler with strict string-return validation.
 *
 * @param {(target: unknown) => Promise<string>} imageHandler
 * @returns {(target: unknown) => Promise<string>}
 */
const wrapImageHandler = (imageHandler) => {
	return async (target) => {
		const imageUrl = await imageHandler(target);

		if (typeof imageUrl !== 'string') {
			throw new TypeError('imageHandler must resolve to a string URL.');
		}

		return imageUrl;
	};
};

/**
 * Creates a default readiness hook for browser and non-browser contexts.
 *
 * @param {Document|object|null} dom
 * @returns {() => Promise<boolean>}
 */
const createDefaultReady = (dom) => {
	const fallbackDocument = typeof document !== 'undefined' ? document : null;
	const activeDocument = dom ?? fallbackDocument;

	return async () => {
		if (!activeDocument) {
			return true;
		}

		if (activeDocument.readyState !== 'loading') {
			return true;
		}

		return new Promise((resolve) => {
			if (typeof activeDocument.addEventListener !== 'function') {
				resolve(true);
				return;
			}

			activeDocument.addEventListener(
				'DOMContentLoaded',
				() => resolve(true),
				{ once: true }
			);
		});
	};
};

/**
 * Validates and normalizes runtime options into a stable shape.
 *
 * @param {RunAccessibilityChecksOptions} options
 * @returns {RunAccessibilityChecksOptions}
 */
const normalizeOptions = (options) => {
	if (!options || typeof options !== 'object' || Array.isArray(options)) {
		throw new TypeError(
			'runAccessibilityChecks options must be an object.'
		);
	}

	if (options.ready === null) {
		throw new TypeError('ready must be a function when provided.');
	}

	if (options.imageHandler === null) {
		throw new TypeError('imageHandler must be a function when provided.');
	}

	if (options.plugins === null) {
		throw new TypeError('plugins must be an array when provided.');
	}

	// Keep this object shape stable for downstream execution.
	const normalized = {
		dom: options.dom ?? null,
		ready: options.ready ?? createDefaultReady(options.dom ?? null),
		imageHandler: options.imageHandler ?? undefined,
		plugins: options.plugins ?? [],
	};

	if (
		normalized.ready !== undefined &&
		typeof normalized.ready !== 'function'
	) {
		throw new TypeError('ready must be a function when provided.');
	}

	if (
		normalized.imageHandler !== undefined &&
		typeof normalized.imageHandler !== 'function'
	) {
		throw new TypeError('imageHandler must be a function when provided.');
	}

	normalized.ready = wrapReadyHook(normalized.ready);

	if (normalized.imageHandler) {
		normalized.imageHandler = wrapImageHandler(normalized.imageHandler);
	}

	if (!Array.isArray(normalized.plugins)) {
		throw new TypeError('plugins must be an array when provided.');
	}

	// Plugins are the extension point; each entry must be executable.
	normalized.plugins.forEach((testFn, index) => {
		if (typeof testFn !== 'function') {
			throw new TypeError(`plugins[${index}] must be a function.`);
		}
	});

	return normalized;
};

export { runAccessibilityChecks, normalizeOptions, normalizeFinding };
