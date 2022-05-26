/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; 

const rooms = [
	{
		id: 'game',
		name: "Game",
		players: {},
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
	debug(`Player ${username} with socket id ${this.id} wants to join the game ${room_id}`);

	// join game
	this.join(room_id)

	// add socket to list of players in this game
	// 1. find game
	const room = getRoomById(room_id)

	// 2. add socket to game´s 'players' object
	room.players[this.id] = username

	//let everyone know that someone has joined the game
	this.broadcast.to(room.id).emit('player:joined', username)

	// confirm join
	callback({
		success: true,
		roomName: room.name,
		players: room.players,
		yourTurn: true 
	})

	// update list of players. Send data back to client
	io.to(room.id).emit('player:list', room.players) 
 }

  //******** START GAME ********//

 const handleStartGame = function(room, username) {
	this.broadcast.to(room.id).emit('start:game', username)
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
	
	// let everyone in the room know that this player has disconnected
	this.broadcast.to(room.id).emit('player:disconnected', room.players[this.id])

	// remove player from list of players in that room
	delete room.players[this.id];

	// broadcast list of players in room to all connected sockets EXCEPT ourselves
	this.broadcast.to(room.id).emit('player:list', room.players);
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

	// handle get room list request
	socket.on('get-room-list', handleGetRoomList);

	 // handle click on cell
	 socket.on('cell:clicked', handleClickOnCell)

	 // handle start game
	 socket.on('start:game', handleStartGame)
 }