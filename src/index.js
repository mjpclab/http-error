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

function getInitData(query) {
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

	const body = query.body || '';

	return {
		status,
		headers,
		body
	}
}

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

	if (query.stuck !== undefined) {
		return;
	}

	const serve = function() {
		if (query.reset !== undefined) {
			socket.destroy();
			return;
		}

		if (query.silent !== undefined) {
			socket.end();
			return;
		}

		const {status, headers, body} = getInitData(query);

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
server.timeout = 0;
server.on('request', onRequest);
server.listen(port, host);
