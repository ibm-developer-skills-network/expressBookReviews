const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  username = req.body.username
  password = req.body.password
  if(username && password){
    let userswithsamename = users.filter((user)=>{
        return user.username === username && user.password === password
      });
      let correct = false
      if(userswithsamename.length > 0){
        correct = true;
      } else {
        correct = false;
      }
    if(correct){
        let accessToken = jwt.sign({
            data: password
          }, 'access', { expiresIn: 60 * 60 });
          req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    }
    else{
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  }
  return res.status(403).json({message: "Username and/or password not provided"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  username = req.session.authorization["username"]
  isbn = req.params.isbn
  reviewText = req.query.reviewText
  book = books[isbn]
  reviews = book.reviews
  if (reviewText){
    reviews[username] = reviewText
    return res.status(200).json({message: "Review successfully added"});
  }
  else{
    return res.status(208).json({message: "No review text"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    username = req.session.authorization["username"]
    isbn = req.params.isbn
    book = books[isbn]
    reviews = book.reviews
    if(reviews[username]){
        delete reviews[username]
        return res.status(200).json({message: "Review successfully deleted"});
    }
    return res.status(208).json({message: "No review to delete"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
