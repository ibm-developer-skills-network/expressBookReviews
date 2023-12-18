const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const { addOrUpdateReview } = require('../utils/addOrUpdateReview.js');
const { deleteReview } = require('../utils/deleteReview.js');
let findBookByISBN = require('../utils/findBookByISBN.js').findBookByISBN;
const regd_users = express.Router();

let users = [{ username: 'Hiran', password: '1234' }];

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
    console.log(`Username: ${username} has logged In!`);
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
  // Get the current user
  let curUser = req.session.authorization.username;
  // Get the review from body
  let userReview = req.body.review;
  // get the isbn from the request params
  let isbn = req.params.isbn;

  // let booksArr = Object.keys(books).map((key) => books[key]);
  // let isbnBook = booksArr.filter((book) => book.isbn === isbn);

  // loop in books to search for the book and append review
  let book = findBookByISBN(isbn);
  if (book !== null) {
    console.log(book);
    addOrUpdateReview(book, curUser, userReview);
    res.send(books);
  } else {
    console.log('no such book found');
    res.status(404).json({ message: `No books with ${isbn} was found!` });
  }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  let curUser = req.session.authorization.username;
  console.log(curUser)
  // get the isbn from the request params
  let isbn = req.params.isbn;


  // loop in books to search for the book and delete review
  let book = findBookByISBN(isbn);


   
    const reviews = book.reviews;
    console.log(reviews)
    // Check if the user has a review
    if (reviews.hasOwnProperty(curUser)) {
      console.log(`Deleting review for User ${curUser}`);
      delete reviews[curUser];
    } else {
      console.log(`No review found for User ${curUser}`);
    }

    // Output the updated book object
    console.log(books);
    res.status(304).json({"message": "Review deleted"})
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
