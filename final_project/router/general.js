const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  username = req.body.username
  password = req.body.password
  if (username && password) {
    if (isValid(username)) {
      users.push({
        username: username,
        password: password
      })
      return res.status(200).send("User successfully registered.");
    }
    return res.status(400).send("Username already exists.");
  }
  return res.status(400).send("Username and password are required.");
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(300).json({
    books: JSON.stringify(
      Object.keys(books).map((isbn) => {
        return {
          isbn: isbn,
          book: books[isbn],
        };
      })
    )
  });
});

// // Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  return res.status(300).json({
    book: books[req.params.isbn]
  });
});

// // Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let book_list = [];
  for (let i = 1; i <= Object.keys(books).length; i++) {
    if (books[i].author == req.params.author) {
      book_list.push(books[i])
    }
  }
  return res.status(300).json({
    book_list
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let book_list = [];
  for (let i = 1; i <= Object.keys(books).length; i++) {
    if (books[i].title == req.params.title) {
      book_list.push(books[i])
    }
  }
  return res.status(300).json({
    book_list
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({
    reviews: books[req.params.isbn].reviews
  });
});


// task 10
function getAllBooks() {
  return new Promise(
    (resolve, reject) => {
      resolve(Object.keys(books).map((isbn) => {
        return {
          isbn: isbn,
          book: books[isbn],
        };
      }));
    }
  )
}

public_users.get('/', function (req, res) {
  //Write your code here
  getAllBooks().then((book_list) => {
    return res.status(300).json({
      book_list
    });
  })
});

// task 11
function getBookByISBN(isbn) {
  return new Promise(
    (resolve, reject) => {
      resolve(books[isbn]);
    }
  )
}

public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  getBookByISBN(req.params.isbn).then((book) => {
    return res.status(300).json({
      book
    });
  })
});

// task 12
function getBookByAuthor(author) {
  return new Promise(
    (resolve, reject) => {
      let book_list = [];
      for (let i = 1; i <= Object.keys(books).length; i++) {
        if (books[i].author == author) {
          book_list.push(books[i])
        }
      }
      resolve(book_list);
    }

  )
}

public_users.get('/author/:author', function (req, res) {
  getBookByAuthor(req.params.author).then((book_list) => {
    return res.status(300).json({
      book_list
    });
  })
});

// task 13
function getBookByTitle(title) {
  return new Promise(
    (resolve, reject) => {
      let book_list = [];
      for (let i = 1; i <= Object.keys(books).length; i++) {
        if (books[i].title == title) {
          book_list.push(books[i])
        }
      }
      resolve(book_list);
    }
  )
}

public_users.get('/title/:title', function (req, res) {
  getBookByTitle(req.params.title).then((book_list) => {
    return res.status(300).json({
      book_list
    });
  })
});

module.exports.general = public_users;
