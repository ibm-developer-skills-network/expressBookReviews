const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username" : "testuser",
        "password" : "test1234"
    }
];
  
const isValid = (username)=>{ //returns boolean
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
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
let filtered_book_detail = books[isbn]
if (filtered_book_detail) {
    let review = req.query.review;
    let book_reviewer = req.session.authorization['username'];
    if(review) {
      filtered_book_detail['reviews'][book_reviewer] = review;
        books[isbn] = filtered_book_detail;
    }
    res.send(`The review for the book with isbn  ${isbn} has been added/updated.`);
}
else{
    res.send("Unable to find the book with this isbn!");
}
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book_reviewer = req.session.authorization['username'];
  let filtered_review = books[isbn]["reviews"];
  if (filtered_review[book_reviewer]){
      delete filtered_review[book_reviewer];
      res.send(`Reviews for the book with ISBN  ${isbn} posted by the user ${book_reviewer} is deleted.`);
  }
  else{
      res.send("Unable to delete the review, as it was been posted by a different user");
  }
});
  
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;