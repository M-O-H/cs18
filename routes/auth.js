const { request } = require('express');
const express = require('express');
const passport = require('passport')
const app = express();

// auth with google
// GET /auth/google
app.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// Google auth callback
// GET /auth/google/callback
app.get('/google/callback', passport.authenticate('google',
    { failureRedirect: '/login' }), (request, response) => {
        response.redirect('/main')
    }
)