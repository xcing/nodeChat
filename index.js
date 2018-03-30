var app = require('express')();
var http = require('http').Server(app);
var MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

MongoClient.connect("mongodb://localhost:27017", function(err, database) {
  	if(err) { return console.dir(err); }

  	const nodeChatDb = database.db('nodeChat');
    var historyCollection = nodeChatDb.collection('history');

    historyCollection.find({}).sort({_id:-1}).limit(100).toArray(function (e, historyData) {
    	var io = require('socket.io')(http);
		var port = 3000;

		app.get('/', function(req, res){
		  res.render('index', {history: JSON.stringify(historyData.sort(function(a,b) {return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);} ))});
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
});
