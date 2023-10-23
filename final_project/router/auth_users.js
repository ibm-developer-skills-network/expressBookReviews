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


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let token = req.headers.authorization
  let username = req.query.username
  let review = req.query.review
  let isbn = req.params.isbn
  
   jwt.verify(token, "access", (err, decoded) => {
        console.log(decoded.username)
  })

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
