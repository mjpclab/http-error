# http-error
This package is a http server to simulate network or server errors.

# Startup arguments
## -cert
Certificate file path.

## -key
Certificate key file path.

## -host
Host to listen on.

## -port
Port to listen on. Defaults to 8080.

## -root
Root directory for serving file content.

# Startup example
listen on port 3000
```sh
node src/index.js -port 3000
```

# Query string parameters

## stuck
Server respond nothing without closing the connection.

## reset
Server close connection without informing client.

## silent
Server close connection, send FIN to client.

## wait
Milliseconds delayed before sending response.

## status
Specify response status code.

## cors
Specify if respond CORS headers.

## location
Specify response Location header.

## type
Specify response Content-Type header.

## body
Specify response body instead of reading from file.

# Specify separated parameters for CORS preflight (OPTIONS method)
Prepending `_` before regular parameter name makes it as preflight only parameter,
and regular parameters has no more effect on preflight requests.

# Query string example
delay 3 seconds, and response with status 500:
```
http://localhost:8000/?wait=3000&status=500
```

delay 5 seconds for CORS preflight, and stuck for regular request:
```
http://localhost:8000/?_wait=5000&_cors&stuck
```
