const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//Function to check if the user exists
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
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Promise callback
public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
      try {
        const booksData = JSON.stringify(books, null, 4);
        resolve(booksData);
      } catch (error) {
        reject(error);
      }
    })
    .then((booksData) => {
      res.send(booksData);
    })
    .catch((error) => {
      res.status(500).send('An error occurred.');
    });
});

// Promise async-await
// public_users.get('/', async (req, res) => {
//     try {
//         const booksData = JSON.stringify(books, null, 4);
//         res.send(booksData);
//       } catch (error) {
//         res.status(500).send('An error occurred.');
//     }
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        try {
            const bookByIsbn = books[isbn];
            resolve(bookByIsbn);
        } catch (error) {
            reject(error);
        }
    })
    .then((bookByIsbn) => {
        res.send(bookByIsbn);
    })
    .catch((error) => {
        res.status(500).send('An error occurred.')
    })
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    const keys = Object.keys(books);
    let bookIdFound;
    for (let i = 0; i < keys.length; i++) {
      const bookId = keys[i];
      const book = books[bookId];
      if (book.author === author) {
          bookIdFound = bookId;
          break
      }
    }
    try {
        //const response = await axios.get('https://fakruzchalpa-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/Chinua%20Achebe');
        res.send(res.send(books[bookIdFound]));
    } catch (error) {
        res.status(500).send('An error occurred.');
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  const keys = Object.keys(books);
  let bookIdFound;
  for (let i=0; i<keys.length; i++) {
      const bookId = keys[i];
      const book = books[bookId];
      if (book.title === title) {
          bookIdFound = bookId;
          break
      }
  }
  try {
    res.send(books[bookIdFound]);
  } catch (error) {
    res.status(500).send('An error occurred.');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;