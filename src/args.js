const process = require('process');

const defaultArg = {
	host: undefined,
	port: 8080,
	cert: undefined,
	key: undefined
};

const RE_DASH_PREFIX = /^-+/;

function parse(...args) {
	if (args.length === 0) {
		args = process.argv.slice(2);
	}

	const result = Object.assign({}, defaultArg);

	let argName = '';
	for (const arg of args) {
		const argNoDash = arg.replace(RE_DASH_PREFIX, '');
		if (argNoDash in defaultArg) {
			argName = argNoDash;
			continue
		}

		if (argName) {
			result[argName] = arg
		}
	}

	return result;
}

module.exports = {
	parse
};
