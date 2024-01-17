const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const userMatches = users.filter((user) => user.username === username);
    return userMatches.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
}
// Define registration endpoint
regd_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({
          username: username,
          password: password
        });
        return res.status(200).json({ message: `Customer successfully registered. Now you can login.` });
      } else {
        return res.status(409).json({ message: "Username already exists. Choose a different username." });
      }
    } else {
      return res.status(400).json({ message: "Invalid request. Provide both username and password." });
    }
  });


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  console.log("login: ", req.body);
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
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
      const isbn = req.params.isbn;
      const review = req.body.review;
      const username = req.session.authorization.username;
      console.log("add review: ", req.params, req.body, req.session);
      if (books[isbn]) {
          let book = books[isbn];
          book.reviews[username] = review;
          // Use backticks for template literals and include actual values
          return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
      }
      else {
          return res.status(404).json({ message: `ISBN ${isbn} not found` });
      }
  });
  

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      // Use backticks for template literals and include actual values
      return res.status(200).send(`Reviews for the book with ISBN ${isbn} posted by the user ${username} is deleted.`);
    } else {
      return res.status(404).json({ message: `ISBN ${isbn} not found` });
    }
  });



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
