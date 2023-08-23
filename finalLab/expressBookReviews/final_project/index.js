const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if a valid access token exists in the session
  if (req.session && req.session.accessToken) {
    try {
      // Verify the JWT access token using your secret key
      const decodedToken = jwt.verify(req.session.accessToken, 'FirasABIDLI');
      // If the token is valid, move to the next middleware
      next();
    } catch (error) {
      // If token verification fails, send a 403 Forbidden response
      res.status(403).json({ error: 'Access denied.' });
    }
  } else {
    // If no access token found in the session, send a 401 Unauthorized response
    res.status(401).json({ error: 'Unauthorized.' });
  }
});


const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
