const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Authentication middleware
app.use('/customer/auth/*', function auth(req, res, next) {
  // Check if the token exists in the cookie
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/signin');
  }

  // Verify the token
  jwt.verify(token, 'your-secret-key', function (err, decoded) {
    if (err) {
      return res.redirect('/signin');
    }

    // Set the user ID in the session
    req.session.userId = decoded.id;
    next();
  });
});

app.use(express.static('public'));

const PORT = 5000;

const genl_routes = require('./router/general.js').general;
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));
