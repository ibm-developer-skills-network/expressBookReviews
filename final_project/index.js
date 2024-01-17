const jwt = require('jsonwebtoken');
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const customer_routes = require('./router/auth_users.js').authenticated;
const { authenticated, isValid, users } = require('./router/auth_users');
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use(cors());

// Set up express-session
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
}));

// Use your authenticated router
app.use('/customer/auth', authenticated);

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        console.log("Token Verified. User:", user);
        next();
      } else {
        console.error("Token Verification Error:", err);
        res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Use authenticated routes
app.use("/customer/auth", customer_routes);

// Use general routes
app.use("/customer/general", genl_routes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
