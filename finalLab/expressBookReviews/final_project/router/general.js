const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!isValid(username) || !password) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Check if the username already exists
    if (Object.keys(users).includes(username)) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Add the new user to the 'users' object
    users[username] = { username, password };

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user." });
  }
});

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
  return new Promise((resolve, reject) => {
    const bookList = Object.values(books).map(book => {
      return {
        title: book.title,
        author: book.author,
        reviews: book.reviews
      };
    });

    const response = {
      message: "List of books available in the shop",
      books: bookList
    };

    resolve(response);
  })
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(500).json({ message: "Error retrieving book list." });
  });
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];

      const response = {
        message: "Book details based on ISBN",
        book: {
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews
        }
      };

      resolve(response);
    } else {
      reject(new Error("Book not found."));
    }
  })
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(404).json({ message: error.message });
  });
});


// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  return new Promise((resolve, reject) => {
    const matchingBooks = Object.keys(books).filter(isbn => books[isbn].author === author);

    if (matchingBooks.length > 0) {
      const bookDetails = matchingBooks.map(isbn => {
        const book = books[isbn];
        return {
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews
        };
      });

      const response = {
        message: "Books by the specified author",
        books: bookDetails
      };

      resolve(response);
    } else {
      reject(new Error("No books found by the specified author."));
    }
  })
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(404).json({ message: error.message });
  });
});


// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  return new Promise((resolve, reject) => {
    const matchingBooks = Object.keys(books).filter(isbn => books[isbn].title.toLowerCase().includes(title.toLowerCase()));

    if (matchingBooks.length > 0) {
      const bookDetails = matchingBooks.map(isbn => {
        const book = books[isbn];
        return {
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews
        };
      });

      const response = {
        message: "Books with the specified title",
        books: bookDetails
      };

      resolve(response);
    } else {
      reject(new Error("No books found with the specified title."));
    }
  })
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(404).json({ message: error.message });
  });
});


// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters

  // Check if the book with the specified ISBN exists
  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;

    const response = {
      message: "Book reviews based on ISBN",
      isbn: isbn,
      reviews: bookReviews
    };

    return res.status(200).json(response);
  } else {
    // If the book with the specified ISBN is not found, send a response indicating that
    return res.status(404).json({ message: "Book not found." });
  }
});



module.exports.general = public_users;
