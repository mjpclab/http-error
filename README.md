This package is a http server to simulate network or server errors.

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

## type
Specify response Content-Type.

## body
Specify response body.
