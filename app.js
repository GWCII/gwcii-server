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

});

http.listen(port, () => {
  console.log('listening on *:', port);
});