const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "emre", password: "emre1" }];

const isValid = (username) => {
  //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const accessToken = req.session.authorization.accessToken;
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review;

  jwt.verify(accessToken, "access", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }

    if (!isValid(username)) {
      return res.status(403).json({ message: "Invalid user." });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }

    books[isbn].reviews[username] = review;

    return res
      .status(201)
      .json({
        message: "Review added/modified successfully.",
        review: books[isbn].reviews[username],
      });
  });
});

// Delete a book review for authenticated users
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const accessToken = req.session.authorization.accessToken;
  const username = getCurrentUser(req);
  const requestedIsbn = req.params.isbn;

  // Verify the user using the provided JWT token
  jwt.verify(accessToken, "access", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }

    // Check if the user is valid
    if (!isValid(username)) {
      return res.status(403).json({ message: "Invalid user." });
    }

    // Check if the book with the given ISBN exists
    if (!books.hasOwnProperty(requestedIsbn)) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Delete the review if it exists
    const bookReviews = books[requestedIsbn].reviews;

    if (bookReviews.hasOwnProperty(username)) {
      delete bookReviews[username];
      res.status(200).json({ message: "Review deleted successfully." });
    } else {
      res.status(404).json({ message: "Review not found." });
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
