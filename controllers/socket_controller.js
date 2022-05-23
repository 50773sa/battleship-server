/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; 

const players = []

/* 
const game = [
	{
		id: 1,
		name: "game",
		players: {},
	}
] */


//******** PLAYER JOINS GAME ********//

 const handleJoinGame = function(username) {
	debug(`Player ${username} with socket id ${this.id} wants to join the game`);

	// Check if there are one or two players connected
	if (players.length <= 1) {
		// Create a player with socket id and username
		const player = {
			socket_id: this.id,
			username: username,
			game: "game",
			currentPlayer: "", 
		}

		this.join(player.game)

		// Add the connected player to the player array 
		players.push(player)
		console.log("Players before emit", players)

		// updater list of players
		io.to(player.game).emit('update:players', players)

	} else {	
		console.log("Game is full")
		debug(`Game is full. Connected players are ${username}`);
		this.emit('game:full', true, (players) => {
			players = players
		})
		delete this.id;
        return;
	}
 }

//******** PLAYER DISCONNECTS ********//

 const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);

	const removePlayer = (id) => {	
		// find player that disconnected
		const removePlayerIndex = players.findIndex((player) => player.id === id)
		if (removePlayerIndex !== -1) 
			// remove disconnected player from list of players
			return players.splice(removePlayerIndex, 1)[0]
	}

	const player = removePlayer(this.id)
	if (player) io.to(player.game).emit('player:disconnected', true)
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
