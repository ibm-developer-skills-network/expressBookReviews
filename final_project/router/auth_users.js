const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username": "user",
  "password": "password"
  }];


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

const authenticatedUser = (username,password)=>{ //returns boolean

  console.log ("Here authenticatedUser")
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

  console.log("login: ", req.body);

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
regd_users.put("/review/", (req, res) => { //regd_users.put("/auth/review/:isbn", (req, res) => {

  // Remember path endpoint : http://localhost:5000/customer/review/

  const my_isbn = req.body.isbn;
  const my_review = req.body.reviews;

  console.log (my_isbn + " (" + typeof(my_isbn)+")");
  console.log (my_review + " (" + typeof(my_review)+")");

  books[my_isbn]["reviews"] = {"1" : req.body.reviews}; // Future. Find way to create new id key each time new review is added.
  console.log (books[my_isbn]);

  res.send("<strong>Review Added!</strong><br>" + "<strong>Isbn : </strong>" + my_isbn + "<br><strong> Review: </strong>" + my_review );

});

regd_users.delete("/review/", (req, res) => {//regd_users.delete("/auth/review/:isbn", (req, res) => {

  const my_isbn = req.body.isbn;
  console.log (books[my_isbn]["reviews"]);

  books[my_isbn]["reviews"] = {"1" : " "};
  console.log (books[my_isbn]["reviews"]);

  res.send("<strong>Review Deleted!</strong><br>");

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
