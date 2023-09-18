const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,11));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorParam = req.params.author;
    const bookDetails = [];

    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' array & check the author matches the one provided in the request parameters
    for (const key of bookKeys) {
      if (books[key].author === authorParam) {
        bookDetails.push(books[key]);
      }
    }
  
    if (bookDetails.length === 0) {
      res.status(404).json({ message: 'Author not found' });
    } else {
      res.status(200).json(bookDetails);
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleParam = req.params.title;
    const bookDetails = [];

    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' array & check the author matches the one provided in the request parameters
    for (const key of bookKeys) {
      if (books[key].title === titleParam) {
        bookDetails.push(books[key]);
      }
    }
  
    if (bookDetails.length === 0) {
      res.status(404).json({ message: 'Title not found' });
    } else {
      res.status(200).json(bookDetails);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnParam = req.params.isbn;

    // Get the book reviews based on ISBN provided in the request parameters
    const reviews = books[isbnParam];
  
    if (!reviews) {
      res.status(404).json({ message: 'No reviews found for the ISBN provided' });
    } else {
      res.status(200).json(reviews);
    }
});

// Get the list of books available in the shop using Promises
public_users.get('/books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// Get the book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
        if (req.params.isbn <= 10) {
        resolve(res.send(books[isbn]));
    }
        else {
            reject(res.send('ISBN not found'));
        }
    });
    get_books_isbn.
        then(function(){
            console.log("Promise for Task 11 resolved");
   }).
        catch(function () { 
                console.log('ISBN not found');
  });
});

// Get the book details based on author using Promises
public_users.get('/books/author/:author',function (req, res) {

    const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }


    });
    reject(res.send("Author does not exist"))
        
    });

    get_books_author.then(function(){
            console.log("Promise for Task 12 resolved");
   }).catch(function () { 
                console.log('Author does not exist');
  });
});

// Get the book details based on title using Promises
public_users.get('/books/title/:title',function (req, res) {

    const get_books_title = new Promise((resolve, reject) => {

    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
      }


    });
    reject(res.send("Title does not exist"))
        
    });

    get_books_title.then(function(){
            console.log("Promise for Task 13 resolved");
   }).catch(function () { 
                console.log('Title does not exist');
  });
});

module.exports.general = public_users;