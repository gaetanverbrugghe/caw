const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const data = require('./src/solutions.json');

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('main', {
    role: 'client',
    data: data
  });
});

app.get('/admin', (req, res) => {
  res.render('main', {
    role: 'admin',
    data: data
  });
});

app.use(express.static(`${__dirname}/dist`));

http.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
  socket.on('toggle', (msg) => {
    io.emit('toggle', msg);
  });
});
