const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "username1", password: "pwd123"}];

const isValid = (username) => {
    const userMatches = users.filter((user) => user.username === username);
    return userMatches.length > 0;
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

//only registered users can login
regd_users.post("/login", (req,res) => {
    console.log("login: ", req.body);
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60*60 }
      );
  
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).send("User successfully logged in");
    } else {
      return res
        .status(208)
        .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {  
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    console.log("add review: ", req.params, req.body, req.session);
    if (books[isbn]) {
      let book = books[isbn];
      book.reviews[username] = review;
      return res.status(200).send("Review successfully posted");
    } else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
});

// Delete the book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    console.log("delete review: ", req.params, req.body, req.session);
    if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send("Review successfully deleted");
    } else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;