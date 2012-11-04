var net = require('net');
var util = require('util');
var events = require('events');

var protocol = function(){};
protocol.prototype.delimiter = '\n';
protocol.prototype.parse = protocol.prototype.stringify = function(packet){
	return packet;
};
var protoParser = function(proto){
	events.EventEmitter.call(this);
	this.protocol = proto;
	this.buffer = '';
};
util.inherits(protoParser, events.EventEmitter);
protoParser.prototype.feed = function(chunk){
	this.buffer += chunk;
	var parts = this.buffer.split(this.protocol.delimiter);
	this.buffer = parts.pop();
	for (var i in parts) {
		var packet = this.protocol.parse(parts[i]);
		if (packet !== null) {
			this.emit('packet', packet);
		}
	}
};

protocol.prototype.parser = function(){
	return new protoParser(this);
};

protocol.prototype.socket = function(){
	var proto = this;
	return function(conn){
		var parser = proto.parser();
		conn.on('data', function(chunk){
			parser.feed(chunk);
		});
		conn.send = function(data){
			this.write(proto.stringify(data) + proto.delimiter);
		};
		conn.recv = function(onRecv){
			parser.on('packet', onRecv);
		};
	};
};

protocol.prototype.server = function(){
	var server = net.createServer.apply(net, arguments);
	server.on('connection', this.socket());
	return server;
};
protocol.prototype.client = function(){
	var client = net.connect.apply(net, arguments);
	var socket = this.socket();
	client.on('connect', function(){
		socket(client);
	});
	return client;
};

module.exports = protocol;
