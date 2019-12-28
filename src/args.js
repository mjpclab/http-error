const process = require('process');

const defaultArg = {
	host: undefined,
	port: 8080,
	cert: undefined,
	key: undefined,
};

const availArgNames = Object.keys(defaultArg);

const RE_DASH_PREFIX = /^-+/;

const getArgName = arg => {
	const argName = arg.replace(RE_DASH_PREFIX, '');
	if (argName in defaultArg) {
		return argName;
	}

	const argNames = availArgNames.filter(name => name.startsWith(argName));
	if (argNames.length === 1) {
		return argNames[0];
	}
};

const parse = (...args) => {
	if (args.length === 0) {
		args = process.argv.slice(2);
	}

	const result = Object.assign({}, defaultArg);

	let argName = '';
	for (const arg of args) {
		const name = getArgName(arg);
		if (name) {
			argName = name;
			continue
		}

		if (argName) {
			result[argName] = arg
		}
	}

	return result;
};

module.exports = {
	parse
};
