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
const authenticatedUser = (username,password)=>{
    let validUsers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validUsers.length > 0){
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
        jwt.verify(token, "access",(err,user)=>{ 
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(300).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(300).json({message: "User not logged in"})
     }
 });

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.params.username;
    const password = req.params.password;
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
  return res.status(300).json({message: "Yet to be implemented"});;

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
