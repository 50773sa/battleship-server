/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; // socket.io server instance

/* // list of players
const players = [
	{
		id: '1',
		name: 'Player'
	},
	{
		id: '2',
		name: 'Opponent'
	},
] */

const games = [
	{
		id: 'game1',
		name: 'Game 1',
		players: {},
	}
]

/**
 * Get game by ID
 *
 * @param {String} id ID of game to get
 * @returns
 */
 const getGameById = id => {
	return games.find(game => game.id === id)
}

/**
 * Get game by User ID
 *
 * @param {String} id Socket ID of User to get Game by
 * @returns
 */
 const getGameByUserId = id => {
	return games.find(gameRoom => gameRoom.players.hasOwnProperty(id));
}

/* // Get player by ID
const getPlayerById = id => {
	return players.find(player => player.id === id)
} */

/**
 * Handle a user disconnecting
 *
 */
const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);
}

/**
 * Handle a player joining a game
 *
 */
 const handleJoinGame = async function(username, game_id, callbak) {
	debug(`Player ${username} with socket id ${this.id} wants to join the game with id '${game_id}'`);

	this.join(game_id)
 	// add socket to list of players
	const game = getGameById(game_id)
	
	game.players[this.id] = username

	this.broadcast.to(game.id).emit('player:joined', username)

	callbak({
		success: true,
		roomName: game.name,
		players: game.players
	})

	io.to(game.id).emit('player:list', game.players)

	/* io.emit('join:game', game) */

	/* io.emit('player:list', player_id) */
}

/**
 * Handle a player requesting a list of games
 *
 */
 const handleGetGameList = function(callback) {
	// generate a list of games with only their id and name
	const game_list = games.map(game => {
		return {
			id: game.id,
			name: game.name,
		}
	});

	// send list of rooms back to the client
	callback(game_list);
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
	/* socket.on('join:game', handleJoinGame) */

	socket.on('player:joined', handleJoinGame)

	socket.on('get-game-list', handleGetGameList)
}
