const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
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
  //Write your code here
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
regd_users.put("/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!isbn || !review || !username) {
    return res.status(400).json({ message: "Invalid request. Please provide ISBN, review, and username" });
  }

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      // Modify existing review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Add new review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Retrieve username from the session
  
    if (!isbn || !username) {
      return res.status(400).json({ message: "Invalid request. Please provide ISBN and username" });
    }
  
    if (books[isbn]) {
      if (books[isbn].reviews[username]) {
        // Delete the review
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        return res.status(404).json({ message: "Review not found for the given ISBN and username" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  // ... (other code remains the same)
  
  module.exports.authenticated = regd_users;
  module.exports.doesExist = doesExist;
  module.exports.users = users;
  


