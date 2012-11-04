var jsonProtocol = require('./jsonProtocol');

console.log('Starting server');

var server = jsonProtocol.server();
server.on('connection', function(conn){
	console.log('Got connection');
	conn.send({'iama': 'server'});
	conn.recv(function(packet){
		console.log('Got packet:', packet);
	});
});
server.listen(9999);
