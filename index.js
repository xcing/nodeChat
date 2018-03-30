const app = require('express')();
const http = require('http').Server(app);
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

MongoClient.connect("mongodb://localhost:27017", function(err, database) {
  	if(err) { return console.dir(err); }

  	//create database
  	const nodeChatDb = database.db('nodeChat');

  	//create collection
    const historyCollection = nodeChatDb.collection('history');

	//query 100 last message and pass to view
    historyCollection.find({}).sort({_id:-1}).limit(100).toArray(function (e, historyData) {
		app.get('/', function(req, res){
		  res.render('index', {history: JSON.stringify(historyData.sort(function(a,b) {return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);} ))});
		});
    });

    //socket
    const io = require('socket.io')(http);
    const port = 3000;
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
