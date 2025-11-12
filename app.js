// Small Express + Socket.IO server bootstrap for RealTIME-HUB
// This file sets up:
// - Express to serve `public/` and render EJS views in `views/`
// - Socket.IO with two namespaces: /chat and /location
// - Defensive handling for incoming chat payloads (string or {name,message})

const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Express setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));
app.get('/chat', (req, res) => res.render('chat'));
app.get('/location', (req, res) => res.render('location'));

// ---------- CHAT NAMESPACE ----------
const chat = io.of('/chat');
const users = {};

chat.on('connection', (socket) => {
  console.log('🟢 Chat user connected:', socket.id);

  // when user joins
  socket.on('new-user-joined', (name) => {
    if (!name) return;
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
    console.log(`${name} joined`);
  });

  // when user sends message
  socket.on('send', (payload) => {
    // payload can be a string (legacy client) or an object { name, message }
    let name;
    let message;

    if (typeof payload === 'string') {
      message = payload;
      name = users[socket.id];
    } else if (payload && typeof payload === 'object') {
      name = payload.name || users[socket.id];
      message = payload.message || '';
      // If client provided a name but server didn't have it stored, persist it
      if (!users[socket.id] && name) {
        users[socket.id] = name;
      }
    }

    if (name && message && message.trim()) {
      console.log(`💬 ${name}: ${message}`);
      // send to everyone EXCEPT sender
      socket.broadcast.emit('receive', { name, message });
    } else {
      console.log('⚠️ Dropped message - missing name or empty message', { socketId: socket.id, name, message });
    }
  });

  // when user leaves
  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      socket.broadcast.emit('left', name);
      delete users[socket.id];
      console.log(`🔴 ${name} left`);
    }
  });
});

// ---------- LOCATION NAMESPACE ----------
const location = io.of('/location');

location.on('connection', (socket) => {
  console.log('📍 Location user connected:', socket.id);

  socket.on('send-location', (data) => {
    // expect { latitude, longitude, name }
    const { latitude, longitude, name } = data || {};
    if (latitude == null || longitude == null) return;
    // broadcast current position to all clients (including sender) with socket id
    location.emit('receive-location', { id: socket.id, latitude, longitude, name });
  });

  socket.on('disconnect', () => {
    location.emit('user-disconnected', socket.id);
    console.log('🔴 Location user disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
