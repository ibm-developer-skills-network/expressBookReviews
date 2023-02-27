// @ts-check

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');
const { authenticated } = require('./auth_users.js');
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    }
    else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." })
});

function getBooks() {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000').then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function getBookByIsbn(isbn) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/isbn/' + isbn).then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/author/' + author).then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/title/' + title).then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
  });
}

public_users.get('/', function (req, res) {
  res.status(200).json({ data: JSON.stringify(books, null, 4) });
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);

  if (isbn in books) {
    return res.status(200).send(books[isbn]);
  }

  res.sendStatus(404);
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  for (let key in Object.keys(books)) {
    let actualKey = parseInt(key);
    if (books[actualKey + 1].author === author) {
      booksByAuthor.push(books[actualKey]);
    }
  }

  res.status(200).json({ data: JSON.stringify(booksByAuthor, null, 4) });
});

public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  for (let key in Object.keys(books)) {
    let actualKey = parseInt(key);
    if (books[actualKey + 1].title === title) {
      return res.status(200).json({ data: JSON.stringify(books[actualKey + 1], null, 4) });
    }
  }

  res.sendStatus(404);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);

  if (isbn in books) {
    return res.status(200).json({ data: JSON.stringify(books[isbn].reviews, null, 4) });
  }

  res.sendStatus(404);
});

module.exports.general = public_users;
