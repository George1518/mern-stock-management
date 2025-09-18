// sessionConfig.js
const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECERT,   // change this, don’t use "password123"
  resave: false,                  // don’t save session if not modified
  saveUninitialized: false,       // only save when something is stored
  cookie: {
    maxAge: 1000 * 60 * 60,       // 1 hour
    httpOnly: true,               // protects from XSS
  }
});

module.exports = sessionMiddleware;
