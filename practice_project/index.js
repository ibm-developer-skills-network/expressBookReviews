const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const routes = require('./router/users.js')

const app = express();

app.use(express.json());

app.use(session({secret:"fingerpint",resave: true, saveUninitialized: true}))

app.use(express.json());

app.use("/user", function auth(req,res,next){
   let token = req.session.authorization;
   if(token) {
       token = token['accessToken'];
       jwt.verify(token, "access",(err,user)=>{
           if(!err){
               req.user = user;
               next();
           }
           else{
               return res.status(403).json({message: "User not authenticated"})
           }
        });
    } else {
        return res.status(403).json({message: "User not logged in"})
    }
});

app.post("/login", (req,res) => {
  const user = req.body.user;
  if (!user) {
      return res.status(404).json({message: "Error logging in"});
  }
  let accessToken = jwt.sign({
      data: user
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
  }
  return res.status(200).send("User successfully logged in");
});

const PORT =5000;

app.use("/user", routes);

app.listen(PORT,()=>console.log("Server is running"));
