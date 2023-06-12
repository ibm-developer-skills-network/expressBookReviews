const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userwithSamename = users.filter((user) =>  {
      return user.username === username});

    if(userwithSamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.filter((user) => {
      return (user.username === username && user.password === password)});
    if(validUser.length > 0) {
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password) {
    if(authenticatedUser(username, password)) {
      let accesstoken = jwt.sign({data : password}, 'access', { expiresIn: 60 * 60 });
      req.session.authrization = {accesstoken,  username};
      return res.status(200).json({message: "Login successful"});
    } else {
      return res.status(400).json({message: "Invalid username or password"});
    }
  } else {
    return res.status(300).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  /*You have to give a review as a request query & it must get posted with the username (stored in the session) posted. 
  If the same user posts a different review on the same ISBN, 
  it should modify the existing review. If another user logs in and posts a review on the same ISBN, 
  it will get added as a different review under the same ISBN.*/
  let filteredBooks = books[isbn];
  if(filteredBooks) {
    let review = req.query.reviews;
    let reviewer = req.session.authrization['username'];
    if(review) {
      filteredBooks["reviews"][reviewer] = review;
      books[isbn] = filteredBooks;
    }
    res.send(`The review for the book with ISBN ${isbn} has been updated`);
  }  else {
    res.send(`The book with ISBN ${isbn} does not exist`);
  }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let filteredBooks = books[isbn];
  if(filteredBooks) {
    let reviewer = req.session.authrization['username'];
    if(filteredBooks["reviews"][reviewer]) {
      delete filteredBooks["reviews"][reviewer];
      books[isbn] = filteredBooks;
    }
    res.send(`The review for the book with ISBN ${isbn} has been deleted`);
  }  else {
    res.send(`The book with ISBN ${isbn} does not exist`);
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
