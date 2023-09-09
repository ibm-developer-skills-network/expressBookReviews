const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username": "James Smith",
  "password": "1234"
}
];

const isValid = (username)=>{ 
  const user = users.filter(user => user.username === username);
  if(user.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  const user = users.filter(user => user.username === username);
  if (username === user[0].username && password === user[0].password) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
 
  if(isValid(username) && authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access')
    req.session.authorization = { accessToken}
    req.session.user = username

    return res.status(200).json({message: "User logged in"});
  }
  
  return res.status(401).json({message: "Access Denied"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const userReview = req.query.review;
  const user = req.session.user

  const bookToBeReviewed = Object.values(books).filter(book => book.isbn === isbn);
  const reviews = bookToBeReviewed[0].reviews;
  reviews.review = userReview;
  reviews.username = user;
  //Add review to session
  req.session.book = bookToBeReviewed;
  
  return res.status(200).json({message: `Review: '${userReview}' was added by '${user}'`, book: bookToBeReviewed});
});

//Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const bookToDeleteReview = Object.values(books).filter(book => book.isbn === isbn);

  if(bookToDeleteReview.length > 0) {
    if(req.session.user === bookToDeleteReview[0].reviews.username) {
      delete bookToDeleteReview.reviews[0].review;
      delete bookToDeleteReview.reviews[0].username;
      return res.status(200).json({message: "success", book: bookToDeleteReview});
    }
  }
  return res.status(200).json({message: "Review deleted", book: bookToDeleteReview});
  return res.status(403).json({message: "Access Denied to delete review", book: bookToDeleteReview});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
