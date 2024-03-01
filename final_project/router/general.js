const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred" });
    } else {
      return res.status(400).json({ message: "User already exists. Try to Log in" });
    }
  } 
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {

    const bookList = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000); 
    });

    res.status(200).json(bookList);
} catch (error) {
    res.status(500).json({ message: "Failed to fetch book list" });
}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const details = await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error('Book not found'));
            }
        }, 1000);
    });

    res.status(200).json(details);
} catch (error) {
    res.status(404).json({ message: "Book not found" });
}
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
    try {
        const author = req.params.author;
        const booksAuthor = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const matchingBooks = Object.values(books).filter(book => book.author === author);
                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject(new Error('No books found for the author'));
                }
            }, 900); 
        });

        res.status(200).json(booksAuthor);
    } catch (error) {
        res.status(404).json({ message: "No books found for the author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
      const title = req.params.title;
      const booksTitle = await new Promise((resolve, reject) => {
          setTimeout(() => {
              const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
              if (matchingBooks.length > 0) {
                  resolve(matchingBooks);
              } else {
                  reject(new Error('No books found with the title'));
              }
          }, 900);
      });

      res.status(200).json(booksTitle);
  } catch (error) {
      res.status(404).json({ message: "No books found with the title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
