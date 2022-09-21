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
const redisClient = new Redis("redis://default:SfTHPkjxVTkmNM0IXe3C@containers-us-west-80.railway.app:6231")

//DB Connection
require("./src/database/connection")


// require("./src/bootstrap")()

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows React application to make HTTP requests to Express application
app.use(cors({ credentials: true, origin: "https://candystore.vercel.app" }));

//create express session for redis session
app.use(session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: 'sid',
    proxy: true,
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        // domain: 'vercel.app',
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
    console.log(`Server Listerning on port ${PORT} extra thing ${process.env.ENVIRONMENT}!`)
});


module.exports = app;