var fs        = require('fs');
var Mustache  = require('mustache');

// sets up the socketIO server. To be called in grunt:connect onCreateServer
var setupIO = function( server, connect, options ) {
    var io = require('socket.io').listen(server);
    io.on('connection', handleSocketIO);
}

// handles the socketIO stuff
var handleSocketIO = function( socket ) {
    socket.on( 'new-subscriber', function( data ) {
		socket.broadcast.emit( 'new-subscriber', data );
	});

	socket.on( 'statechanged', function( data ) {
		delete data.state.overview;
		socket.broadcast.emit( 'statechanged', data );
	});

	socket.on( 'statechanged-speaker', function( data ) {
		delete data.state.overview;
		socket.broadcast.emit( 'statechanged-speaker', data );
	});
}

// Grunt connect middleware to serve /notes/:socketId
var middleware = function( req, res, next ) {
    var match = req.url.match(/\/notes\-server\/(\d+)/i);
    if( !match ) return next();

    var socketId = match[1];
    fs.readFile( __dirname + '/notes.html', function( err , data ) {
        if( err ) throw err;
        res.end( Mustache.to_html( data.toString(), {
			socketId: socketId
		}));
    });

}

// export relevant functions
module.exports = {
    setupIO: setupIO,
    middleware: middleware,
}
