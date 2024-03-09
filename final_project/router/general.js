const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username=req.body.username;
  let password=req.body.password;

  
    if(username && password)
    {
        //we will chec wether that username already exist
       if(!doesExist(username))
       {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
       }
       else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    else{
    return res.status(400).json({message: "Please provide correct user nsme and password"})
}
  return res.status(300).json({message: "Yet to be implemented"});
});
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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const books1=[]
  const author=req.params.author;
  const keys1=Object.keys(books);
  console.log(keys1)
  const keyValue=keys1.filter((key)=>{
    return books[key].author===author
});
    console.log(keyValue);
for (let index = 0; index < keyValue.length; index++) {
  books1.push( books[keyValue[index]]);
}
  
  return res.status(200).json(books1);
 // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const books1=[]
  const title=req.params.title;
  const keys1=Object.keys(books);
  console.log(keys1)
  const keyValue=keys1.filter((key)=>{
    return books[key].title===title
   
})
console.log(keyValue);
for (let index = 0; index < keyValue.length; index++) {
  books1.push( books[keyValue[index]]);
}
  return res.status(200).json(books1);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn;

  return res.status(200).json(books[isbn].review);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
