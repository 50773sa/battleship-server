/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; 

const players = []  

/* const games = [
	{
		id: 1,
		name: "Game",
		players: {},
	}
]  */

//******** GET GAME BY ID ********//

/* const getGameById = id => {
	return games.find(game => game.id === id)
} */

//******** GET GAME BY PLAYER ID ********//

/* const getGameByPlayerId = id => {
	return games.find(gameroom => gameroom.players.hasOwnProperty(id))
} */


//******** PLAYER JOINS GAME ********//

 const handleJoinGame = function(username) {
	debug(`Player ${username} with socket id ${this.id} wants to join the game`);

	// If there are no player connected, then the first player will be playerOne
	if (players.length === 0) { 
		// Create playerOne with socket id and username
		const playerOne = {
			socket_id: this.id,
			username: username,
			game: "game",
			currentPlayer: "", 
		}

		this.join(playerOne.game)
		debug('game after this.join playerOne:', game)
		debug('playerOne: ', playerOne)

		// Add the connected player to the arrays of players  
		players.push(playerOne)
		console.log('PlayerOne: ', playerOne, 'Players: ', players)
		debug('PlayerOne: ', playerOne, 'Players: ', players)

		// update list of players
		io.to(playerOne.game).emit('update:players', players) 
		console.log('Playerlist after updating:', players)
		debug('Playerlist after updating: ', players)
	
 	} else if (players.length <= 1) {
		 //if the connected player is the second player then save details to playerTwo
		const playerTwo = {
			socket_id: this.id,
			username: username,
			game: "game",
			currentPlayer: "", 
		}

		this.join(playerTwo.game)
		debug('game after this.join playerTwo:', game)
		debug('playerTwo: ', playerTwo, 'playerOne: ', playerOne)

		players.push(playerTwo)

		console.log('PlayerTwo: ', playerTwo, 'Players: ', players)
		debug('PlayerTwo: ', playerTwo, 'Players: ', players)

		// update list of players
		io.to(playerTwo.game).emit('update:players', players)
		console.log('Playerlist after updating playerTwo:', players)
		debug('Playerlist after updating playerTwo: ', players)
	 } else {	
		console.log("Game is full")
		debug('Game is full. Connected players are ', players);
		this.emit('game:full', true, (players) => {
			players = players
		})
		delete this.id;
       	return; 
	}

		/* // join game
	this.join(game_id)

	// add socket to list of players in this game
	// 1. find game
	const game = getGameById(game_id)

	// 2. add socket to game´s 'players' object
	game.players[this.id] = username

	//let everyone know that someone has joined the game
	this.broadcast.to(game.id).emoit('player:joined', username)

	// confirm join
	callback({
		success: true,
		gameName: game.name,
		players: game.players
	})

	// updater list of players
	io.to(game.id).emit('update:players', game.players) */
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
 
 //******** RANDOM FUNCTION ********//
 
 const randomPosition = function () {
	 const blockId = Math.floor(Math.random() * 100);
	 return blockId;
 }
 
 
 //******** HANDLE CLICKEVENTS ON CELL ********//

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