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
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
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
  //Write your code here
  let review = req.body.review
  let username = req.body.username
  books[req.params.isbn].reviews.push({ username: username, review: review })
  return res.status(300).json({message: "Review: " + review + " added to " + JSON.stringify(books[req.params.isbn].title)});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.body.username
  let reviewIndex = books[req.params.isbn].reviews.findIndex(l => l.username === username)
  let deletedReview = books[req.params.isbn].reviews.filter(l => l.username === username)
  books[req.params.isbn].reviews[reviewIndex] = null
  return res.status(300).json({message: "Reviews: " + JSON.stringify(deletedReview) + " deleted from reviews: " + JSON.stringify(books[req.params.isbn].title)});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
