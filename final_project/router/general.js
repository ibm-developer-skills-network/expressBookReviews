const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 const {username, password} = req.body;

 if(!username || !password){
   return res.status(400).json({message: "Invalid username or password"});
 }
 if(users.includes(username)){
   return res.status(409).json({message: "Username already exists"});
 }

  users.push(username);

  return res.status(201).json({message: "User registered successfully"});
});

// Middleware to check authentication
public_users.use((req, res, next) => {
  // Check if user is authenticated
  if (!isValid(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next(); // Continue to the next middleware/route handler
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await getBookList();
    return res.status(200).json({ books: bookList });
  } catch (error) {
    console.error("Error fetching book list:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Helper function to retrieve book list
function getBookList() {
  return new Promise((resolve, reject) => {
    try {
      const bookList = Object.values(books).map(book => {
        return {
          title: book.title,
          author: book.author,
          isbn: book.isbn
        };
      });
      resolve(bookList);
    } catch (error) {
      reject(error);
    }
  });
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const { isbn } = req.params;
    const bookDetails = await getBookDetails(isbn);
    return res.status(200).json(bookDetails);
  } catch (error) {
    console.error("Error fetching book details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Helper function to retrieve book details
function getBookDetails(isbn) {
  return new Promise((resolve, reject) => {
    try {
      if (books.hasOwnProperty(isbn)) {
        const bookDetails = books[isbn];
        resolve(bookDetails);
      } else {
        reject(new Error("Book not found"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const { author } = req.params;
    const booksByAuthor = await getBooksByAuthor(author);
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Helper function to retrieve books by author
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    try {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      resolve(booksByAuthor);
    } catch (error) {
      reject(error);
    }
  });
}


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const { title } = req.params;
    const booksWithTitle = await getBooksByTitle(title);
    if (booksWithTitle.length > 0) {
      return res.status(200).json(booksWithTitle);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    console.error("Error fetching books by title:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Helper function to retrieve books by title
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    try {
      const booksWithTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
      resolve(booksWithTitle);
    } catch (error) {
      reject(error);
    }
  });
}


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;
    if (Object.keys(bookReviews).length > 0) {
      return res.status(200).json({ reviews: bookReviews });
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
}
);

module.exports.general = public_users;
