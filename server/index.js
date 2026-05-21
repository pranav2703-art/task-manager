require('dotenv').config();
console.log('Starting server...');
console.log('MONGO_URI set:', !!process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');
const { connect } = require('http2');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Connect to MongoDB
// Connect to MongoDB
connectDB();
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`Socket ${socket.id} joined project ${projectId}`);
  });

  socket.on('leave_project', (projectId) => {
    socket.leave(projectId);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
