const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000
const cors = require(cors)

app.use(cors())

const soal = require('./soal.json')
let rooms = []
//* Listen
io.on('connection', (socket) => {
  
  socket.on('login', (data) => {
    io.emit('getRooms', rooms)
  })

  socket.on('createRoom', (data) => {
    let room  = {
      name: data.name,
      users: [],
      admin: data.admin,
      isStarted:false
    }
    rooms.push(room);
    const filtered = rooms.filter(room => room.isStarted === false)
    io.emit('updatedRoom', filtered);
  })

  socket.on('getRooms', () => {
    const filtered = rooms.filter(room => room.isStarted === false)
    io.emit('getRooms', filtered);
  })

  socket.on('joinRoom', (data) => {
    socket.join(data.name, function() {
      let userData = {
        username: data.username,
        score: data.score
      }
      let roomIndex = rooms.findIndex( el => el.name === data.name);
      const exist = rooms[roomIndex].users.find(user => user.username === data.username);
      if(!exist){
        rooms[roomIndex].users.push(userData);
      } 
      io.sockets.in(data.name).emit('roomDetail', rooms[roomIndex]);
      socket.emit('initSoal', soal)
    })
  })

  socket.on('letsPlay', (data) => {
    const roomIndex = rooms.findIndex(room => room.name === data.name)
    rooms[roomIndex].isStarted = true
    io.emit('letsPlay', data.isStart)
  })

  socket.on('addQuestion', () => {
    const questions = require('./soal.json')
    io.emit('addQuestion', questions)
  })

  socket.on('trueAnswer', (data) => {

    let roomIndex = rooms.findIndex(room => room.name === data.name)
    let userIndex = rooms[roomIndex].users.findIndex(user => user.username === data.username)
    rooms[roomIndex].users[userIndex].score += 10

    if(rooms[roomIndex].users[userIndex].score === 100) {
      io.emit('winner', rooms[roomIndex])
    } else {
      io.emit('updateScore', rooms[roomIndex].users[userIndex])
    }
  })

});

http.listen(port, () => {
  console.log('listening on *:', port);
});