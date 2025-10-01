require('dotenv').config();
require('express-async-errors');


// extra security packages
const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean');
const rateLimiter=require('express-rate-limit');

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
const societyconnectRouter = require('./routes/SocietyConnect.routes');
const findmyspaceRouter = require('./routes/FindMySpace.routes');


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
app.use(cors());
app.use(xss());

// Set Routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/hostelcart', hostelcartRouter); // Add Authentication middleware to this??
app.use('/api/v1/societyconnect',authenticationMiddleware,societyconnectRouter);
app.use('/api/v1/findmyspace',authenticationMiddleware, findmyspaceRouter);
app.get('/', (req, res) => {
  return res.json({msg: "Welcome to OneDTU API"});
});

// Error Handling Middleware and Not Found Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    // console.log("Connecting with URI:", process.env.MONGO_URI);

    console.log("DB connected");
    
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
