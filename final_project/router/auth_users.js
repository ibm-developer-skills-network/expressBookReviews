const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
     let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}
const app = express();
app.use(express.json());
app.use(session({secret:"fingerpint"}))
app.use("/auth", function auth(req,res,next){
   if(req.session.authorization) { 
       token = req.session.authorization['accessToken'];
       jwt.verify(token, "access",(err,user)=>
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


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.param.username;
    const password = req.param.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => 
const username = req.username;
const password = req.password;
if (username && password) {
  if (!doesExist(username)) { 
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registred. Now you can login"});
  } else {
    return res.status(404).json({message: "User already exists!"});
  }
} 
return res.status(404).json({message: "Unable to register user."});
});
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

