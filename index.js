var app = require('express')();
var http = require('http').Server(app);// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017", function(err, database) {
  	if(err) { return console.dir(err); }

  	const nodeChatDb = database.db('nodeChat');
    var historyCollection = nodeChatDb.collection('history');

	var io = require('socket.io')(http);
	var port = 3000;

	app.get('/', function(req, res){
	  res.sendFile(__dirname + '/index.html');
	});

	io.on('connection', function(socket){
	  socket.on('chat message', function(msg){
	  	historyCollection.insert({"msg": msg});
	    io.emit('chat message', msg);
	  });
	});

	http.listen(port, function(){
	  console.log('listening on *:' + port);
	});

});

