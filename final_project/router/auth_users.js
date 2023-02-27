const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const registeredUsers = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(u => u.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password)
}

//only registered users can login
registeredUsers.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

registeredUsers.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const { review } = req.query;
  const { username } = req.session.authorization;
  const targetBookReviews = books[isbn].reviews;

  let alreadyPostedReview = false;

  if (isbn in books) {
    for (let i = 0; i < targetBookReviews.length; i++) {
      if (targetBookReviews[i].username === username) {
        // Put in the new review
        targetBookReviews[i] = { ...targetBookReviews[i], content: review };
        alreadyPostedReview = true;
      }
    }

    if (!alreadyPostedReview) {
      targetBookReviews.push({ username, content: review });
    }

    return res.status(201).json({ data: JSON.stringify(books) });
  }

  return res.sendStatus(404);

});

registeredUsers.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const { username } = req.session.authorization;

  if (isbn in books) {
    books[isbn].reviews = books[isbn].reviews.filter(review => review.username !== username);
    res.sendStatus(204);
  }
  else {
    res.sendStatus(404);
  }
});

module.exports.authenticated = registeredUsers;
module.exports.isValid = isValid;
module.exports.users = users;
