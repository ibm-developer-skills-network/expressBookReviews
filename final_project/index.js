
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const registered = require('./router/auth_users.js').authenticated;
const public = require('./router/general.js').general;

const app = express();
const port = 5000;

app.use(express.json());



app.use(
    '/customer',
    session({
        secret: 'should_be_env_variable',
        saveUninitialized: true,
        resave: true
    })
);

app.use('/customer/auth/*', function auth(req, res, next) {
    const auth = req.session.authorization;
    console.log('TEST TRY AUTH');
    if (auth) {
        jwt.verify(auth['token'], 'req.session.secret', (error, decoded) => {
            if (!error) {
                req.user = decoded.username;
                next()
            }
        })  
    }
    return res.status(401).json({ message: 'Unauthorized' })
});



app.use('/customer', registered);
app.use('/', public);

app.listen(port, () => console.log('Server is running'));
