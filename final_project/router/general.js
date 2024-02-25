const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userWithSameUsername = users.filter((user) => {
    return user.username === username
  });
  if (userWithSameUsername.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password })
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(200).json({ message: "User already exist" });
    }
  } else {
    return res.status(200).json({ message: "Can nor regidter, kindly try again with password and usernname" });
  }

});

// Get the book list available in the shop
// Define a function to get the book list
function getBookList() {
  return new Promise((resolve, reject) => {
    // Simulating asynchronous operation (fetching book list from the database)
    setTimeout(() => {
      // Assuming 'books' is your database
      resolve(books);
    }, 1000); // Simulating 1 second delay
  });
}

public_users.get('/', function (req, res) {
  //Write your code here
  getBookList()
    .then((bookList) => {
      res.status(200).send(JSON.stringify(bookList));
    })
    .catch((error) => {
      res.status(500).send('Error fetching book list: ' + error);
    });
});

// Get book details based on ISBN
function getBookDetailsByISBN(isbn) {
  return new Promise((resolve, reject) => {
    // Simulating asynchronous operation (fetching book details from the database)
    setTimeout(() => {
      const isbnBooks = books[isbn];
      if (isbnBooks) {
        resolve(isbnBooks);
      } else {
        reject(new Error(`Book with ISBN ${isbn} not found`));
      }
    }, 1000); // Simulating 1 second delay
  });
}
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Call the function to get book details based on ISBN
  getBookDetailsByISBN(isbn)
    .then((isbnBooks) => {
      res.status(200).send(JSON.stringify(isbnBooks, null, 4));
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

// Get book details based on author


// Define a function to find a book by author
function findBookByAuthor(authorName, booksObject) {
  return new Promise((resolve, reject) => {
    for (let key in booksObject) {
      if (booksObject.hasOwnProperty(key)) {
        let strdb = booksObject[key].author.trim();
        let strServer = authorName.trim();
        if (strdb.toLowerCase() === strServer.toLowerCase()) {
          resolve(booksObject[key]);
          return; // Exit the loop if a match is found
        }
      }
    }
    reject(new Error('Book with the specified author not found'));
  });
}

public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;

  // Call the function to find a book by author
  findBookByAuthor(author, books)
    .then((bookAuthor) => {
      res.status(200).send(JSON.stringify(bookAuthor, null, 4));
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

// Define a function to find a book by title
function findBookByTitle(title, booksObject) {
  return new Promise((resolve, reject) => {
    for (let key in booksObject) {
      if (booksObject.hasOwnProperty(key)) {
        let strdb = booksObject[key].title.trim();
        let strServer = title.trim();
        if (strdb.toLowerCase() === strServer.toLowerCase()) {
          resolve(booksObject[key]);
          return; // Exit the loop if a match is found
        }
      }
    }
    reject(new Error('Book with the specified title not found'));
  });
}
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  // Extract title from request parameters
  const title = req.params.title;

  // Call the function to find a book by title
  findBookByTitle(title, books)
    .then((bookTitle) => {
      res.status(200).send(JSON.stringify(bookTitle, null, 4));
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const isbnBooksReview = books[isbn].reviews;
  if (isbnBooksReview.length > 0) {
    return res.status(300).send(JSON.stringify(isbnBooksReview, null, 4));
  }
  console.log(isbnBooksReview)
  return res.status(300).json({ message: "No review found" });
});

module.exports.general = public_users;
