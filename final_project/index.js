const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


app.use("/customer/auth/*", function auth(req, res, next) {
    // Extract the token from the request header
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming token is sent as 'Bearer <token>'

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify the token
        const {JWT_SECRET} = process.env;
        const decoded = jwt.verify(token, JWT_SECRET); 
        req.user = decoded; // Add the decoded token to the request

        // Check if session exists for this user
        if (req.session && req.session.userId === req.user.id) {
            next(); // User is authenticated, proceed to the next middleware
        } else {
            return res.status(401).send('Invalid session.');
        }
    } catch (ex) {
        // Token verification failed
        return res.status(400).send('Invalid token.');
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
