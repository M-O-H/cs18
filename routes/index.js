const { request } = require('express');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const expressLayout = require('express-ejs-layouts');
const passport = require('passport')
const User = require('../models/Users');

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get(['/main', '/', 'main/'], checkAuthenticated, (request, response) => {
    response.render('index.ejs');
})
app.get('/login', checkNotAutnenticated, (request, response) => {
    response.render('login.ejs');
})

app.post('/login', checkNotAutnenticated, passport.authenticate('local', {
    successRedirect: '/main', //if success redirect to...
    failureRedirect: '/login', //if fail redirect login
    failureFlash: true
}))

app.get('/register', checkNotAutnenticated, (request, response) => {
    response.render('register.ejs');
})

app.post('/register', checkNotAutnenticated, async (request, response) => {
    const { name, email, password } = request.body;
    let errors = [];
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }
    if (errors.length > 0) {
        response.render('register', {
            errors,
            name,
            email,
            password
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already exits' });
                    response.render('register', {
                        errors,
                        name,
                        email,
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    // Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hash
                            newUser.password = hash;
                            // Save user to Database
                            newUser.save()
                                .then(user => {
                                    request.flash('success_msg', 'You are now registered and can log in');
                                    response.redirect('/login')
                                })
                                .catch(err => console.log(err));
                        }))
                }
            })
    }
})

app.delete('/logout', (request, response) => {
    request.logOut(); //passport function that clear all session
    response.redirect('/login');
})

// checkAuth functions for protect routes 
function checkAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
        return next()
    }
    response.redirect('/login');
}

function checkNotAutnenticated(request, response, next) {
    if (request.isAuthenticated()) {
        return response.redirect('/');
    }
    next();
}
module.exports = app;