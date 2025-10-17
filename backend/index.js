require('dotenv').config();
require('express-async-errors');


// extra security packages
const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean');
const rateLimiter=require('express-rate-limit');
const { Server } = require("socket.io");
const http = require('http');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticationMiddleware=require('./middleware/authentication');


// Import essentials and utils
const connect= require('./util/db');
const express = require('express');
const app = express();

// Import Routers
const authRouter=require('./routes/auth');
const hostelcartRouter = require('./routes/hostelcart.routes');
const societyconnectRouter = require('./routes/societyconnect.routes');
const findmyspaceRouter = require('./routes/findmyspace.routes');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');


// Set security packages
app.set('trust proxy',1);
app.use(
  rateLimiter({
    windowMs:15*60*1000,
    max:100,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(xss());

// Set Routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/hostelcart', hostelcartRouter);
app.use('/api/v1/societyconnect', societyconnectRouter);
app.use('/api/v1/findmyspace', findmyspaceRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/user', userRouter);
app.get('/', (req, res) => {
  return res.json({msg: "Welcome to OneDTU API"});
});

// Error Handling Middleware and Not Found Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

// Create HTTP server from Express app so Socket.IO can attach to it
const server = http.createServer(app);

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("DB connected");

    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

// websocket connection
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const io = new Server(server, {
  cors: { origin: allowedOrigin, credentials: true },
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log(`✅ User ${userId} joined personal room`);
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`📥 Joined chat room ${chatId}`);
  });

  socket.on("leave chat", (chatId) => {
    socket.leave(chatId);
    console.log(`📤 Left chat room ${chatId}`);
  });

  socket.on("new message", (message) => {
    // message may include either `chat` (object) or `chatId` (string)
    const chatObj = message.chat;
    const chatId = chatObj?._id || message.chatId || message.chat;

    if (!chatId) return; // nothing to emit to

    // notify other members in the chat room (excluding the sender)
    socket.to(chatId.toString()).emit("message received", message);

  });

  socket.on("disconnect", () => {
    console.log("🚫 Client disconnected:", socket.id);
  });
});
