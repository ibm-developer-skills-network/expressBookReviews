const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user) => {return user.username === username})
  if(userswithsamename.length > 0){
    return true
  }else{
    return false
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {return user.username === username && user.password === password})
  if(validusers.length > 0){
    return true
  }else{
    return false
  }
  }

  regd_users.get("/users",(req,res) => {
    res.send(users)
})

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password){
    return res.status(404).json({message:"login error"})
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    },'access',{expiresIn: 60 * 60})
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged")
  }else{
    return res.status(208).json({message:"login error, Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let filteredBooks = books[isbn];
  if(filteredBooks) {
    let review = req.query.reviews;
    let reviewer = req.session.authrization['username'];
    if(review) {
      filteredBooks["reviews"][reviewer] = review;
      books[isbn] = filteredBooks;
    }
    res.send(`The review for the book with ISBN ${isbn} has been updated`);
  }  else {
    res.send(`The book with ISBN ${isbn} does not exist`);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
