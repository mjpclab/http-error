#!/usr/bin/env node
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');

const args = require('./args');
const appOptions = args.parse();
const {host, port, cert, key} = appOptions;

const corsHeaders = {
	'access-control-allow-credentials': 'true',
	'access-control-allow-origin': '*',
	'access-control-allow-methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS, TRACE, CONNECT'
};

function onRequest(req, res) {
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
	const query = reqUrl.query;

	if (query.stuck) {
		return;
	}

	const status = isFinite(query.status) ? parseInt(query.status) : 200;

	const headers = {};

	if (query.cors) {
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

	const body = query.body || '';

	const serve = function() {
		if (query.reset) {
			socket.destroy();
			return;
		}

		if (query.silent) {
			socket.end();
			return;
		}

		const date = (new Date()).toUTCString();
		headers['date'] = date;

		res.writeHead(status, headers);
		res.end(body);
	};

	if (isFinite(query.wait)) {
		const wait = parseInt(query.wait);
		setTimeout(serve, wait);
		return;
	}

	serve();
}

let server;
if (cert && key) {
	server = https.createServer({
		cert: fs.readFileSync(cert),
		key: fs.readFileSync(key)
	})
} else {
	server = http.createServer()
}
server.on('request', onRequest);
server.listen(port, host);
