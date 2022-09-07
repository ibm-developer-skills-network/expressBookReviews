const express = require('express');

const routes = require('./routes.js');

// const jwt = require('jsonwebtoken');

const app = express();
const PORT =5000;


app.use("/home", function (req, res, next) {

    console.log('The user is logged in! Time:', Date.now())
    next();
});

app.use("/home", routes);

app.listen(PORT,()=>console.log("Server is running"));
