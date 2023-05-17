const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const bookList = Object.values(books);
    const formattedBookList = JSON.stringify(bookList, null, 2);
    return res.status(200).send(formattedBookList);
});

//Using promises
/*
public_users.get('/', function (req, res) {
  new Promise(function(resolve, reject) {
    const bookList = Object.values(books);
    const formattedBookList = JSON.stringify(bookList, null, 2);
    resolve(formattedBookList);
  })
  .then(function(formattedBookList) {
    return res.status(200).send(formattedBookList);
  })
  .catch(function(error) {
    return res.status(500).json({ message: 'Failed to fetch book list' });
  });
});
*/ 



  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

//Using promises
/* 
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;

  new Promise(function(resolve, reject) {
    const book = books[isbn];
    if (book) {
      resolve({ book });
    } else {
      reject({ message: "Book not found" });
    }
  })
  .then(function(data) {
    return res.status(200).json(data);
  })
  .catch(function(error) {
    return res.status(404).json(error);
  });
});
*/





  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
    if (booksByAuthor.length > 0) {
      return res.status(200).json({ books: booksByAuthor });
    } else {
      return res.status(404).json({ message: "No books found by the author" });
    }
});

//Using promises
/* public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;

  new Promise(function(resolve, reject) {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve({ books: booksByAuthor });
    } else {
      reject({ message: "No books found by the author" });
    }
  })
  .then(function(data) {
    return res.status(200).json(data);
  })
  .catch(function(error) {
    return res.status(404).json(error);
  });
});
*/
  



// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  
    if (booksByTitle.length > 0) {
      return res.status(200).json({ books: booksByTitle });
    } else {
      return res.status(404).json({ message: "No books found with the given title" });
    }
});

//Using promises
/* public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;

  new Promise(function(resolve, reject) {
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    if (booksByTitle.length > 0) {
      resolve({ books: booksByTitle });
    } else {
      reject({ message: "No books found with the given title" });
    }
  })
  .then(function(data) {
    return res.status(200).json(data);
  })
  .catch(function(error) {
    return res.status(404).json(error);
  });
});
*/
  



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];
  
    if (book && Object.keys(book.reviews).length > 0) {
      return res.status(200).json({ reviews: book.reviews });
    } else if (book && Object.keys(book.reviews).length === 0) {
      return res.status(200).json({ message: "No reviews found for the book" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});




public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    console.log(username);
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});
   

module.exports.general = public_users;