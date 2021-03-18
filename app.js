const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Helloword');
});

app.get('/soal', (req, res) => {
  const soal = require('./soal.json')
  res.send(soal)
});

//* Listen
io.on('connection', (socket) => {
  
  socket.on('test', (data) => {
    io.emit('test', data)
    console.log('user added');
  })

});

http.listen(port, () => {
  console.log('listening on *:', port);
});