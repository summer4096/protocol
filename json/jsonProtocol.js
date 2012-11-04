var protocol = require('../protocol');

var jsonProtocol = new protocol();
jsonProtocol.parse = function(data){
	return JSON.parse(data);
};
jsonProtocol.stringify = function(data){
	return JSON.stringify(data);
};

module.exports = jsonProtocol;
