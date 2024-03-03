
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const registered = require('./router/auth_users.js').authenticated;
const public = require('./router/general.js').general;

const app = express();
const port = 5000;


app.use(express.json());
app.use('/customer', session({ secret: 'fingerprint_customer', resave: true, saveUninitialized: true }));


app.use('/customer/auth/*', function auth(req, res, next) {

    // Write the authenication mechanism here

});


app.use('/customer', registered);
app.use('/', public);

app.listen(port, () => console.log('Server is running'));