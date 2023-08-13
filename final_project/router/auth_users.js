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
  const { username, password } = req.body;

  // Validate inputs
  if(!username || !password) {
    return res.status(400).send('Username and password required');
  }

  // Find user with matching credentials
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if(!user) {
    return res.status(401).send('Invalid username or password'); 
  }

  // Generate JWT
  const token = jwt.sign({
    username: user.username
  }, 'secret');

  // Save JWT to session 
  req.session.jwt = token;

  // Return success response
  res.status(200).send('Login successful');
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn, review } = req.query;
  const username = req.session.user.username;

  // Validate inputs
  if(!isbn || !review) {
    return res.status(400).send('ISBN and review required');
  }

  // Find book by ISBN
  const book = books.find(b => b.isbn === isbn);

  // Check if review already exists
  const existingReview = book.reviews.find(r => r.username === username);

  if(existingReview) {
    // Update existing review
    existingReview.review = review;
  } else {
    // Add new review
    book.reviews.push({
      username, 
      review
    });
  }

  res.send('Review saved');
  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (req.session.username) {
    User.findOne({ username: req.session.username }, (err, user) => {
      if (err) {
        return res.status(500).send(err);
      }

      const review = user.reviews.find(r => r.isbn === req.params.isbn);
      if (!review) {
        return res.status(404).send("Review not found"); 
      }

      user.reviews.remove(review);
      user.save((err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.sendStatus(200);
      });
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
