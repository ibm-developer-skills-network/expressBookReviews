const express = require('express');

const routes = require('./router/practiceuser.js')


const app = express();

const PORT =5000;

app.use(express.json());
app.use("/user", routes);

app.listen(PORT,()=>console.log("Server is running"));
