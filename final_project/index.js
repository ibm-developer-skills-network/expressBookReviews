const express = require('express');
const general_routes = require('./routes/general.js');
const customer_routes = require('./routes/customer.js');
const vendor_routes = require('./routes/vendor.js');
const jwt = require('jsonwebtoken');
const app = express();
const PORT =5000;
app.use(express.json());


//Middleware for general user (without authetication)
app.use("/general", general_routes);


//Middleware for customer (with authetication)
app.use("/customer", function auth(req,res,next){
    console.log("inside authentication!");
// Middleware which tells that the user is authenticated or not
   let token = req.headers["authorization"];
   token = token.split(" ")[1]; // Access Token
   jwt.verify(token, "access",(err,user)=>{
       if(!err){
           req.user = user;
           next();
       }
       else{
           return res.status(403).json({message: "Customer not authenticated"})
       }
    });
});
app.post("/customer", (req,res)=> {
    res.send("Customer access token authenticated!!");
});

app.use("/customer", customer_routes);

app.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
      let refreshToken = jwt.sign({
        data: user
      }, 'refresh', { expiresIn: 60 * 60 * 24});
    return res.status(201).json({
        accessToken,
        refreshToken
    })
});


//Middleware for vendor (with authetication)
app.use("/vendor", function auth(req,res,next){
    console.log("inside authentication!");
// Middleware which tells that the user is authenticated or not
   let token = req.headers["authorization"];
   token = token.split(" ")[1]; // Access Token
   jwt.verify(token, "access",(err,user)=>{
       if(!err){
           req.user = user;
           next();
       }
       else{
           return res.status(403).json({message: "Vendor not authenticated"})
       }
    });
});
app.post("/customer", (req,res)=> {
    res.send("Vendor access token authenticated!!");
});

app.use("/vendor", vendor_routes);

app.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
      let refreshToken = jwt.sign({
        data: user
      }, 'refresh', { expiresIn: 60 * 60 * 24});
    return res.status(201).json({
        accessToken,
        refreshToken
    })
});


app.listen(PORT,()=>console.log("Server is running"));