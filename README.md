Simple Request
==============
A _really_ simple wrapper for native HTTP[S] clients.

This module encapsulates the boiler-plate task of aggregating chunked responses
from HTTP servers. It has a few simple helpers to stringify and parse JSON bodies,
set several required headers if not present, and wait automatically for a
`100 CONTINUE` head to send data if the `expect` parameter is passed in a request
method's `options` hash.

### Constructor
`var client = Request(params)`

#### Params (optional)
 * `protocol` Anything that matches Node.JS's [HTTP API](http://nodejs.org/docs/v0.8.19/api/http.html), specifically, [HTTP.request](http://nodejs.org/docs/v0.8.19/api/http.html#http_http_request_options_callback) Default is `HTTP`
 * `host` A default target for the client
 * `port` A default port for the target

### Request
`client.request(options, body, callback)`

#### Options
 * Anything supported by [HTTP.request](http://nodejs.org/docs/v0.8.19/api/http.html#http_http_request_options_callback)
 * `expect` Set the `Expect: 100-Continue` header, and don't send pay-load until the 100 head is received

#### Body
Must be an object that can be consumed by `JSON.stringify` or casted to a
string, or `null`

#### Callback
`function(error, response)` will be passed error objects, or the protocol's
response object. If the response contained a pay-load, it will be in string-form
in `response.data`. If the response `Content-Type` was `application/json[; ...]`,
the parsed object will be in `response.body`. In this case, an invalid JSON pay-load
will cause an error to be returned.

### Usage

    var Client = require('simple-request');
    var c = new Client(); // Default HTTP
    
    // For HTTPS, or an other interface that implements the same API:
    // var HTTPS = require('https');
    // var c = new Client(HTTPS);
    
    c.request({
        hostname : "google.com",
        port : 80,
        method : "GET",
        headers : {
            'x-foo-bar' : "Hello World"
        },
        path : "/search?q=define+chunked"
    }, function(err, res) {
        if(err) {
           console.log("Oh No");
           return;
       }
       
       console.log(res.data); // The response body is returned in the data attribute
       // If response header "Content-Type: application/json[; encoding=...]" is set,
       // res.body will contain the parsed object. 
    });
        

### Helper Methods
 * `get(path, [options, ]callback)`
 * `post(path, body, [options, ]callback)`
 * `put(path, body, [options, ]callback)`
 * 'delete(path, [options, ]callback)`

## License
Copyright (c) 2013 John Manero, Dynamic Network Services Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
