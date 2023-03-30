const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

  if (username === "" || username === null) {
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    if (users[username] === password) {
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if(!username || !password) {
      return res.status(400).json("Username and password are required." );
    }
    if(!isValid(username)) {
      return res.status(401).json("Invalid username." );
    }
    if(!authenticatedUser(username,password)) {
      return res.status(401).json("Invalid username or password." );
    }
    const token = jwt.sign({ username }, "secret_key");
    return res.json("Customer authenticated successfully.");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = jwt.decode(req.headers.authorization.split(" ")[1]).username;
    
    if (!review) {
      return res.status(400).json({message: "Review is required"});
    }
    
    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
  
    if (!books[isbn]["reviews"][user]) {
      books[isbn]["reviews"][user] = review;
      return res.json({message: "Review added successfully"});
    } else {
      books[isbn]["reviews"][user] = review;
      return res.json({message: "Review updated successfully"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
