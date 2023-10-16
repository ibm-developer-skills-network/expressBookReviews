const express = require('express');
const axios = require('axios');
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
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
/* public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
}); */

//Get the book list in the shop using Promise-callbacks
public_users.get('/', (req, res) => {
  fetchAllBooks()
    .then((booksData) => {
      res.send(JSON.stringify(booksData, null, 4));
    })
    .catch((error) => {
      res.status(500).send("An error occurred while reading the books data.");
    });
});

// Function to fetch all books using a Promise
function fetchAllBooks() {
  return new Promise((resolve, reject) => {
    // Simulate a delay to simulate an async operation (you can replace this with your actual logic)
    setTimeout(() => {
      resolve(books);
    }, 1000); // Adjust the delay as needed
  });
}




// Get book details based on ISBN
/* public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 }); */
  
//Get book details based on ISBN using Promise-callbacks
//const books = require('./booksdb.js'); // Assuming you've already imported it

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  fetchBookByISBN(isbn)
    .then((book) => {
      if (book) {
        res.send(JSON.stringify(book, null, 4));
      } else {
        res.status(404).send("Book not found");
      }
    })
    .catch((error) => {
      res.status(500).send("An error occurred while fetching the book.");
    });
});

// Function to fetch a book by ISBN using a Promise
function fetchBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    // Simulate a delay to simulate an async operation (you can replace this with your actual logic)
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    }, 1000); // Adjust the delay as needed
  });
}



// Get book details based on author
/* public_users.get('/author/:author',function (req, res) {
  const authorToFind = req.params.author;
  const matchingBooks = [];

  // Iterate through the keys of the books object
  Object.keys(books).forEach((key) => {
    const book = books[key];
    if (book.author === authorToFind) {
      matchingBooks.push(book);
    }
  });

  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).send('Author not found');
  }
}); */

//Get book details based on author using Promise-callbacks
public_users.get('/author/:author', (req, res) => {
  const authorToFind = req.params.author;

  fetchBooksByAuthor(authorToFind)
    .then((matchingBooks) => {
      if (matchingBooks.length > 0) {
        res.send(matchingBooks);
      } else {
        res.status(404).send('Author not found');
      }
    })
    .catch((error) => {
      res.status(500).send("An error occurred while fetching books by author.");
    });
});

// Function to fetch books by author using a Promise
function fetchBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];

    // Simulate a delay to simulate an async operation (you can replace this with your actual logic)
    setTimeout(() => {
      // Iterate through the keys of the books object
      Object.keys(books).forEach((key) => {
        const book = books[key];
        if (book.author === author) {
          matchingBooks.push(book);
        }
      });

      resolve(matchingBooks);
    }, 1000); // Adjust the delay as needed
  });
}

// Get all books based on title
/* public_users.get('/title/:title',function (req, res) {
  const titleToFind = req.params.title;
  const matchingTitles = [];

  // Iterate through the keys of the books object
  Object.keys(books).forEach((key) => {
    const book = books[key];
    if (book.title === titleToFind) {
      matchingTitles.push(book);
    }
  });

  if (matchingTitles.length > 0) {
    res.send(matchingTitles);
  } else {
    res.status(404).send('Title not found');
  }
}); */

//Get book details based on title using Promise-callbacks
public_users.get('/title/:title', (req, res) => {
  const titleToFind = req.params.title;

  fetchBooksByTitle(titleToFind)
    .then((matchingTitles) => {
      if (matchingTitles.length > 0) {
        res.send(matchingTitles);
      } else {
        res.status(404).send('Title not found');
      }
    })
    .catch((error) => {
      res.status(500).send("An error occurred while fetching books by title.");
    });
});

// Function to fetch books by title using a Promise
function fetchBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const matchingTitles = [];

    // Simulate a delay to simulate an async operation (you can replace this with your actual logic)
    setTimeout(() => {
      // Iterate through the keys of the books object
      Object.keys(books).forEach((key) => {
        const book = books[key];
        if (book.title === title) {
          matchingTitles.push(book);
        }
      });

      resolve(matchingTitles);
    }, 1000); // Adjust the delay as needed
  });
}


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book.reviews)
});

module.exports.general = public_users;
