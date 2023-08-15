const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
let books = require("./booksdb.js");

let users = [];

const isValid = (username) => { //returns boolean

  let userswithsamename = users.filter((user) => {
    return user.username === username
  });

  if(userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean

  // write code to check if username and password match the one we have in records.

  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {

  // Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send("User successfully logged in");

  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  // Write your code here

  const isbn      = req.params.isbn;
  const username  = req.body.username;
  const newReview = req.body.review;
  let   book      = books[isbn];
  let   reviews   = books[isbn]["reviews"];

  if (isValid(username))
  {
    // console.log("username: " + username); 
    if (reviews)
    {
      // console.log(JSON.stringify(reviews)); 
      let review = reviews[username];
      // console.log("newReview: " + newReview);
      books[isbn]["reviews"][username] = newReview;
    }

    return res.status(200).json({message: "Thank you " + username + " for adding a review!"});
  }
  else {
    return res.status(208).json({message: "Invalid username '" + username + "'"});
  }

});

// Delete a book review
regd_users.delete("/auth/delete/:isbn", (req, res) => {

  // Write your code here

  const isbn      = req.params.isbn;
  const username  = req.body.username;
  let   book      = books[isbn];
  let   reviews   = books[isbn]["reviews"];

  if (isValid(username))
  {
    // console.log("username: " + username); 
    if (reviews)
    {
      // console.log(JSON.stringify(reviews)); 
      let review = reviews[username];
      if (review) {

      }
      delete books[isbn]["reviews"][username];
    }

    return res.status(200).json({message: "Review deleted for user " + username});
  }
  else {
    return res.status(208).json({message: "Invalid username '" + username + "'"});
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
