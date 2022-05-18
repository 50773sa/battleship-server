/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; // socket.io server instance

/**
 * Handle a user disconnecting
 *
 */
const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);
}

/**
 * Handle join game
 *
 */
 const handleJoinGame = function() {
	debug(`Client ${this.id} wants to join the game`);

	io.emit('join:game')
}

/**
 * Random function
 * 
 */
const randomPosition = function () {
	const blockId = Math.floor(Math.random() * 100);
	return blockId;
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

	// listen for join:game events
	socket.on('join:game', handleJoinGame)
}
