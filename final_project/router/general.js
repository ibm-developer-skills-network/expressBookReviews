const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  username = req.body.username
  password = req.body.password
  if (username && password){
    if(!doesExist(username)){
        users.push({"username":username,"password":password})
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else{
        return res.status(403).json({message: "User already registered"});
    }
  }
  return res.status(403).json({message: "No username and/or password provided"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res){
    try {
      const res = await axios.get('https://seangmmurphy-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
      res.send(JSON.stringify(response.data.books, null, 4));
      console.log("Promise for Task 10 resolved");
    }
    catch (err) {
      console.log(err)
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res){
    let isbn = req.params.isbn
    try {
      const res = await axios.get('https://seangmmurphy-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
      res.send(JSON.stringify(response.data.books[isbn], null, 4));
      console.log("Promise for Task 11 resolved");
    }
    catch (err) {
      console.log(err)
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res){
    let author = req.params.author
    try {
      const res = await axios.get('https://seangmmurphy-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
      let results = Object.values(response.data.books).filter((book) => book.author === author)
      res.send(JSON.stringify(results, null, 4));
      console.log("Promise for Task 12 resolved");
    }
    catch (err) {
      console.log(err)
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res){
    let title = req.params.title
    try {
      const res = await axios.get('https://seangmmurphy-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
      let results = Object.values(response.data.books).filter((book) => book.title === title)
      res.send(JSON.stringify(results, null, 4));
      console.log("Promise for Task 13 resolved");
    }
    catch (err) {
      console.log(err)
    }
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  isbn = req.params.isbn
  book = books[isbn]
  return res.send(JSON.stringify(book.reviews,null,4));
});

module.exports.general = public_users;
