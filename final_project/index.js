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
    console.log("Inside Customer Authentication!");
// Middleware which tells whether the customer is authenticated or not
   let token = req.headers["authorization"];

   //If a token is not provided
   if (token) {
    token = token.split(" ")[1]; // Access Token

    // Checking token  validity
    jwt.verify(token, "access",(err,customer)=>{
        if(!err){
            req.customer = customer;
            next();
        }
        else{
            return res.status(403).json({message: "Customer not authenticated!"})
        }
     });
   }
   //Error message if a token is not provided
   else{
    return res.status(403).json({message: "Invalid token!"})
   }  
});

app.post("/customer", (req,res)=> {
    res.send("Customer access token authenticated!");
});

app.use("/customer", routes);

app.post("/customerlogin", (req,res) => {
    const customer = req.body.customer;
    if (!customer) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: customer
      }, 'access', { expiresIn: 60 * 60 });
      let refreshToken = jwt.sign({
        data: customer
      }, 'refresh', { expiresIn: 60 * 60 * 24});
    return res.status(201).json({
        accessToken,
        refreshToken
    })
    
});



//Middleware for vendor (with authetication)

app.use("/vendor", function auth(req,res,next){
    console.log("Inside Vendor Authentication!");
// Middleware which tells whether the vendor is authenticated or not
   let token = req.headers["authorization"];

   //If a token is not provided
   if (token) {
    token = token.split(" ")[1]; // Access Token

    // Checking token  validity
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.vendor = vendor;
            next();
        }
        else{
            return res.status(403).json({message: "Vendor not authenticated!"})
        }
     });
   }
   //Error message if a token is not provided
   else{
    return res.status(403).json({message: "Invalid token!"})

   }
   
});

app.post("/vendor", (req,res)=> {
    res.send("Customer access token authenticated!");
});

app.use("/vendor", routes);

app.post("/vendorlogin", (req,res) => {
    const vendor = req.body.vendor;
    if (!vendor) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: vendor
      }, 'access', { expiresIn: 60 * 60 });
      let refreshToken = jwt.sign({
        data: vendor
      }, 'refresh', { expiresIn: 60 * 60 * 24});
    return res.status(201).json({
        accessToken,
        refreshToken
    })
    
});


app.listen(PORT,()=>console.log("Server is running"));
