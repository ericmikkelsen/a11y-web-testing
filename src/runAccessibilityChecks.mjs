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

		findings.push(...pluginResult.map(normalizeFinding));
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

	const normalizedDom = options.dom ?? null;
	let ready = createDefaultReady(normalizedDom);
	let imageHandler;
	let plugins = [];

	if (typeof options.ready === 'function') {
		ready = options.ready;
	} else if (options.ready !== undefined) {
		console.warn('ready must be a function; using default ready.');
	}

	if (typeof options.imageHandler === 'function') {
		imageHandler = options.imageHandler;
	} else if (options.imageHandler !== undefined) {
		console.warn('imageHandler must be a function; skipping it.');
	}

	if (Array.isArray(options.plugins)) {
		plugins = options.plugins;
	} else if (options.plugins !== undefined) {
		console.warn('plugins must be an array; using none.');
	}

	// Keep this object shape stable for downstream execution.
	const normalized = {
		dom: normalizedDom,
		ready,
		imageHandler,
		plugins,
	};

	normalized.ready = wrapReadyHook(normalized.ready);

	if (normalized.imageHandler) {
		normalized.imageHandler = wrapImageHandler(normalized.imageHandler);
	}

	// Plugins are the extension point; each entry must be executable.
	normalized.plugins = normalized.plugins.filter((testFn, index) => {
		if (typeof testFn === 'function') {
			return true;
		}

		console.warn(`plugins[${index}] must be a function; skipping it.`);
		return false;
	});

	return normalized;
};

export { runAccessibilityChecks, normalizeOptions, normalizeFinding };
