const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

// regd_users.post('/register', (req, res) => {

// });

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('calls login');
  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  let curUser = req.session.authorization.username
  console.log(req.session.authorization.username);
  let userReview = req.body.review;
  let isbn = req.params.isbn;
  // let booksArr = Object.keys(books).map((key) => books[key]);
  // let isbnBook = booksArr.filter((book) => book.isbn === isbn);
  let isbnBook = null;
  for (let bookId in books) {
    if (books.hasOwnProperty(bookId)) {
      let book = books[bookId];
      if (book.isbn === isbn) {
        console.log(book);
        isbnBook = book;
        if(book.reviews.length > 0){

        }else{
          let newId = uuidv4();
          // let review = {
          //   reviewId: newId,
          //   review: userReview,
          //   username: curUser
          // }
          book.reviews = {
            reviewId: newId,
            review: userReview,
            username: curUser
          }
        }
      }
    }
    if (isbnBook !== null) {
      return res
        .status(200)
        .json({ message: req.session.authorization.username, books: books});
    } else {
      return res
        .status(404)
        .json({ message: 'No book with ' + isbn + ' found!' });
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
