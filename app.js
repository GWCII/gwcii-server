const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

const port = process.env.PORT || 3000
app.use(cors())

app.get('/', (req, res) => {
  res.send('Helloword');
});

let rooms = [];
app.get('/soal', (req, res) => {
  const soal = require('./soal.json')
  res.send(soal)
});

//* Listen
io.on('connection', (socket) => {
  
  socket.on('login', (data) => {
    io.emit('getRooms', rooms)
  })

  socket.on('createRoom', (data) => {
    let room  = {
      name: data.name,
      users: [],
      admin: data.admin
    }
    rooms.push(room);
    io.emit('updatedRoom', rooms);
  })

  socket.on('getRooms', () => {
    io.emit('getRooms', rooms);
  })

  socket.on('joinRoom', (data) => {
    socket.join(data.name, function() {
      let userData = {
        username: data.username,
        score: data.score
      }
      let roomIndex = rooms.findIndex( el => el.name === data.name);
      rooms[roomIndex].users.push(userData);
      io.sockets.in(data.name).emit('roomDetail', rooms[roomIndex]);
    })
  })

  socket.on('letsPlay', (data) => {
    socket.broadcast.emit('letsPlay', data)
  })
});

http.listen(port, () => {
  console.log('listening on *:', port);
});