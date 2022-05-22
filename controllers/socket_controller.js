/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; 

const players = []


//******** PLAYER JOINS GAME ********//

 const handleJoinGame = function(username) {
	debug(`Player ${username} with socket id ${this.id} wants to join the game`);

	// is game full?
	if (players.length > 1) {
		console.log("Game is full")
		debug(`Game is full. Connected players are ${username}`);
		this.emit('game:full', true, (players) => {
			players = players
		})
		return
	}

	// Create a player with socket id and username
	const player = {
		id: this.id,
		username: username,
	}

	// Add the connected player to the player array 
	players.push(player)

	// let everyone know that a player joined the game
	this.broadcast.emit('update:players', player.username)
	debug(`Playerlist is updated and players in this game are ${username}`);
}

//******** PLAYER DISCONNECTS ********//

 const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);

	// find player that disconnected
	const playerIndex = players.findIndex((player) => player.id === this.id);

	// remove disconnected player from playerList
	players.splice(playerIndex, 1);

	this.broadcast.emit('player:disconnected', true);
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
 * Handle click event on cell
 *
 */
 const handleClickOnCell = function (click) {
    debug(`Client ${this.id} clicked on cell with id ${click.id}`)

    this.emit('cell:clicked')
}


/**
 * Export controller and attach handlers to events
 *
 */
module.exports = function(socket, _io) {
	// save a reference to the socket.io server instance
	io = _io;

	debug(`Client ${socket.id} connected`)

	// handle player disconnect
	socket.on('disconnect', handleDisconnect);

	// handle player Joined
	socket.on('player:joined', handleJoinGame)

	// handle click on cell
	socket.on('cell:clicked', handleClickOnCell)
}
