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
      return res.status(200).json({message: `User ${username_input} logged in successfully`});      
    }
    else {
      return res.status(208).json({ message: "Invalid cridentials. Check Username or Password" });
    }
  });

  regd_users.put("/auth/review/:id", (req, res) => {
    const id = req.params.id;
    const review_input = req.body.review;
    const username_status = req.session.authorization.username;
    console.log("add review: ", req.params, req.body, req.session);
    if (books[id]) {
      let book_target = books[id];
      book_target.reviews[username_status] = review_input;
      return res.status(200).json({message:`The review of ID ${id} has been added/modified`});
    }
    else {
      return res.status(404).json({ message: `ID ${id} not found` });
    }
  });
  
  regd_users.delete("/auth/review/:id", (req, res) => {
    const id = req.params.id;
    const username_status = req.session.authorization.username;
    if (books[id]) {
      let book = books[id];
      delete book.reviews[username_status];
      return res.status(200).send(`Review for book with ID ${id} has been deleted`);
    }
    else {
      return res.status(404).json({ message: `ID ${id} not found` });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;