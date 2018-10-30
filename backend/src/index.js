// npm imports
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env' });
const jwt = require('jsonwebtoken');

// rel path imports
const createServer = require('./createServer');
const db = require('./db');

// create server
const server = createServer();

// parse incoming cookies
server.express.use(cookieParser());

// decode incoming JWT's
server.express.use((req, res, next) => {
  // pull the token out of the request object
  const { token } = req.cookies;
  if (token) {
    // pull user Id out of verified token
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId on the req for future reqests to access
    req.userId = userId
  }
  next();
});

server.start({
  // only want endpoint visited by approved personnel
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }
}, deets => {
  console.log(`Server is now running on port ${deets.port}`)
});
