const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
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
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    const isbn = req.params.isbn;
    let book = books[isbn]

    if (book && authenticatedUser(username,password)) { //Check if book exists and the user logged in
        let review = req.body.reviews;
        
        //Add review if username is different, otherwise it overwrites it
        books[isbn].reviews[username]=review;
        res.send(`Review for book with ISBN ${isbn} added.`);
    }
    else{
        res.send("Unable to find book!");
    }
  });


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    const isbn = req.params.isbn;
    let book = books[isbn]

    if (book && authenticatedUser(username,password) && Object.keys(books[isbn].reviews).length){
        delete books[isbn].reviews[username];
        res.send(`Review for user ${users.username} for ISBN ${isbn} deleted.`);
    }

    else{
        res.send(`No reviews to be deleted.`);
    }
    
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
