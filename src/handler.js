const url = require('url');

const corsHeaders = {
	'access-control-allow-credentials': 'true',
	'access-control-allow-origin': '*',
	'access-control-allow-methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS, TRACE, CONNECT'
};

const getQuery = (req, rawQuery) => {
	let query = rawQuery;

	if (req.method === 'OPTIONS') {
		let hasPreflightQuery = false;
		const preflightQuery = {};
		for (const [key, value] of Object.entries(query)) {
			if (key[0] === '_') {
				hasPreflightQuery = true;
				preflightQuery[key.substr(1)] = value;
			}
		}
		if (hasPreflightQuery) {
			query = preflightQuery
		}
	}

	return query;
};

const getInitData = (req, query) => {
	const status = isFinite(query.status) ? parseInt(query.status) : 200;

	const headers = {};

	if (query.cors !== undefined) {
		Object.assign(headers, corsHeaders);
		const reqCorsHeaders = req.headers['access-control-request-headers'];
		if (reqCorsHeaders) {
			headers['access-control-allow-headers'] = reqCorsHeaders;
		}
	}

	if (query.type) {
		headers['content-type'] = query.type;
	}

	if (query.location) {
		headers['location'] = query.location;
	}

	headers['date'] = (new Date()).toUTCString();

	const body = query.body;

	return {
		status,
		headers,
		body
	}
};

const handler = (req, res, options) => {
	/*
	query
	 - stuck
	 - reset
	 - silent
	 - wait

	 - status
	 - cors
	 - location
	 - type
	 - body
	 */

	const socket = req.socket;
	const reqUrl = url.parse(req.url, true);
	const query = getQuery(req, reqUrl.query);

	if (query.stuck !== undefined) {
		return;
	}

	const serve = function () {
		if (query.reset !== undefined) {
			socket.destroy();
			return;
		}

		if (query.silent !== undefined) {
			socket.end();
			return;
		}

		const {status, headers, body} = getInitData(req, query);

		res.writeHead(status, headers);
		res.end(body);
	};

	if (isFinite(query.wait)) {
		const wait = parseInt(query.wait);
		setTimeout(serve, wait);
	} else {
		serve();
	}
};

const getHandler = options => (req, res) => handler(req, res, options);

module.exports = getHandler;
