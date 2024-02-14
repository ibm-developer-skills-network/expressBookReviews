const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
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
    console.log(users);
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
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let booksArray = Object.values(books);
    let filteredBooks = booksArray.filter(book => book.isbn === isbn);

    const username = req.body.username;
    const review = req.body.review;
    const findUser = filteredBooks.find((item) => item.user === username)
    if(findUser){
        findUser.review = {user: username, review: review }
    }else{
        findUser.review.push({user: username, review: review })
    }
    return res.status(200).send("Update");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let booksArray = Object.values(books);
    let filteredBooks = booksArray.filter(book => book.isbn === isbn);

    const username = req.body.username;
    const findUser = filteredBooks.find((item) => item.user !== username)
    return res.status(200).send(`Delete with exist ${findUser} `);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
