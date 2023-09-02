const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let trialusername = users.filter((user)=>{
    return user.username === username
  });
  if( trialusername.length>0){
    return true;
  }
  else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let regd_users = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(regd_users.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
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
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    let review = req.body.review
    if(review){
      book["review"] = review;
    }
    books[isbn]=book;
    res.send(`Book with the isbn ${isbn} updated.`);
  }
  else {
    res.send(`Can not find the book! `);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
