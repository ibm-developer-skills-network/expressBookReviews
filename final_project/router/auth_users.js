const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUser = users.filter((user) => {
    return (user.username === username && user.password === password)
  })

  if (validUser.length > 0) return true;
  else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!password || !username) {
    return res.status(300).json({ message: "Try with valid user ans password" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    req.session.username = username;
    console.log(username)
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(200).send("User is not authenticated");
  }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  console.log(`user == ${username}, isbn = ${isbn},  review = ${review}`)

  if (!username) {
    return res.status(401).send('Unauthorized');
  }

  if (!isbn || !review) {
    return res.status(400).send('ISBN and review are required');
  }

  // Check if the book with given ISBN exists
  if (!books[isbn]) {
    return res.status(404).send('Book not found');
  }

  // Check if the user already posted a review for this ISBN
  if (books[isbn].reviews.hasOwnProperty(username)) {
    // Modify existing review
    books[isbn].reviews[username] = review;
    return res.status(200).send('Review updated');
  } else {
    // Add new review
    books[isbn].reviews[username] = review;
    return res.status(201).send('Review added');
  }
});

// delete book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;

  if (!username) {
    return res.status(401).send('Unauthorized');
  }

  if (!isbn) {
    return res.status(400).send('ISBN is required');
  }

  // Check if the book with given ISBN exists
  if (!books[isbn]) {
    return res.status(404).send('Book not found');
  }



  if (books.hasOwnProperty(isbn)) {
    // Check if the book has any reviews
    if (Object.keys(books[isbn].reviews).length > 0) {
      // Check if the given username has a review for this book
      if (books[isbn].reviews.hasOwnProperty(username)) {
        // Delete the review associated with the given username
        delete books[isbn].reviews[username];
        return res.status(201).send(`Review deleted of ${username}`);
      } else {
        return res.send(`No review found for user '${username}' in book ${isbn}.`);
      }
    } else {
      return res.send(`No reviews available for book ${isbn}.`);
    }
  } else {
    return res.status(404).send(`Book with numeric key ${isbn} not found.`);
  }


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
