# hello-wagi-as: AssemblyScript example of WAGI

_WAGI is the easiest way to get started doing cloud-side WASM web apps._

**WARNING:** This is experimental code put together on a whim.
It is not considered production-grade by its developers, neither is it "supported" software.
This is a project we wrote to demonstrate another way to use WASI.

> DeisLabs is experimenting with many WASM technologies right now.
> This is one of a multitude of projects (including [Krustlet](https://github.com/deislabs/krustlet))
> designed to test the limits of WebAssembly as a cloud-based runtime.

## What It Does

This is an example of WAGI. It is written in [AssemblyScript](https://www.assemblyscript.org/),
a WebAssembly-oriented dialect of TypeScript/JavaScript.

This demo exhibits how to write server-side WASM+WASI that handles HTTP requests.

## Building

- Clone this repo to `hello-wagi` and enter that directory.
- Use `npm i` to install all dependencies.
- Use `npm run asbuild` to build a WASM binary.

## Configuring and Running

We recommend using the [WAGI server](https://github.com/deislabs/wagi) to run this module.
In your `modules.toml` for the WAGI server, add the following:

```toml
[[module]]
route = "/as-hello"
module = "/path/to/hello-wagi/build/optimized.wasm"
```

Substitute the correct module path for wherever you cloned this repo.

At that point, you should be able to access this program at `http://localhost:3000/as-hello`
(Possibly substituting in your own domain and port, depending on the WAGI server).

You can use `curl` to test:

```console
$ curl -v http://localhost:3000/as-hello
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET /as-hello HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.64.1
> Accept: */*
> 
< HTTP/1.1 200 OK
< content-type: text-plain
< content-length: 32
< date: Tue, 13 Oct 2020 22:07:07 GMT
< 
hello world from localhost:3000
* Connection #0 to host localhost left intact
* Closing connection 0
```

And you can change the host and message:

```console
$ curl -v -H HOST:example.com http://localhost:3000/as-hello\?greet\=matt
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET /as-hello?greet=matt HTTP/1.1
> Host:example.com
> User-Agent: curl/7.64.1
> Accept: */*
> 
< HTTP/1.1 200 OK
< content-type: text-plain
< content-length: 28
< date: Tue, 13 Oct 2020 22:08:33 GMT
< 
hello matt from example.com
* Connection #0 to host localhost left intact
* Closing connection 0
```

You can omit the `-v` to just see the response body:

```console
$ curl -H HOST:example.com http://localhost:3000/as-hello\?greet\=matt
hello matt from example.com
```