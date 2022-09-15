const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session')
const Redis = require('ioredis')
const RedisStore = require('connect-redis')(session)

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives access to variables set in the .en
require('dotenv').config();

// Create the Express application
var app = express();

//create reddis
const redisClient = new Redis("0.0.0.0")

//DB Connection
require("./src/database/connection")


// require("./src/bootstrap")()

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows React application to make HTTP requests to Express application
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//create express session for redis session
app.use(session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: 'sid',
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.ENVIRONMENT === "production",
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax"
    }
}))

/**
 * -------------- ROUTES ----------------
 */
//test route
app.get('/', async (req, res) => {
    res.send({ msg: 'hello' })

});

// Imports all of the routes from ./routes/index.js
app.use(require('./routes'));


/**
 * -------------- SERVER ----------------
 */

const PORT = process.env.PORT || 8000

// Server listens 
app.listen(PORT, () => {
    console.log(`Server Listerning on port ${PORT}`)
});


module.exports = app;