const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,11));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorParam = req.params.author;
    const bookDetails = [];

    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' array & check the author matches the one provided in the request parameters
    for (const key of bookKeys) {
      if (books[key].author === authorParam) {
        bookDetails.push(books[key]);
      }
    }
  
    if (bookDetails.length === 0) {
      res.status(404).json({ message: 'Author not found' });
    } else {
      res.status(200).json(bookDetails);
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleParam = req.params.title;
    const bookDetails = [];

    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' array & check the author matches the one provided in the request parameters
    for (const key of bookKeys) {
      if (books[key].title === titleParam) {
        bookDetails.push(books[key]);
      }
    }
  
    if (bookDetails.length === 0) {
      res.status(404).json({ message: 'Title not found' });
    } else {
      res.status(200).json(bookDetails);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnParam = req.params.isbn;

    // Get the book reviews based on ISBN provided in the request parameters
    const reviews = books[isbnParam];
  
    if (!reviews) {
      res.status(404).json({ message: 'No reviews found for the ISBN provided' });
    } else {
      res.status(200).json(reviews);
    }
});

// TASK 10: Get the list of books available in the shop using Promises
public_users.get('/books',function (req, res) {
    const getBookList = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      getBookList.then(() => console.log("Promise for Task 10 resolved"));
});

// TASK 11: Get the book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const getByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(new Error('ISBN not found'));
        }
    });

    getByIsbn
        .then((book) => {
            res.status(200).json(book);
            console.log("Promise for Task 11 resolved");
        })
        .catch((error) => {
            res.status(404).send(error.message);
            console.log('ISBN not found');
        });
});

// TASK 12: Get the book details based on author using Promises
public_users.get('/books/author/:author',function (req, res) {
    const author = req.params.author;

    const getByAuthor = new Promise((resolve, reject) => {
        const booksByAuthor = [];
        const isbns = Object.keys(books);

        isbns.forEach((isbn) => {
            if (books[isbn].author === author) {
                booksByAuthor.push({
                    isbn: isbn,
                    title: books[isbn].title,
                    reviews: books[isbn].reviews,
                });
            }
        });

        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject(new Error('Author does not exist'));
        }
    });

    getByAuthor
        .then((books) => {
            res.status(200).json(books);
            console.log("Promise for Task 12 resolved");
        })
        .catch((error) => {
            res.status(404).send(error.message);
            console.log('Author does not exist');
        });
});

// TASK 13: Get the book details based on title using Promises
public_users.get('/books/title/:title',function (req, res) {
    const title = req.params.title;

    const getByTitle = new Promise((resolve, reject) => {
        const booksByTitle = [];
        const isbns = Object.keys(books);

        isbns.forEach((isbn) => {
            if (books[isbn].title === title) {
                booksByTitle.push({
                    isbn: isbn,
                    author: books[isbn].author,
                    reviews: books[isbn].reviews,
                });
            }
        });

        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject(new Error('Title does not exist'));
        }
    });

    getByTitle
        .then((books) => {
            res.status(200).json(books);
            console.log("Promise for Task 13 resolved");
        })
        .catch((error) => {
            res.status(404).send(error.message);
            console.log('Title does not exist');
        });
});

module.exports.general = public_users;
