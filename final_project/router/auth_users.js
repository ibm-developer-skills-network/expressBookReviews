const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [{"username": "jack", "password": "ciafardo"}];

const isValid = (username)=>{
    let repeat_users = users.filter((user) => user.username === username)
    if (repeat_users.length === 0){
        return true  
        
    }
    else{
        return false
    }
}

const authenticatedUser = (username,password)=>{ 
    for(const user of users){
        console.log(user.username)
        if (user.username === username && user.password === password){
            return true
        }
    return false    
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  return res.send("working")
  let username = req.body.username
  let password = req.body.password
  if (authenticatedUser(username, password)){
      let payload = {username, password}
      let secretKey = "secret"
      jwt.sign(payload, secretKey, { expiresIn: '1h' });

      return res.send("User logged in")
  }
  else{
      return res.send("incorrect creds")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
