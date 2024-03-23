const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (value)=>{ //returns boolean
    if(!value){
        return false
    }
    if(value.trim().length <=0){
        return false;
    }
    return true;
}

const userNameExists = username=>{
    return users.find(user=>user.username===username) !== undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const foundUser = users.find(user=>user.username===username);

    if (!foundUser) {
        return false;
    }

    return foundUser.password === password;

    
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    const {username,password}=user;
    if(!isValid(username) || !isValid(password)){
        return res.status(400).json({message: "Wrong Credentials"});

    }

    if(!authenticatedUser(username,password)){
        return res.status(400).json({message: "Wrong Credentials"});
    }
    
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken
    }
    return res.status(200).send({message:"User successfully logged in",accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.user.data;
  const newReview = req.body.review;
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(!book){
    return res.status(404).json({message: `Book not found`});  
  }
  
  const reviews = book.reviews;
  reviews[user.username] = newReview
  
  return res.status(200).json({message: "Review submitted"});
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.user.data;
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if(!book){
      return res.status(404).json({message: `Book not found`});  
    }
    
    delete book.reviews[user.username];
    
    return res.status(200).json({message: "Review deleted"});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.userNameExists = userNameExists;
