const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolea
    return ((users.filter((user) => { user.username === username })).length) > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
    return ((users.filter((user) => user.username === username && user.password === password)).length) > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username_input = req.body.username;
    const password_input = req.body.password;
  
    if (!username_input || !password_input) {
      return res.status(404).json({ message: "missing username or password input" });
    }
  
    if (authenticatedUser(username_input, password_input)) {
      let accessToken = jwt.sign({
        
        data: password_input,

      }, 'access', {expiresIn: 60 * 60})
      req.session.authorization = {
        accessToken, username_input
      }
      return res.status(200).send("User logged in successfully");      
    }
    else {
      return res.status(208).json({ message: "Invalid cridentials. Check Username or Password" });
    }
  });

  regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review_input = req.body.review;
    const username_status = req.session.authorization.username;
    console.log("add review: ", req.params, req.body, req.session);
    if (books[isbn]) {
      let book_target = books[isbn];
      book_target.reviews[username_status] = review_input;
      return res.status(200).send(`The review of ISBN ${isbn} has been added/modified`);
    }
    else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
  });
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username_status = req.session.authorization.username;
    if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username_status];
      return res.status(200).send(`Review for book with ISBN ${isbn} has been deleted`);
    }
    else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
  });
