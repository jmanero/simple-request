Simple Request
==============
A _really_ simple wrapper for native HTTP[S] clients.

This module encapsulates the boiler-plate task of aggregating chunked responses
from HTTP servers. It has a few simple helpers to stringify and parse JSON bodies
and set several required headers if not present.

### Usage

    var Client = require('simple-request');
    var c = new Client(); // Default HTTP
    
    // For HTTPS, or an other interface that implements the same API:
    // var HTTPS = require('https');
    // var c = new Client(HTTPS);
    
    // To disable auto-generation of HTTP headers:
    // var SomeProto = require('some-proto');
    // var c = new Client(SomeProto, false);
    
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
