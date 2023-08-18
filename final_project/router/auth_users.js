const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Function to check if a user is authenticated
const authenticatedUser = (username, password)=>{
  let validusers = users.filter((user)=>{ // Loop through each user in the users array
    // Add the user to the validUsers list
    // Check if the current user's username and password match the provided values
    return (user.username === username && user.password === password) 
  });

  // Check if there are any valid users in the validUsers list
  if(validusers.length > 0){
    // A valid user with the provided username and password exists
    return true;
  } 
  else {
    // No valid user with the provided username and password exists
    return false;
  }
}

// Route to handle user login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
    
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  }

  else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let foundMatchingISBN = false;
  const requestedIsbn = req.params.isbn; //gets the required isbn
  const data = req.body; //Access the data from the request body 
  const keys = Object.keys(data); //get the array of keys inside the data
  const bookKeys = Object.keys(books); //get the keys of the books
 
  for (const key of bookKeys) { //For each key inside bookKeys or books object
    const book = books[key] //assign Variable for the key of books as book
    if(book.isbn === requestedIsbn){
      for (const datakey of keys) {
        let reviewkeys = book.reviews;
        for(const value in data) {
          reviewkeys[datakey] = data[value];
          res.status(200).json(`Successfuly added review contaning key:${datakey} and value:${data[value]} with ISBN = ${requestedIsbn}`);
          foundMatchingISBN = true;
          break;
        } 
      }
    } 
  }

  if(!foundMatchingISBN){
    res.status(404).json({ message: `There is no matching ISBN = ${requestedIsbn} found on the database` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let foundMatchingISBN = false;
  const requestedIsbn = req.params.isbn; //gets the required isbn
  const data = req.body; //Access the data from the request body 
  const keys = Object.keys(data); //get the array of keys inside the data
  const bookKeys = Object.keys(books); //get the keys of the books
 
  for (const key of bookKeys) { //For each key inside bookKeys or books object
    const book = books[key] //assign Variable for the key of books as book
    if(book.isbn === requestedIsbn){
      const reviewKeys = Object.keys(book.reviews);
      for(const rkeys of reviewKeys){
        for (const datakey of keys) {
          let keyToDelete = datakey;
          if(rkeys === keyToDelete){
            delete book.reviews[rkeys];
            res.status(200).json(`Successfuly deleted review contaning key:${datakey} with ISBN = ${requestedIsbn}`);
            foundMatchingISBN = true;
            break;
          }
          else if (rkeys != keyToDelete) {
            continue;
          }
          else{
            res.status(200).json(`key:${datakey} with ISBN = ${requestedIsbn} is not found`);
          }
        }
      }
    } 
  }

  if(!foundMatchingISBN){
    res.status(404).json({ message: `There is no matching ISBN = ${requestedIsbn} found on the database` });
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;