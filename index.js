var fs = require('fs');
var request = require('request');
var querystring = require('querystring');
var https = require('https');
var path = require('path');
var url = require('url');

function Notifier(userId, apiKey) {
	if (!(this instanceof Notifier)) return new Notifier(userId, apiKey);

	this.userId = userId;
	this.apiKey = apiKey;
}

Notifier.apiUrl = 'https://smsapi.free-mobile.fr/sendmsg';

Notifier.prototype.send = function (msg, callback) {
	callback = callback || function () {};

	var data = {
		user: this.userId,
		pass: this.apiKey,
		msg: msg
	};

	var options = url.parse(Notifier.apiUrl+'?'+querystring.stringify(data));
	options.cert = fs.readFileSync(path.join(__dirname, 'freemobile.crt'));
	options.rejectUnauthorized = false;

	try {
		var req = https.get(options, function (res) {
			res.on('data', function (data) {});
			res.on('end', function () {
				switch (res.statusCode) {
					case 200:
						callback(null, res);
						break;
					case 400:
						callback('Missing parameter', res);
						break;
					case 402:
						callback('Too many messages sent in a short period of time', res);
						break;
					case 403:
						callback('SMS notification service not activated or wrong credentials', res);
						break;
					case 500:
						callback('Internal server error', res);
						break;
					default:
						callback('Unknown error', res);
						break;
				}
			});
		});
	} catch (err) {
		process.nextTick(function () {
			callback(err);
		});
	}
};

module.exports = Notifier;
