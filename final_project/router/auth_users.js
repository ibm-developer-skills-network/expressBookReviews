const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"user",password:"pwd"},{username:"user1",password:"pwd1"},{username:"user",password:"pwd2"}];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
};

regd_users.get("/users",(req,res)=>{
  res.send(users)
})
//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const currentUser = req.session.authorization.username;
  let existingUser = ""
  if (req.query.review) {
    for (const key of Object.keys(books[isbn].reviews)) {
        if (key === currentUser) {
          existingUser = key
        }
      }
    books[isbn].reviews[currentUser] = req.query.review;
    if(existingUser){
     res.send(currentUser + " review updated");
    }
    else{
      res.send(currentUser + " review added");
    }
  } else {
    res.send("please provide a valid review");
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const currentUser = req.session.authorization.username;
  let existingUser = ""
  for (const key of Object.keys(books[isbn].reviews)) {
    if (key === currentUser) {
      existingUser = key
    }
  }
  if(existingUser){
    delete books[isbn].reviews[currentUser]
    res.send("review deleted");
   }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
