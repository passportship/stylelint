'use strict';

const _ = require('lodash');
const rules = require('./rules');

// Rule settings can take a number of forms, e.g.
// a. "rule-name": null
// b. "rule-name": [null, ...]
// c. "rule-name": primaryOption
// d. "rule-name": [primaryOption]
// e. "rule-name": [primaryOption, secondaryOption]
// Where primaryOption can be anything: primitive, Object, or Array.

/**
 * This function normalizes all the possibilities into the
 * standard form: [primaryOption, secondaryOption]
 * Except in the cases with null, a & b, in which case
 * null is returned
 * @param {import('stylelint').StylelintConfigRuleSettings} rawSettings
 * @param {string} ruleName
 * @param {boolean} [primaryOptionArray] If primaryOptionArray is not provided, we try to get it from the, rules themselves, which will not work for plugins
 * @return {[any, Object] | Array<any | [any, Object]> | null}
 */
module.exports = function (
	rawSettings,
	ruleName,
	// If primaryOptionArray is not provided, we try to get it from the
	// rules themselves, which will not work for plugins
	primaryOptionArray,
) {
	if (rawSettings === null) {
		return null;
	}

	if (!Array.isArray(rawSettings)) {
		return [rawSettings];
	}
	// Everything below is an array ...

	if (rawSettings[0] === null) {
		return null;
	}

	if (primaryOptionArray === undefined) {
		const rule = rules[ruleName];

		primaryOptionArray = _.get(rule, 'primaryOptionArray');
	}

	if (!primaryOptionArray) {
		return rawSettings;
	}
	// Everything below is a rule that CAN have an array for a primary option ...
	// (they might also have something else, e.g. rule-properties-order can
	// have the string "alphabetical")

	if (rawSettings.length === 1 && Array.isArray(rawSettings[0])) {
		return rawSettings;
	}

	if (
		rawSettings.length === 2 &&
		!_.isPlainObject(rawSettings[0]) &&
		_.isPlainObject(rawSettings[1])
	) {
		return rawSettings;
	}

	return [rawSettings];
};
