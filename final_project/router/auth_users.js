const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 let userswithsamename = users.filter((user)=>{
  return user.username === username;
 });
 if(userswithsamename.length>0){
  return true;
 }
 else
 {
  return false;
 }
}

const authenticatedUser = (username,password)=>{ //returns boolean
 let validusers = users.filter((user)=>{
  return(user.username === username && user.password === password)
 });
 if(validusers.length >0)
 {
   return true;
 }
 else 
 {
  return false;
 }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
 const username = req.body.username;
 const password = req.body.password;
 
  if(!username || !password)
  {
    return res.status(404).json({message: "Error Loggin in"});
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data: password
    },  'access', {expiresIn: 60 * 60});
    req.session.authorization =
    {
      accessToken,username
    }
    return res.status(200).send("Customer Sucessfully logged in");

  }
  else
  {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  bookNum = req.params.isbn;
  if (books[bookNum]) {
    if (books[bookNum])
    if (!Array.isArray(books[bookNum].reviews)) {
      books[bookNum].reviews = [];
    }
    books[bookNum].reviews.push({ "username": req.session.authorization.username, "review": req.query.review});
    console.log(req.session.id + " review");
    return res.status(300).send("Review Added!");
  } else {
    console.log(req.session.id + " review");
    return res.send("There is no book with the isbn " + bookNum);
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  bookNum = req.params.isbn;
  user = req.session.authorization.username;
  let filteredReview = books[bookNum].reviews.filter((review) => 
      review.username != user);
  books[bookNum].reviews = filteredReview;
  return res.send(user + "'s Review Removed");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
