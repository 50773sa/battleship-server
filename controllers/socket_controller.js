/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; 

const players = []
const rooms = [
	{
		id: 'game',
		name: "Game",
		players: players
	}
]  

//******** GET ROOM BY ID ********//

const getRoomById = id => {
	return rooms.find(room => room.id === id)
} 

//******** GET ROOM BY PLAYER ID ********//

const getRoomByPlayerId = id => {
	return rooms.find(gameroom => gameroom.players.hasOwnProperty(id))
} 

//******** PLAYER JOINS GAME ********//

const handleJoinGame = async function(username, room_id, callback) {
	debug(`Player ${username} with socket id ${this.id} wants to join ${room_id}`);

	const room = getRoomById(room_id)
	debug(`room is: ${room_id}`);

	if(room.players.length === 2) {
		return (
			callback({
				success: false
			})
		)
	}  

	const player = {
		id: this.id,
		username: username,
	}
	
	players.push(player)
	debug('Player number 1 is: ', player.username)
	
	room.players[this.id] = username
	debug(`this player is: ${username}`);
	
	// join game
	this.join(room_id)	
	debug('Number of players in room is:', room.players.length); 
	
	// confirm join
	callback({
		success: true,
		roomName: room.name,
		players: room.players,
		yourTurn: room.players.length === 1 ? true : false,
		numberOfPlayers: room.players.length 
	})

	// update list of players. Send data back to client
	io.to(room.id).emit('player:list', room.players) 
	debug('players after emit player:list: ', room.players);

	io.to(room.id).emit('start:game') 
}

//******** GET NUMBER OF SHIPS ********//

const handleGetNumberOfShips = async function(ships, callback) { 

	const shipsLength = Object.keys(ships).length

	callback({
		success: true, 
		numberOfShips: shipsLength,
	})

	debug(`Length of ships is: ${shipsLength}`, ships)

	// update list of players ships
	/* io.emit('player:ships')  */


	/* playerNumberOfShips = Object.keys(ships).length
	debug(`Ships for this player is: ${playerNumberOfShips}`);

	opponentNumberOfShips = Object.keys(ships[!this.id]).length
	debug(`Ships for opponent is: ${opponentNumberOfShips}`);
	 */
/* 	// generate a list of ships for player and opponent
	const ships_list = ships.map(ship => {
		return {
			playerNumberOfShips: Object.keys(ship[this.id]).length,
			opponentNumberOfShips: Object.keys(ship[!this.id]).length
		}
	});

	// send list of ships back to the client
	callback(ships_list); */
	
	/* 
	room.players[this.id] = playerNumberOfShips
	debug(`Ships for this player is: ${playerNumberOfShips}`);

	room.players[!this.id] = opponentNumberOfShips
	debug(`Ships for opponent is: ${opponentNumberOfShips}`); */

	// confirm get number of ships
/* 	callback({
		success: true,
		numberOfShips: Object.keys(ships).length,
	})
	debug(`Successully got number of ships for player: ${playerNumberOfShips} and opponent: ${opponentNumberOfShips}`);
 */

 }


 //******** PLAYER DISCONNECTS ********//
  const handleDisconnect = function() {
	debug(`Client ${this.id} disconnected :(`);
 
	// find the room that the socket is a part of
	const room = getRoomByPlayerId(this.id)

	// if socket was not in a room, don't broadcast disconnect
	if (!room) {
		return;
	}

	this.broadcast.to(room.id).emit('player:disconnected', room.players[this.id])
 }

//****** HANDLE A PLAYER REQUESTING A LIST OF ROOMS ******//
const handleGetRoomList = function(callback) {
	// generate a list of rooms with only their id and name
	const room_list = rooms.map(room => {
		return {
			id: room.id,
			name: room.name,
		}
	});

	// send list of rooms back to the client
	callback(room_list);
}
 
// ******** HANDLE SHOT ********//

const handleShotFired = function (data) {
	console.log(`Shot fired: ${data}`)

	// hit
	this.emit('receive:hit', data)



	// miss

	// ta emot e.target.classname
	// ta emot från battleboard

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

	// handle get room list request
	socket.on('get-room-list', handleGetRoomList);

	//handle shot
	socket.on('shot:hit', handleShotFired)	

	// handle get number of ships
	socket.on('get-number-of-ships', handleGetNumberOfShips)
 }