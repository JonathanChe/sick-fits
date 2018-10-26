require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO Use express middleware to handle cookies (JWT)

// TODO Use express middleware to populate current user

server.start({
  // only want endpoint visited by approved personnel
  cors: {
    credentials: {
      credentials: true, 
      origin: process.env.FRONTEND_URL,
    }
  }
}, deets => {
  console.log(`Server is now running on port ${deets.port}`)
})
