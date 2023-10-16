const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
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
  const isbnToFind = req.params.isbn;
  const review = req.query.review; // Use request query for reviews
  const username = req.session.authorization.username; // Retrieve username from session

  if (!username) {
    return res.status(403).send("User not logged in"); // Handle case when user is not logged in
  }

  if (books[isbnToFind]) {
    // Check if the book has reviews
    if (!books[isbnToFind].reviews) {
      books[isbnToFind].reviews = {};
    }

    // Check if the user has already posted a review for this ISBN
    if (books[isbnToFind].reviews[username]) {
      // Update the existing review
      books[isbnToFind].reviews[username] = review;
    } else {
      // Add a new review for the user
      books[isbnToFind].reviews[username] = review;
    }

    res.send(books[isbnToFind]);
  } else {
    res.status(404).send("Book not found");
  }
});

// Delete a review by the user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnToFind = req.params.isbn;
  const username = req.session.authorization.username; // Retrieve username from session

  if (!username) {
    return res.status(403).send("User not logged in"); // Handle case when user is not logged in
  }

  if (books[isbnToFind] && books[isbnToFind].reviews && books[isbnToFind].reviews[username]) {
    // Check if the book and review exist
    // Delete the user's review
    delete books[isbnToFind].reviews[username];
    res.send(books[isbnToFind]);
  } else {
    res.status(404).send("Review not found"); // Handle the case where the review or book is not found
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
