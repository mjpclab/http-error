#!/usr/bin/env node

const http = require('http');
const https = require('https');
const fs = require('fs');

const parseArgs = require('./args');
const getHandler = require('./handler');

const {host, port, cert, key} = parseArgs();

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
server.on('request', getHandler());
server.listen(port, host);
