const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session')
const Redis = require('ioredis')
const RedisStore = require('connect-redis')(session)

/**
 * -------------- GENERAL SETUP ---------------- setup
 */

// Gives access to variables set in the .en
require('dotenv').config();

// Create the Express application
var app = express();
// app.set("trust proxy", 1)

//stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
    apiVersion:"2022-08-01"
})


//create reddis
const redisClient = new Redis("redis://default:FFNokVKuOOqCFD2m0X91@containers-us-west-80.railway.app:6231")

//DB Connection
require("./src/database/connection")


// require("./src/bootstrap")()

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows React application to make HTTP requests to Express application
app.use(cors({ credentials: true, origin: "https://aidanjohnoconnor.co.uk" }));

//strip functions
app.get('/config', (req,res) => {
    res.send({publishablekey:process.env.STRIPE_PUBLISHABLE_KEY})
})

app.post("/create-payment.intent", async(req,res) => {
    try{
        console.log(req.body.amount * 100, 'AMOUNT')
    const paymentIntent = await stripe.paymentIntents.create({
        currency:'gbp',
        amount:req.body.amount * 100,
        automatic_payment_methods:{
            enabled:true,
        }
    })
    console.log(paymentIntent)
    res.send({clientSecret:paymentIntent.client_secret})
    }catch(err){
        res.status(400).send({err})
    }
})
// app.set("trust proxy", 1)
//create express session for redis session dd
app.use(session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: 'sid',
    proxy:true,
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        domain: 'aidanjohnoconnor.co.uk',
        httpOnly: false,
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