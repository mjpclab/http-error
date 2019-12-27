#!/usr/bin/env node
const http = require('http');
const https = require('https');
const fs = require('fs');

const args = require('./args');
const requestHandler = require('./handler');

const {host, port, cert, key} = args.parse();

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
server.on('request', requestHandler);
server.listen(port, host);
