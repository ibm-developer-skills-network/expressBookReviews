const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Validate required fields
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password.trim()
  ) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // Check whether the username already exists
  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  // Register the new user
  users.push({
    username,
    password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (Object.prototype.hasOwnProperty.call(books, isbn)) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }

  return res.status(404).json({
    message: "No books found for this author"
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }

  return res.status(404).json({
    message: "No books found for this title"
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (Object.prototype.hasOwnProperty.call(books, isbn)) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Task 10: Get all books using Axios and async/await
const getAllBooksAsync = async () => {
  try {
    const response = await axios.get("http://localhost:5000/");

    console.log("Books retrieved successfully:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error("Error retrieving books:", error.message);
    throw error;
  }
};

// Task 11: Get book details by ISBN using Axios and Promises
const getBookByISBNAsync = (isbn) => {
  return axios
    .get(`http://localhost:5000/isbn/${encodeURIComponent(isbn)}`)
    .then((response) => {
      console.log("Book retrieved successfully:");
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error retrieving book by ISBN:",
        error.response?.data || error.message
      );
      throw error;
    });
};

// Task 12: Get books by author using Axios and async/await
const getBooksByAuthorAsync = async (author) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    console.log("Books retrieved by author:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error(
      "Error retrieving books by author:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Task 13: Get books by title using Axios and async/await
const getBooksByTitleAsync = async (title) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    console.log("Books retrieved by title:");
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error(
      "Error retrieving books by title:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
