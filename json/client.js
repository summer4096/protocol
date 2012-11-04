var jsonProtocol = require('./jsonProtocol');

console.log('Starting client');

var conn = jsonProtocol.client(9999);
conn.on('connect', function(){
	console.log('Established connection');
	conn.send({'iama': 'client'});
	conn.recv(function(packet){
		console.log('Got packet:', packet);
	});
});
