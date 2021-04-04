const express = require('express');
const http = require('http')
const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const connectDB = require('./config/Database')

// Load config
dotenv.config({ path: './config/.env' })
// Passport config
require('./config/passport-config')(passport)
// connect to DB
connectDB();

// Bodyparser to get user data
app.use(express.urlencoded({ extended: false }))

// Set js template engine
app.set('view engine', 'ejs');

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Mehtod override 
app.use(methodOverride('_method'));

// Connect flash
app.use(flash());
// Global Vars
app.use(function (request, response, next) {
    response.locals.success_msg = request.flash('success_msg');
    response.locals.error_msg = request.flash('error_msg');
    response.locals.error = request.flash('error');
    next();
})

// Static folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/style'));
// Routes
app.use('/', require('./routes/index'));

app.listen(process.env.PORT, () => {
    console.log("server running \nport = " + 'http://localhost:8080/');
});


