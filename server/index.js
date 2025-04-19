import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store users and rooms with better structure
const rooms = new Map(); // room -> Set of user objects {id, username}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ username, room }) => {
    // Leave previous room if any
    const previousRoom = [...socket.rooms].find(r => r !== socket.id);
    if (previousRoom) {
      socket.leave(previousRoom);
      if (rooms.has(previousRoom)) {
        const roomUsers = rooms.get(previousRoom);
        roomUsers.delete([...roomUsers].find(u => u.id === socket.id));
        if (roomUsers.size === 0) {
          rooms.delete(previousRoom);
        } else {
          io.to(previousRoom).emit('user_joined', {
            users: [...roomUsers].map(u => ({
              id: u.id,
              username: u.username
            }))
          });
        }
      }
    }

    // Join new room
    socket.join(room);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }
    
    // Add user to room
    const roomUsers = rooms.get(room);
    roomUsers.add({ id: socket.id, username });

    // Emit updated user list to all users in the room
    io.to(room).emit('user_joined', {
      users: [...roomUsers].map(u => ({
        id: u.id,
        username: u.username
      }))
    });

    console.log(`User ${username} joined room ${room}`);
    console.log('Current room users:', [...roomUsers].map(u => u.username));
  });

  socket.on('send_message', (data) => {
    // Find the room this socket is in
    const room = [...socket.rooms].find(r => r !== socket.id);
    if (room && rooms.has(room)) {
      const user = [...rooms.get(room)].find(u => u.id === socket.id);
      if (user) {
        io.to(room).emit('receive_message', {
          message: data.message,
          username: user.username,
          id: socket.id,
          timestamp: new Date()
        });
      }
    }
  });

  socket.on('disconnect', () => {
    // Find and remove user from their room
    for (const [roomName, users] of rooms.entries()) {
      const user = [...users].find(u => u.id === socket.id);
      if (user) {
        users.delete(user);
        if (users.size === 0) {
          rooms.delete(roomName);
        } else {
          io.to(roomName).emit('user_left', {
            users: [...users].map(u => ({
              id: u.id,
              username: u.username
            }))
          });
        }
        console.log(`User ${user.username} left room ${roomName}`);
        break;
      }
    }
  });
  socket.on('typing', ({ username, room }) => {
    socket.to(room).emit('user_typing', { username });
  });
  
  socket.on('stop_typing', ({ room }) => {
    socket.to(room).emit('user_stopped_typing');
  });
  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});