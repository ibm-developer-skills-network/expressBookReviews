const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({ message: "User successfully registered. Now you can login." });
    } else {
      return res.status(404).json({ message: "User already exists! "});
    }
  }
  return res.status(404).json({message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  async function asyncBooks() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(res.status(300).json(books));
      }, 2000)
    });
    await promise;
  }
  asyncBooks()
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = parseInt(req.params.isbn);
  async function asyncBooksISBN() {
    const promiseISBN = new Promise((resolve, reject) => {
      let booksISBN = {};
      booksISBN[`${ISBN}`] = books[ISBN];
      setTimeout(() => {
        resolve(res.status(300).json(booksISBN));
      }, 2000)
    });
    await promiseISBN;
  }
  asyncBooksISBN()
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksWithSameAuthor = {};
  async function asyncAuthor() {
    const promiseAuthor = new Promise((resolve, reject) => {
      for (let key in books) {
        if (books[key]["author"] === author) {
          booksWithSameAuthor[`${key}`] = books[key];
        }
      }
      resolve(res.status(300).json(booksWithSameAuthor));
    })
    await promiseAuthor;
  }
  asyncAuthor()
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksWithSameTitle = {};
  async function asyncTitle(){
    const promiseTitle = new Promise((resolve, reject) => {
      for (let key in books){
        if(books[key]["title"] === title){
          booksWithSameTitle[`${key}`] = books[key];
        }
      }
      resolve(res.status(300).json(booksWithSameTitle));
    });
    await promiseTitle;
  }
  asyncTitle();
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  return res.status(300).json(books[ISBN]["reviews"]);
});

module.exports.general = public_users;
