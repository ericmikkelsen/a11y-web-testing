import test from 'node:test';
import assert from 'node:assert/strict';

import {
	runAccessibilityChecks,
	normalizeOptions,
	normalizeFinding,
} from './index.mjs';

// Entry-point contract behavior.

test('runAccessibilityChecks returns an array for a valid contract shape', async () => {
	const results = await runAccessibilityChecks({
		plugins: [() => []],
		ready: async () => true,
	});

	assert.deepEqual(results, []);
});

test('public API exports contract functions', () => {
	assert.equal(typeof runAccessibilityChecks, 'function');
	assert.equal(typeof normalizeOptions, 'function');
	assert.equal(typeof normalizeFinding, 'function');
});

test('runAccessibilityChecks returns a serializable results payload', async () => {
	const results = await runAccessibilityChecks({
		plugins: [() => []],
		ready: async () => true,
	});

	const serialized = JSON.stringify(results);

	assert.equal(typeof serialized, 'string');
	assert.deepEqual(JSON.parse(serialized), []);
});

test('runAccessibilityChecks rejects non-object options', async () => {
	await assert.rejects(runAccessibilityChecks(null), {
		message: 'runAccessibilityChecks options must be an object.',
	});
});

test('runAccessibilityChecks waits for ready before invoking plugins', async () => {
	const events = [];
	let resolveReady;
	const readyGate = new Promise((resolve) => {
		resolveReady = resolve;
	});

	const runPromise = runAccessibilityChecks({
		ready: async () => {
			events.push('ready');
			await readyGate;
			return true;
		},
		plugins: [() => {
			events.push('plugin');
			return [];
		}],
	});

	await Promise.resolve();
	assert.deepEqual(events, ['ready']);

	resolveReady(true);
	await runPromise;

	assert.deepEqual(events, ['ready', 'plugin']);
});

test('runAccessibilityChecks returns no findings when ready resolves false', async () => {
	let pluginCalled = false;

	const results = await runAccessibilityChecks({
		ready: async () => false,
		plugins: [() => {
			pluginCalled = true;
			return [{ ruleId: 'should-not-run' }];
		}],
	});

	assert.equal(pluginCalled, false);
	assert.deepEqual(results, []);
});

test('runAccessibilityChecks rejects non-boolean ready return values', async () => {
	await assert.rejects(
		runAccessibilityChecks({
			ready: async () => 'yes',
			plugins: [() => []],
		}),
		{
			message: 'ready must resolve to a boolean value.',
		}
	);
});

test('runAccessibilityChecks passes dom and imageHandler into plugins', async () => {
	const dom = { nodeType: 9 };
	const imageHandler = async () => 'https://example.com/image.png';
	let receivedContext;

	await runAccessibilityChecks({
		dom,
		imageHandler,
		ready: async () => true,
		plugins: [async (context) => {
			receivedContext = context;
			return [];
		}],
	});

	assert.equal(receivedContext.dom, dom);
	assert.equal(typeof receivedContext.imageHandler, 'function');
	assert.equal(
		await receivedContext.imageHandler('target'),
		'https://example.com/image.png'
	);
});

test('runAccessibilityChecks rejects non-string imageHandler return values', async () => {
	await assert.rejects(
		runAccessibilityChecks({
			ready: async () => true,
			imageHandler: async () => 42,
			plugins: [async ({ imageHandler }) => {
				await imageHandler('target');
				return [];
			}],
		}),
		{
			message: 'imageHandler must resolve to a string URL.',
		}
	);
});

test('runAccessibilityChecks combines plugin outputs in order', async () => {
	const results = await runAccessibilityChecks({
		ready: async () => true,
		plugins: [
			() => [{ ruleId: 'first' }],
			async () => [{ ruleId: 'second' }, { ruleId: 'third' }],
		],
	});

	assert.deepEqual(results, [
		{ ruleId: 'first' },
		{ ruleId: 'second' },
		{ ruleId: 'third' },
	]);
});

test('runAccessibilityChecks rejects non-array plugin output', async () => {
	await assert.rejects(
		runAccessibilityChecks({
			ready: async () => true,
			plugins: [() => ({ ruleId: 'invalid-shape' })],
		}),
		{
			message: 'plugins must return an array of findings.',
		}
	);
});

test('runAccessibilityChecks surfaces plugin errors', async () => {
	await assert.rejects(
		runAccessibilityChecks({
			ready: async () => true,
			plugins: [() => {
				throw new Error('plugin failed');
			}],
		}),
		{
			message: 'plugin failed',
		}
	);
});

test('normalizeOptions validates function hooks and plugins', () => {
	const normalized = normalizeOptions({
		dom: { nodeType: 9 },
		ready: async () => true,
		imageHandler: async () => 'https://example.com/image.png',
		plugins: [() => []],
	});

	assert.equal(normalized.plugins.length, 1);
	assert.equal(typeof normalized.ready, 'function');
	assert.equal(typeof normalized.imageHandler, 'function');
});

test('normalizeOptions sets default ready hook and optional imageHandler', async () => {
	const normalized = normalizeOptions({ plugins: [] });

	assert.equal(typeof normalized.ready, 'function');
	assert.equal(normalized.imageHandler, undefined);
	assert.equal(await normalized.ready(), true);
});

test('normalizeOptions default ready waits for DOMContentLoaded when loading', async () => {
	let domReadyHandler;
	const fakeDocument = {
		readyState: 'loading',
		addEventListener: (eventName, handler) => {
			if (eventName === 'DOMContentLoaded') {
				domReadyHandler = handler;
			}
		},
	};

	const normalized = normalizeOptions({ dom: fakeDocument, plugins: [] });
	const readyPromise = normalized.ready();

	assert.equal(typeof domReadyHandler, 'function');
	domReadyHandler();

	assert.equal(await readyPromise, true);
});

// Guardrails for invalid option shapes.

test('normalizeOptions defaults plugins to an empty array when missing or invalid', () => {
	const warnings = [];
	const originalWarn = console.warn;

	console.warn = (message) => warnings.push(message);

	try {
		assert.deepEqual(normalizeOptions({}).plugins, []);
		assert.deepEqual(normalizeOptions({ plugins: 'not-an-array' }).plugins, []);
		assert.deepEqual(normalizeOptions({ plugins: null }).plugins, []);

		assert.deepEqual(normalizeOptions({ plugins: ['not-a-function'] }).plugins, []);
	} finally {
		console.warn = originalWarn;
	}

	assert.deepEqual(warnings, [
		'plugins must be an array; using none.',
		'plugins must be an array; using none.',
		'plugins[0] must be a function; skipping it.',
	]);
});

test('normalizeOptions ignores unknown options for forward compatibility', () => {
	const normalized = normalizeOptions({
		plugins: [],
		futureOption: true,
	});

	assert.deepEqual(normalized.plugins, []);
});

// Finding schema normalization and validation.

test('normalizeFinding returns a stable serializable schema', () => {
	const normalizedFinding = normalizeFinding({
		violation: true,
		wcagVersion: '2.2',
		ruleId: 'img-alt-text',
		rule: 'Images must have meaningful alternative text',
		message: 'Image is missing alt text',
		target: 'img#logo',
		url: 'https://example.com/#:~:text=logo',
		wcagURL:
			'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
	});

	assert.deepEqual(normalizedFinding, {
		violation: true,
		wcagVersion: '2.2',
		ruleId: 'img-alt-text',
		rule: 'Images must have meaningful alternative text',
		message: 'Image is missing alt text',
		target: 'img#logo',
		url: 'https://example.com/#:~:text=logo',
		wcagURL:
			'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html',
	});
});

test('normalizeFinding validates required enum and string fields', () => {
	assert.throws(
		() =>
			normalizeFinding({
				violation: 'yes',
				wcagVersion: '2.2',
				ruleId: 'rule',
				rule: 'rule',
				message: 'message',
				url: 'https://example.com',
			}),
		{
			message: "Finding violation must be true, false, or 'check'.",
		}
	);

	assert.throws(
		() =>
			normalizeFinding({
				violation: true,
				wcagVersion: '3.0',
				ruleId: 'rule',
				rule: 'rule',
				message: 'message',
				url: 'https://example.com',
			}),
		{
			message:
				"Finding wcagVersion must be '2.0', '2.1', '2.2', or false.",
		}
	);

	assert.throws(
		() =>
			normalizeFinding({
				violation: true,
				wcagVersion: '2.2',
				ruleId: 42,
				rule: 'rule',
				message: 'message',
				url: 'https://example.com',
			}),
		{
			message: 'Required finding fields must be strings.',
		}
	);
});

test('normalizeFinding trims text and normalizes missing optional fields', () => {
	const normalizedFinding = normalizeFinding({
		violation: 'check',
		wcagVersion: false,
		ruleId: '  aria-label-missing  ',
		rule: '  Form controls must have labels  ',
		message: '  Input is missing an accessible name  ',
		url: '  https://example.com/form  ',
	});

	assert.deepEqual(normalizedFinding, {
		violation: 'check',
		wcagVersion: false,
		ruleId: 'aria-label-missing',
		rule: 'Form controls must have labels',
		message: 'Input is missing an accessible name',
		target: null,
		url: 'https://example.com/form',
		wcagURL: null,
	});
});
