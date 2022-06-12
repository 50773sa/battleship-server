/**
 * Socket Controller
 */

const debug = require('debug')('battleship:socket_controller');
let io = null; 

const rooms = [
	{
		id: 'game',
		name: "Game",
		players: []
	}
]  

//******** GET ROOM BY ID ********//

const getRoomById = id => {
	return rooms.find(room => room.id === id)
} 

//******** GET ROOM BY PLAYER ID ********//

const getRoomByPlayerId = id => {
	return rooms.find(gameroom => gameroom.players.find(player => player.id === id))
} 

//******** PLAYER JOINS GAME ********//

const handleJoinGame = async function(username, room_id, callback) {
	debug(`Player ${username} with socket id ${this.id} wants to join ${room_id}`);

	const room = getRoomById(room_id)

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
	
	room.players.push(player)
	
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

	io.to(room.id).emit('player:list', room.players) 
	debug('players after emit player:list: ', room.players);
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
	const room_list = rooms.map(room => {
		return {
			id: room.id,
			name: room.name,
		}
	});

	callback(room_list);
}
 
// ******** HANDLE SHOT ********//
 const handlePlayerShot = function (cellId) {
	console.log(`STEP 2: Shot fired on cell: ${cellId}`)

	const room = getRoomByPlayerId(this.id)
 
	// send data ONLY to the opponent battleboard
	this.broadcast.to(room.id).emit('receive:shot', cellId)
 }
 
// ******** HANDLE RESULT ********//
 const handleShotResult = function (cellId, hit) {
	console.log("We´ve got a result! (cellId, hit)", cellId, hit)
	
	const room = getRoomByPlayerId(this.id)
	 
	this.broadcast.to(room.id).emit('shot:result-received', cellId, hit)
 }

 // ******** HANDLE SHIP SUNK ********//
 const handleShipSunk = function (ship_id) {
	console.log("The ship is down! ", ship_id)
	
	const room = getRoomByPlayerId(this.id)

	this.broadcast.to(room.id).emit("ship:sunk-reply", ship_id);
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

	// handle player shot event
	socket.on('player:shot', handlePlayerShot)

	// handle shot result
	socket.on('shot:result', handleShotResult)

	// handle ship sunk
	socket.on('ship:sunk', handleShipSunk)
 }