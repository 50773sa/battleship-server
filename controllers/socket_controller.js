/**
 * Socket Controller
 */

const debug = require('debug')('clock:socket_controller');
let io = null; // socket.io server instance

/**
 * Handle a user disconnecting
 *
 */
const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);
}

/**
 * Handle clock start
 *
 */
 const handleClockStart = function() {
	debug(`Client ${this.id} wants to start the clock`);

	// säg till alla anslutna att klockan ska starta. I Timer lyssnar vi sedan efter detta med socket.on
	io.emit('clock:start')
}

/**
 * Handle clock Stop
 *
 */
 const handleClockStop = function() {
	debug(`Client ${this.id} wants to stop the clock`);

	// säg till alla anslutna att klockan ska stanna. I Timer lyssnar vi sedan efter detta med socket.on
	io.emit('clock:stop')
}

/**
 * Handle clock Reset
 *
 */
 const handleClockReset = function() {
	debug(`Client ${this.id} wants to reset the clock`);

	// säg till alla anslutna att klockan ska resetas. I Timer lyssnar vi sedan efter detta med socket.on
	io.emit('clock:reset')
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

	// listen for clock:start events
	socket.on('clock:start', handleClockStart)

	// listen for clock:stop events
	socket.on('clock:stop', handleClockStop)

	// listen for clock:reset events
	socket.on('clock:reset', handleClockReset)
}
