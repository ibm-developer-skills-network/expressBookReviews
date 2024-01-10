const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        username: username,
        password: password
      })
      return res.status(200).json({ message: `User ${username} created` });
    }
    else {
      return res.status(400).json({ message: "User already exists" });
    }
  }
  else {
    return res.status(400).json({ message: "Invalid request" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 1000);
  });

  promise.then((value) => {
    return res.status(200).send(JSON.stringify(value, null, 4));
  }).catch((err) => {
    return res.status(404).send(`Requested book not found`);
  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books[req.params.isbn]), 1000);
  });

  promise.then((value) => {
    return res.status(200).send(JSON.stringify(value, null, 4));
  }).catch((err) => {
    return res.status(404).send(`Requested isbn not found`);
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 1000);
  });

  promise.then((value) => {
    let filtered = Object.values(value).filter(book => book.author === req.params.author);
    return res.status(200).send(JSON.stringify(filtered, null, 4));
  }
  ).catch((err) => {
    return res.status(404).send(`Requested author not found`);
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 1000);
  });

  promise.then((value) => {
    let filtered = Object.values(value).filter(book => book.title === req.params.title);
    return res.status(200).send(JSON.stringify(filtered, null, 4));
  }
  ).catch((err) => {
    return res.status(404).send(`Requested title not found`);
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books[req.params.isbn].reviews), 1000);
  });

  promise.then((value) => {
    return res.status(200).send(JSON.stringify(value, null, 4));
  }).catch((err) => {
    return res.status(404).send(`Requested isbn not found`);
  });
});

module.exports.general = public_users;
