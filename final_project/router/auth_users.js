const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
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
    }, 'access', { expiresIn: 60 * 60 * 60});
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
    const review = req.query.review;
    const username = req.session.authorization ? req.session.authorization.username : null;
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    // Find the book in the 'books' object
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has already reviewed this book
    if (book.reviews.hasOwnProperty(username)) {
      // User has already reviewed the book, modify the existing review
      book.reviews[username] = review;
    } else {
      // User hasn't reviewed the book yet, add a new review
      book.reviews[username] = review;
    }
  
    return res.send(`The review for the book with ISBN ${isbn} has been added/updated`)
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;
  
    // Find the book in the 'books' object
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has a review for this book
    if (book.reviews.hasOwnProperty(username)) {
      // Delete the user's review
      delete book.reviews[username];
      return res.send(`Review for the isbn ${isbn} posted by the user ${username} deleted`);
    } else {
      return res.status(404).json({ message: "User has no review for this book" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
