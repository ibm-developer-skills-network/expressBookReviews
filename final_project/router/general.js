const express = require('express');
const session = require('express-session')
let books = require("./booksdb.js");
const jwt = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const app = express();

let matchingBooks = [];
let matchingTitles = [];
let matchingIsbn = [];

// Configure session middleware
app.use(session({secret:"fingerpint"}, resave=true, saveUninitialized=true));

//Function to check if a user exists
const doesExist = (username)=>{
  // Initialize an empty list to store users with the same username
  let userswithsamename = users.filter((user)=>{
    // Loop through each user in the users array
    // The loop iterates over each user in the array to compare usernames
    return user.username === username
  });

  // Check if there are any users in the userswithsamename array
  if(userswithsamename.length > 0){
    return true; // If there are users with the same name, return true
  }
  
  else {
    return false; // If no users with the same name, return false
  }
}

// Route to handle user registration
public_users.post("/register", (req,res) => {
  // Extract username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided in the request
  if (username && password) {
    // Check if the user already exists using a function doesExist()
    if (!doesExist(username)) { 
      // If user doesn't exist, add them to the 'users' array
      users.push({"username":username,"password":password});
      // Respond with a success message and status code 200
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } 
    else {
      // If user already exists, respond with an error message and status code 404
      return res.status(404).json({message: "User already exists!"});    
    }
  } 

  // If either username or password is missing, respond with an error message and status code 404
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 500);
  });

  myPromise.then(successData => {
    console.log("From Callback: ", successData);

    // Sending the JSON response to the client
    res.status(200).json(successData);
  }).catch(error => {
    console.error("Error: ", error);
    res.status(500).json({ message: "An error occurred while fetching books." });
  });

  //res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const requestedIsbn = req.params.isbn;
//   const bookKeys = Object.keys(books);
  
//   for (const key of bookKeys) {
//     const book = books[key];
//     if (book.isbn === requestedIsbn) {
//       matchingIsbn.push(book);
//     }
//   }

//   if (matchingIsbn.length > 0) {
//     res.status(200).json(matchingIsbn);
//   } 
//   else {
//     res.status(404).json({ message: "No books found by the provided author" });
//   }
// });

function getBookDetailsByIsbn(isbn) {
  return new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const matchingIsbn = [];

    for (const key of bookKeys) {
      const book = books[key];
      if (book.isbn === isbn) {
        matchingIsbn.push(book);
      }
    }

    if (matchingIsbn.length > 0) {
      resolve(matchingIsbn);
    } else {
      reject(new Error("No books found by the provided ISBN"));
    }
  });
}

public_users.get('/isbn/:isbn', (req, res) => {
  const requestedIsbn = req.params.isbn;

  getBookDetailsByIsbn(requestedIsbn)
    .then(matchingIsbn => {
      res.status(200).json(matchingIsbn);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});
  
// Get book details based on author
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    for (const key of bookKeys) {
      const book = books[key];
      if (book.author === author) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error("No books found by the provided author"));
    }
  });
}

public_users.get('/author/:author', (req, res) => {
  const requestedAuthor = req.params.author;

  getBooksByAuthor(requestedAuthor)
    .then(matchingBooks => {
      res.status(200).json(matchingBooks);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

// public_users.get('/author/:author',function (req, res) {
//   const requestedAuthor = req.params.author;
//   const bookKeys = Object.keys(books);

//   for (const key of bookKeys) {
//     const book = books[key];
//     if (book.author === requestedAuthor) {
//       matchingBooks.push(book);
//     }
//   }

//   if (matchingBooks.length > 0) {
//     res.status(200).json(matchingBooks);
//   } 
//   else {
//     res.status(404).json({ message: "No books found by the provided author" });
//   }
// });

// Get all books based on title
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const matchingTitles = [];

    for (const key of bookKeys) {
      const book = books[key];
      if (book.title === title) {
        matchingTitles.push(book);
      }
    }

    if (matchingTitles.length > 0) {
      resolve(matchingTitles);
    } else {
      reject(new Error("No Title found by the provided Title"));
    }
  });
}

public_users.get('/title/:title', (req, res) => {
  const requestedTitle = req.params.title;

  getBooksByTitle(requestedTitle)
    .then(matchingTitles => {
      res.status(200).json(matchingTitles);
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

// public_users.get('/title/:title',function (req, res) {
//   const requestedTitle = req.params.title;
//   const bookKeys = Object.keys(books);
  
//   for (const key of bookKeys) {
//     const book = books[key];
//     if (book.title === requestedTitle) {
//       matchingTitles.push(book);
//     }
//   }

//   if (matchingTitles.length > 0) {
//     res.status(200).json(matchingTitles);
//   } 
//   else {
//     res.status(404).json({ message: "No Title found by the provided Title" });
//   }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let foundMatchingISBN = false;
  const requestedIsbn = req.params.isbn; //gets the required isbn
  const bookKeys = Object.keys(books); //get the keys of the books

  for (const key of bookKeys) { 
    const book = books[key]
    if(book.isbn === requestedIsbn){
      res.status(200).json(book.reviews)
      foundMatchingISBN = true;
      break;
    }
  }
  if(!foundMatchingISBN){
    res.status(404).json({ message: "There is no matching ISBN found on the database" });
  }
});

module.exports.general = public_users;