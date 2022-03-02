# gRPC-LiveChat-App

a gRPC live chat application with both a go client and a web client using gRPC, go, gRPC-web, envoy, redis, and next js.

It is currently not possible to use gRPC in the browser due to limitations from the browser’s APIs. Therefore, a reverse proxy needs to be used to make the gRPC calls for us. How this works is that the browser sends an HTTP 1.1 request to envoy (reverse proxy) and envoy makes the gRPC call to our server using HTTP 2 and returns the request to the web client using HTTP 1.1.

Since gRPC web only supports unary requests and server side streaming, redis pubsub was used to send messages to clients in real time.

How it works is when the client first joins the chat application, the server returns a messages stream that sends messages as they come from the redis channel we subscribed to. When a client sends a message, that message is published and all current subscribers will recieve them and send them through the stream.
