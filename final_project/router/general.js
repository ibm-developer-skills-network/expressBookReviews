const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a New user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const isValidUser = new Promise((resolve, reject) => {
    if (username && password) {
      if (!isValid(username)) {
        users.push({ "username": username, "password": password });
        resolve("User successfully registered. Now you can login.");
      } else {
        reject("User already exists!");
      }
    } else {
      reject("Unable to register user.");
    }
  });

  isValidUser
    .then((message) => {
      res.status(200).json({ message: message });
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = JSON.stringify(books, null, 4);
    res.send(bookList);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching book list' });
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (!books[isbn]) {
      reject("Invalid ISBN");
    } else {
      resolve(books[isbn]);
    }
  })
  .then(result => {
    res.send(result);
  })
  .catch(error => {
    res.status(403).json({ message: error });
  });
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  var author_book = [];
  var counter = 0;

  const promise = new Promise((resolve, reject) => {
    Object.keys(books).forEach(key => {
      if (books[key].author === author) {
        author_book[counter] = books[key];
        counter++;
      }
    });
    if (author_book.length <= 0) {
      reject({message: "Please provide Valid Author's Name"});
    } else {
      resolve(author_book);
    }
  });

  promise
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(403).json(error);
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let title_book = [];
  let counter = 0;

  const promise = new Promise((resolve, reject) => {
    Object.keys(books).forEach(key => {
      if (books[key].title === title) {
        title_book[counter] = books[key];
        counter++;
      }
    });
    if (title_book.length <= 0) {
      reject({ message: "Please provide valid title name" });
    } else {
      resolve(title_book);
    }
  });

  promise
    .then(data => res.send(data))
    .catch(error => res.status(403).json(error));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const promise = new Promise((resolve, reject) => {
    if (!books[isbn]) {
      reject({ message: "Invalid ISBN" });
    } else {
      resolve(books[isbn].reviews);
    }
  });

  promise
    .then(data => res.send(data))
    .catch(error => res.status(403).json(error));
});


module.exports.general = public_users;
