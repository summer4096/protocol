protocol
========

Simple library for building and working with network protocols in node

There's a good example in the json folder which uses a simple linebreak-delimited json protocol.

Simple Example
==============

The protocol will look like this:

```
subject
A very long message
spanning multiple lines
```

and it will be divided up by null characters.

Here's how we'll make it:

```javascript
var protocol = require('protocol');

var simpleProtocol = new protocol();
simpleProtocol.delimiter = '\0'; //null character
simpleProtocol.parse = function(data){
	data = data.split('\n');
	var subject = data.shift();
	var message = data.join('\n');
	return {
		subject: subject,
		message: message
	};
};
simpleProtocol.stringify = function(data){
	return data.subject + '\n' + data.message;
};
```

Now here's how we can use it...

Server:

```javascript
var server = simpleProtocol.server();
server.on('connection', function(conn){
	conn.send({'subject': 'Hello, world!', 'message': 'This is only a test.'});
});
server.listen(9999);
```

Client:

```javascript
var conn = simpleProtocol.client(9999);
conn.on('connect', function(){
	conn.recv(function(packet){
		console.log(packet.subject, packet.message);
	});
});
```
