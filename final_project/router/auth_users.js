const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
		username: 'maintester123',
		password: 'password2',
	}
];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return false;
      } else {
        return true;
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
  
      req.session.authorization = {accessToken,username}
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const curr = req.session.authorization.username
    const userReview = req.params.review;
    const isbn = req.params.isbn;
    let bookReviews = books[isbn].reviews;
    let rExists = false;
    for (const username in bookReviews) {
        if (username === curr) {
            bookReviews[curr] = userReview;
            rExists = true;
            break;
        }
    }
    if (!rExists) {
        bookReviews[curr] = userReview;
    }
    res.send("The user's review has been added/updated successfully.");
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const curr = req.session.authorization.username;
    const isbn = req.params.isbn;
    const bookReviews = books[isbn].reviews;
    let rExists = false;
    for (const username in bookReviews) {
        if (username === curr) {
            delete bookReviews[curr];
            rExists = true;
            break;
        }
    }
    if (!rExists) {
        res.send("The User was unable to delete the review.");
    }
    res.send("The User deleted the review successfully.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
