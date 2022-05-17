/**
 * Socket Controller
 */

const debug = require('debug')('ships:socket_controller');
let io = null; // socket.io server instance

/**
 * Handle a user disconnecting
 *
 */
const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);
}

/**
 * Handle start game
 *
 */
 const handleClockStart = function() {
	debug(`Client ${this.id} wants to join the game`);

	io.emit('game:start')
}


/**
 * Export controller and attach handlers to events
 *
 */
module.exports = function(socket, _io) {
	// save a reference to the socket.io server instance
	io = _io;

	debug(`Client ${socket.id} connected`)

	// handle user disconnect
	socket.on('disconnect', handleDisconnect);

	// listen for game:start events
	socket.on('game:start', handleClockStart)
}
