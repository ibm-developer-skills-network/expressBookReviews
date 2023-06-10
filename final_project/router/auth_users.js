const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password,
        username: username
      }, 'access', { expiresIn: 600 * 600 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        jwt.verify(token, "access", (err, user) => {
          if (!err) {
            const isbn = req.params.isbn;
            const reviewJson = req.body.reviews;
            const username = user.username;

            if (!isbn) {
              return res.status(400).json({ message: 'ISBN is required' });
            }
    
            if (!reviewJson) {
              return res.status(400).json({ message: 'Review is required' });
            }
            const booksArray = Object.values(books);

               // Find the book with the given ISBN
        const book = booksArray.find(b => b.isbn === isbn);

        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }
        // Check if the user has already posted a review for the given book
        if (book.reviews.name === reviewJson.name) {
            // Update the existing review
            book.reviews.comment = reviewJson.comment;
            return res.status(200).json({ message: 'Review updated' });
          } else {
            // Add a new review
            book.reviews = { name: username, comment: reviewJson.comment };
            return res.status(200).json({ message: 'Review added' });
          }

          } else {
            return res.status(403).json({ message: 'User not authenticated' });
          }
        });
      } else {
        return res.status(403).json({ message: 'User not logged in' });
      }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (req.session.authorization) {
      const token = req.session.authorization.accessToken;
      jwt.verify(token, "access", (err, user) => {
        if (!err) {
          const username = user.username;
          const isbn = req.params.isbn;
  
          if (!isbn) {
            return res.status(400).json({ message: 'ISBN is required' });
          }
  
          // Find the book with the given ISBN
          const booksArray = Object.values(books);

          // Find the book with the given ISBN
         const book = booksArray.find(b => b.isbn === isbn);  
          if (!book) {
            return res.status(404).json({ message: 'Book not found' });
          }
  
          // Check if the user has posted a review for the given book
          if (book.reviews.name === username) {
            // Delete the user's review
            delete book.reviews[username];
            return res.status(200).json({ message: 'Review deleted' });
          } else {
            return res.status(404).json({ message: 'Review not found' });
          }
        } else {
          return res.status(403).json({ message: 'User not authenticated' });
        }
      });
    } else {
      return res.status(403).json({ message: 'User not logged in' });
    }
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
