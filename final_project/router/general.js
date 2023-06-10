const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Get the book list available in the shop
public_users.get('/users',function (req, res) {
    res.send(JSON.stringify({users},null,4));
});

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/books', (req, res) => {
    axios
      .get('https://samprasadss4-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/') // Replace with your API endpoint for fetching the book list
      .then(response => {
        //const books = response.data;
        res.json({ books });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch book list' });
      });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const booksArray = Object.values(books);
    let filtered_isbn  = booksArray.filter(book => book.isbn === isbn);
        res.send(filtered_isbn);
 });
  
 // Get book details based on ISBN
 public_users.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
  
    axios
      .get(`https://samprasadss4-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`) // Replace with your API endpoint for fetching book details based on ISBN
      .then(response => {
        const book = response.data;
        res.json({ book });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch book details' });
      });
  });
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksArray = Object.values(books);
    let filtered_author  = booksArray.filter(book => book.author === author);
    res.send(filtered_author);
});

// Get book details based on author
public_users.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
  
    axios
      .get(`https://samprasadss4-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`) // Replace with your API endpoint for fetching book details based on ISBN
      .then(response => {
        const book = response.data;
        res.json({ book });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch book details' });
      });
  });
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksArray = Object.values(books);
  let filtered_title  = booksArray.filter(book => book.title === title);
  res.send(filtered_title);
});


// Get book details based on title
public_users.get('/books/title/:title', (req, res) => {
    const title = req.params.title;
  
    axios
      .get(`https://samprasadss4-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`) // Replace with your API endpoint for fetching book details based on ISBN
      .then(response => {
        const book = response.data;
        res.json({ book });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch book details' });
      });
  });
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const booksArray = Object.values(books);
    let filtered_review  = booksArray.filter(book => book.isbn === isbn);
    const review = {
        "reviews": filtered_review[0].reviews
    };
    res.send(review);
});

  
module.exports.general = public_users;
