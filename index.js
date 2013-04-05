var HTTP = require('http');

var Client = module.exports = function(client, http) {
	this.client = client || HTTP;
	this.isHttp = (typeof http === 'undefined') ? true : !!http;
};

Client.prototype.request = function(options, body, callback) {
	var data = false;

	if (this.isHttp)
		options.headers = options.headers || {};

	if (body) {
		// Try to JSON.stringify and wrap in Buffer
		if (typeof body === 'object') {
			try {
				data = JSON.stringify(body);
				data = Buffer(data);

				if (this.isHttp)
					options.headers['Content-Type'] = "application/json";

				if (this.isHttp && !options.headers['Accept'])
					options.headers['Accept'] = "application/json";

			} catch (e) {
				callback(e);
				return;
			}

		} else { // Force to string and wrap in Buffer
			data = Buffer(body + "");
			if (this.isHttp && !options.headers['Content-Type'])
				options.headers['Content-Type'] = "text/palin";
		}

		if (this.isHttp)
			options.headers['Content-Length'] = data.length;
	}

	var req = HTTP.request(options);

	req.on('error', function(err) {
		callback(err);
	});

	req.on('response', function(res) {
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

			callback(null, res.body || res.data);
		});
	});

	if (data)
		req.write(data);

	req.end();
};
