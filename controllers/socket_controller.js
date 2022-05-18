/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; // socket.io server instance

// list of players
const players = [
	{
		id: '1',
		name: 'Player'
	},
	{
		id: '2',
		name: 'Opponent'
	},
]

// Get player by ID
const getPlayerById = id => {
	return players.find(player => player.id === id)
}

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
 const handleJoinGame = async function(player_id) {
	debug(`Player ${player_id} with socket id ${this.id} wants to join the game`);

 	// add socket to list of players
	const game = getPlayerById(player_id) 

	io.emit('join:game', game)

	io.emit('player:list', player_id)
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
