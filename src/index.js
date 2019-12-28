#!/usr/bin/env node

const http = require('http');
const https = require('https');
const fs = require('fs');
const process = require('process');

const parseArgs = require('./args');
const getHandler = require('./handler');

const {host, port, cert, key, root} = parseArgs();

let server;
if (cert && key) {
	server = https.createServer({
		cert: fs.readFileSync(cert),
		key: fs.readFileSync(key),
	})
} else {
	server = http.createServer()
}

server.timeout = 0;
const handler = getHandler({
	root: root || process.cwd()
});
server.on('request', handler);

server.listen(port, host);
