const express = require('express');
const general_routes = require('./routes/general.js');
const customer_routes = require('./routes/customer.js');
const vendor_routes = require('./routes/vendor.js');
const routes = require('./routes/booksdb.js');
const jwt = require('jsonwebtoken');
const app = express();
const PORT =5000;

app.use(express.json());


// GENERAL USER (WITHOUT LOGIN MIDDLEWARE)
app.use("/user", general_routes);


// CUSTOMER (WITH LOGIN MIDDLEWARE)
app.use("/customer", customer_routes, function auth(req,res,next){
    // Middleware for authenticating a customer
       let token = req.headers["authorization"];
       token = token.split(" ")[1]; // Access Token
       jwt.verify(token, "access",(err,user)=>{
           if(!err){
               req.user = user;
               next();
           }
           else{
               return res.status(403).json({message: "User not authenticated"})
           }
    });


    app.post("/protected", auth , (req,res)=> {
        res.send("Access token authenticated!!");
    });
    app.post("/login", (req,res) => {
        const user = req.body.user;
        if (!user) {
            return res.status(404).json({message: "Body Empty"});
        }
        let accessToken = jwt.sign(user ,"access", {expiresIn: '60s'});
        let refreshToken = jwt.sign(user,"refresh", {expiresIn:'7d'});
        return res.status(201).json({
            accessToken,
            refreshToken
        })
    });

});    

// VENDOR (WITH LOGIN MIDDLEWARE)    

app.use("/vendor", vendor_routes, function auth(req,res,next){
    // Middleware for authenticating a customer
       let token = req.headers["authorization"];
       token = token.split(" ")[1]; // Access Token
       jwt.verify(token, "access",(err,user)=>{
           if(!err){
               req.user = user;
               next();
           }
           else{
               return res.status(403).json({message: "User not authenticated"})
           }
    });

    app.post("/protected", auth , (req,res)=> {
        res.send("Access token authenticated!!");
    });
    app.post("/login", (req,res) => {
        const user = req.body.user;
        if (!user) {
            return res.status(404).json({message: "Body Empty"});
        }
        let accessToken = jwt.sign(user ,"access", {expiresIn: '60s'});
        let refreshToken = jwt.sign(user,"refresh", {expiresIn:'7d'});
        return res.status(201).json({
            accessToken,
            refreshToken
        })
    });  
});


app.listen(PORT,()=>console.log("Server is running"));