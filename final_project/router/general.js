const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

//Basic check 
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


public_users.post("/register", (req,res) => {               //TASK 6
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  
  return res.status(300).json({message: "Yet to be implemented"});
});

/*********************** SYNC TASK *********************** USING PROMISES */

// Get the book list available in the shop              //TASK 10 ASYNC
public_users.get('/async_books', function (req, res)  {
  
    const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });

  get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// Get book details based on ISBN                       //TASK 11 ASYNC
public_users.get('/isbn_async/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;
    const get_isbn = new Promise((resolve, reject) => {
    
        resolve(res.send(books[isbn]));
      });
    
      get_isbn.then(() => console.log("Promise for find isbn "+ isbn));
    
    });
  
// Get book details based on author                      //TASK 12 ASYNC
public_users.get('/author_async/:author',function (req, res) {   
    
    const author = req.params.author;
    const get_author = new Promise((resolve, reject) => {
    
        resolve(res.send(searchByAuthor(author)));
      });
    
    get_author.then(() => console.log("Promise for find Author: " + author));    
    
 });

 // Get all books based on title                        //TASK 13 ASYNC
public_users.get('/title_async/:title',function (req, res) {      
    const title = req.params.title;
    const get_title = new Promise((resolve, reject) => {
    
        resolve(res.send(searchByTitle(title)));
      });
    
    get_title.then(() => console.log("Promise for find the Title: " + title));
    
 });
    
/****************** END ASYNC TASK ******************/
/***************     FUNCTIONS EXTRA *************/
function searchByAuthor(authorName) {
    let results = [];
    for (let bookId in books) {
      let book = books[bookId];
      if (book.author === authorName) {
        results.push(book);
      }
    }
    return results;
}
function searchByTitle(titleName) {
    let results = [];
    for (let bookId in books) {
      let book = books[bookId];
      if (book.title === titleName) {
        results.push(book);
      }
    }
    return results;
}
/*********************** SYNC TASK ***********************/
// Get the book list available in the shop              //TASK 1                    
public_users.get('/',function (req, res)  {
  
  res.send(JSON.stringify(books,null,4));               

});


// Get book details based on ISBN                       //TASK 2
 public_users.get('/isbn/:isbn', function (req, res) {
  
    const isbn = req.params.isbn;
    res.send(books[isbn]);
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {    //TASK 3
    
    const author = req.params.author;
    res.send(searchByAuthor(author));
    
    console.log("Find an Author: " + author);    
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {      //TASK 4
    const title = req.params.title;
    const get_title = new Promise((resolve, reject) => {
    res.send(searchByTitle(title));
      });
    
    console.log("Find the Title: " + title);
    
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {      //TASK 5
  
  const isbn = req.params.isbn;
  const review = req.params.review;
  
  console.log(books[isbn]["reviews"]);
  res.send(isbn + " new review finded!:" + books[isbn]["reviews"]);

});

module.exports.general = public_users;
