const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"customer_fingerprint",resave: true, saveUninitialized: true}),function (req,res,next) {
    console.log(req.session.id + " index");
    next();
});

app.use("/customer/auth/*", function auth(req,res,next){
    // console.log(JSON.stringify(req.session.id) + " OOOOOOOOOOOOOOOOOO")
    if (req.session.authorization) {
        jwt.verify(req.session.authorization.accessToken, 'access', (err,user) => {
            if (!err) {
                req.user = user;
                // console.log(JSON.stringify(req.session.authorization) + " ________________");
                console.log(req.session.id + " cust/auth");
                next();
            } else {
                console.log(req.session.id + " cust/auth");
                return res.status(403).send("User not authenticated!");
            }
        });
    } else {
        console.log(req.session.id + " cust/auth");
        return res.status(403).send("User not logged in");
    }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
