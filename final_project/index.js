const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const gen_routes = require('./router/general.js').general;
const jwt_Secret = '244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273';

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const auth_Header = req.headers.authorization;
    if (!auth_Header) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = auth_Header.split(' ')[1]; 


    jwt.verify(token, jwt_Secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }


        req.user = decoded;
        next(); 
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", gen_routes);

app.listen(PORT,()=>console.log("Server is running"));