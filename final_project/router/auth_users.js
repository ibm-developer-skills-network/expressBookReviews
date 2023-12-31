const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
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
  const isbn = req.params.isbn;
  username = req.session.authorization["username"];
  let book = books[isbn];
  if (book) {
    let reviews = book["reviews"];
    let review = req.body.review;
    reviews[username] = review;
    res.status(200).send(book);
  } else {
    res.status(404).json({ message: "Book not found!" });
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  username = req.session.authorization["username"];
  let book = books[isbn];
  if (book) {
    let reviews = book["reviews"];
    delete reviews[username];
    res
      .status(200)
      .send(`${username} book review for ${book["title"]} has been deleted!`);
  } else {
    res.status(404).json({ message: "Book not found!" });
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
