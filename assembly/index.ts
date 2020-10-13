/*
 * This script shows how to do some simple things with WAGI and WASI.
 *
 * We get access to HTTP headers from the `Environ` object.
 * We get access to query parameters from the `CommandLine` object.
 * We write data back to the client using `Console.log`, and we write data to the error
 * log using `Console.error`.
 */
import "wasi";
import { Console, Environ, CommandLine } from "as-wasi";

// Sending to Console.log is essentially sending to STDOUT. In WAGI, as in CGI, the first
// section of the response MUST be a header. And in the header, it MUST contain either
// 'content-type' or 'location'. If neither of those is present, it will cause a
// 500 Internal Server Error.
Console.log("content-type: text/plain");
Console.log(""); // A blank line separates headers from body.

// This sends a message to the server's log.
Console.error("Module loaded.");

// Any call to Console.log after this will be written to the HTTP response body and sent
// to the client.

// Get a handle to the environment variables.
let env = new Environ();

// Get the 'Host' header from the HTTP request. Note that all HTTP headers are prefixed
// with 'HTTP_'
let host = env.get("HTTP_HOST");

// This is how we get information from the query string.
// If the query string contains `greet=NAME`, then we will replace 'world' with the name.
// For example, http://localhost/greet=matt will set `greet` to be "matt"
let vars = parseArgs();
let greet = "world";
if (vars.has("greet")) {
  greet = vars.get("greet");
}

// Now we will send the message hello NAME from HOST.
// If name and host are not set, it will be "hello world from unknown host".
Console.log("hello " + greet + " from " + defstr(host, "unknown host"));

// Load the arguments and parse the query string values out of them.
//
// In WAGI (as in CGI), the query parameters from a query string are parsed into name/value
// pairs and appended to the args. The first arg is the URI's path component, and the rest
// are query params expressed as arguments.
//
// So http://example.com/as-env?greet=matt&foo=bar creates an arg list that looks like
// `["/as-env", "greet=matt", "foo=bar"]`. This function parses out the name/value pairs
// and returns a map like `{"greet": "matt", "foo": "nar"}`.
function parseArgs(): Map<string, string> {
  let vars = new Map<string, string>();
  let cl = new CommandLine();
  let args = cl.all();

  // Parse all of the args into name/value pairs.
  // We skip the first arg b/c that is just the WASM path (as in POSIX args).
  if (args.length > 1) {
    for (let i = 1; i < args.length; i++) {
      let pair = args[i].split("=");
      if (pair.length == 2) {
        vars.set(pair[0], pair[1]);
      }
    }
  }

  return vars;
}

// Utility function for getting a default string.
function defstr(input: string | null, defaultValue: string): string {
  return input === null ? defaultValue : input;
}