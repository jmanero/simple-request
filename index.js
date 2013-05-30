var HTTP = require('http');
var QS = require('querystring');

var Client = module.exports = function(params) {
	params = params || {};

	this.protocol = params.protocol || HTTP;

	this.host = params.host;
	this.port = params.port;
};

Client.prototype.request = function(options, body, callback) {
	var data = false;

	// Defaults
	options.hostname = options.hostname || options.host || this.host;
	options.port = options.port || this.port;
	options.headers = options.headers || {};
	if(options.expect) {
		headers['Expect'] = "100-Continue";
	}
	options.path = options.path || '/';
	if (options.query) {
		options.path += '?' + QS.stringify(options.query);
	}

	if (body) {
		// Try to JSON.stringify and wrap in Buffer
		if (typeof body === 'object') {
			try {
				data = JSON.stringify(body, null, 2);
				data = Buffer(data);

				options.headers['Content-Type'] = "application/json";
				if (!options.headers['Accept'])
					options.headers['Accept'] = "application/json";

			} catch (e) {
				callback(e);
				return;
			}

		} else { // Force to string and wrap in Buffer
			data = Buffer(body + "");
			if (options.headers['Content-Type'])
				options.headers['Content-Type'] = "text/palin";
		}

		options.headers['Content-Length'] = data.length;
	}

	var req = this.protocol.request(options);
	req.on('error', function(err) {
		callback(err);
	});

	req.on('response', function(res) {

		// Aggregate response data
		res.data = "";
		res.on('data', function(d) {
			res.data += d.toString('utf8');
		});

		res.on('end', function() {
			if (res.headers && res.headers['content-type']
					&& res.headers['content-type'].split(/;/g)[0] === "application/json") {
				try {
					res.body = JSON.parse(res.data);
				} catch (e) {
					callback(e);
					return;
				}
			}

			callback(null, res);
		});
	});

	if (data) {
		if (options.expect) {
			req.on('continue', function() {
				req.write(data);
				req.end();

			});

		} else {
			req.write(data);
			req.end();
		}
	} else {
		req.end();
	}
};

Client.prototype.get = function(path, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options.path = path;
	options.method = "GET";
	this.request(options, null, callback);
};

Client.prototype.post = function(path, body, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options.path = path;
	options.method = "POST";
	this.request(options, body, callback);
};

Client.prototype.put = function(path, body, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options.path = path;
	options.method = "PUT";
	this.request(options, body, callback);
};

Client.prototype['delete'] = function(path, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options.path = path;
	options.method = "DELETE";
	this.request(options, null, callback);
};
