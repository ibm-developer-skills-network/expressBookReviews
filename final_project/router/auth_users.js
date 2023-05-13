const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return users.filter(user => user.username == username).length > 0 ? false : true;
}

const authenticatedUser = (username,password)=>{ 
    return users.filter(user => user.username == username && user.password == password).length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ errorMessage: "You have to provide username & password" });
    }
  
    if (authenticatedUser(username, password)) {
  
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
  const book = books[req.params.isbn];
  if(!req.query.review){
      res.send("Review is blank!");
  }
  if(!book){
      res.send("No book exists with isbn");
  }
  else{
    const username = req.session.authorization.username;
    const userHasReview = Object.keys(book.reviews).includes(username);
    if (userHasReview) {
      book.reviews[username].review = req.query.review;
    } 
    else {
      book.reviews[username] = {
        review: req.query.review
      }
    }
    return res.send(book);
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
  
    if (!book) {
      return res.status(404).json({ errorMessage: "Book not found" });
    } else {
      const username = req.session.authorization.username;
      const userHasReview = book.reviews[username];
  
      if (userHasReview) {
        delete book.reviews[username];
        return res.send(book);
      } else {
        return res.status(404).json({ errorMessage: "you did not add a review for this book" });
      }
    }
  
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
