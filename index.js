var app = require('express')();
var http = require('http').Server(app);// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/nodeChat", function(err, db) {
  	if(err) { return console.dir(err); }

  	console.log(db);

  	db.collection('history', function(err, collection) {});

  	var historyCollection = db.collection('history');

	var io = require('socket.io')(http);
	var port = 3000;

	app.get('/', function(req, res){
	  res.sendFile(__dirname + '/index.html');
	});

	io.on('connection', function(socket){
	  socket.on('chat message', function(msg){
	  	// var historyCollection = db.collection('history');
	  	// historyCollection.insert(msg);
	    io.emit('chat message', msg);
	  });
	});

	http.listen(port, function(){
	  console.log('listening on *:' + port);
	});

});

