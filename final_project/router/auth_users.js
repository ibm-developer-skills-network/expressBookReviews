const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { v4: uuidv4 } = require('uuid');
const regd_users = express.Router();

let users = [
  {
    "usernmae":"Abdur",
    "password":"Abdur@2002"
  }
];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.get("/",(req,res)=>{
  res.status(200).json({message:"Hello there!"});
})
// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in. Please provide both username and password" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password
      },
      'access',
      { expiresIn: 60 * 60 * 60}
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
    res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review for authenticated users
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const newReview={
    "rating":req.body.rating,
    "comment":req.body.comment
  }
   const reviewId = uuidv4();
console.log(reviewId);
    // Add the new review to the existing reviews
    books[isbn].reviews[reviewId] = {
      ...newReview,
    }
res.status(200).json({message:"Review Added Successfull!"});
  console.log(isbn);
});

regd_users.delete("/auth/review/:isbn/:reviewId", (req, res) => {
  const isbn = req.params.isbn;
  const reviewId = req.params.reviewId;
 //start
 
  if (books.hasOwnProperty(isbn) && books[isbn].reviews && books[isbn].reviews.hasOwnProperty(reviewId)) {
    // Delete the review with the specified reviewId
    delete books[isbn].reviews[reviewId];

    // Return success response
    return res.status(200).json({ message: "Review deleted successfully", book: books[isbn] });
  } else {
    console.log('Book or review not found:', isbn, reviewId, books);
    return res.status(404).json({ message: "Book or review not found with the provided ISBN and review ID" });
  }
 //end

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
