'use strict';

dict = {
	"goed":"goud",
	"zes":"zaas",
	"gefeliciteerd":"gefelicitieerd"
}

var Settings = module.parent.require('./settings'),
	socketAdmin = module.parent.require('./socket.io/admin'),
	winston = module.parent.require('winston');

var tdwtfCensor = {};

function renderAdmin(req, res, next) { // eslint-disable-line no-unused-vars
	res.render('admin/plugins/tdwtfcensor', {});
}

tdwtfCensor.getBadWords = function() {
	var badWords = tdwtfCensor.settings.get('badWords');
	tdwtfCensor.badWords = badWords.replace(/\s/g, '').split(',');
	winston.info('tdwtfCensor list = ' + JSON.stringify(tdwtfCensor.badWords));
};

socketAdmin.settings.syncTdwtfCensor = function() {
    tdwtfCensor.settings.sync(tdwtfCensor.getBadWords);
};

tdwtfCensor.init = function(data, callback) {

	var app = data.router;
	var middleware = data.middleware;
	app.get('/admin/plugins/tdwtfcensor', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/plugins/tdwtfcensor', renderAdmin);

	var defaultSettings = {
		badWords: ''
	};
	tdwtfCensor.settings = new Settings('tdwtfcensor', '0.1', defaultSettings, tdwtfCensor.getBadWords);
	callback();
};

tdwtfCensor.adminMenu = function(customHeader, callback) {
	customHeader.plugins.push({
		'route': '/plugins/tdwtfcensor',
		'icon': 'fa-microphone-slash',
		'name': 'TDWTF Censor'
	});

	callback(null, customHeader);
};

tdwtfCensor.topicGet = function(data, callback) {
	if (data && data.topic) {
		data.topic.title = tdwtfCensor.censor(data.topic.title);
	}
	callback(null, data);
};

tdwtfCensor.topicsGet = function(data, callback) {
	if (data && data.topics) {
		for (var i = 0; i < data.topics.length; i++) {
			data.topics[i].title = tdwtfCensor.censor(data.topics[i].title);
		}
	}
	callback(null, data);
};

tdwtfCensor.parseRaw = function(data, callback) {
	if (data && typeof data === 'string') {
		data = tdwtfCensor.censor(data);
	}
	callback(null, data);
};
tdwtfCensor.parsePost = function(data, callback) {
	if (data && data.postData && data.postData.content) {
		data.postData.content = tdwtfCensor.censor(data.postData.content);
	}
	callback(null, data);
};
tdwtfCensor.parseSignature = function(data, callback) {
	if (data && data.userData && data.userData.signature) {
		data.userData.signature = tdwtfCensor.censor(data.userData.signature);
	}
	callback(null, data);
};

// create a string by repeating a character
function stringRepeat(c, count) {
	var s = '';
	while (true) {
		if (count & 1) {
			s += c;
		}
		count >>= 1;
		if (!count) {
			return s;
		}
		c += c;
	}
}

// replace bad words with '■'
tdwtfCensor.censor = function(data) {

	if (data === null || typeof data !== 'string') {
		data = '';
	}
	
	for (var i = 0; i < tdwtfCensor.badWords.length; i++) {
		var bw = tdwtfCensor.badWords[i];
		if (bw.length) {
			var bwreg = new RegExp('\\b' + bw + '\\b', 'ig');
			data = data.replace(bwreg, dict[bw]);
		}
	}
	
	return data;
};

module.exports = tdwtfCensor;

