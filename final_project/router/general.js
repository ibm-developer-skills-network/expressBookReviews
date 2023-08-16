const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  username = req.body.username;
  password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username": username, "password": password});
      console.log(users);
      return res.status(200).json({message: "User " + username + " was created!"});
    } else res.status(400).json("User already exists!");
  } res.send("Error!!! please enter a username and password!");

});


const doesExist = (username) => {
  let sameName = users.filter((user) => {
    return user.username === username;
  });
  if (sameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

    //Get list of books with Promises and callbacks
// const getBooks = new Promise((resolve,reject) => {
//   // console.log(books);
//   if (books) {
//     resolve((books));
//   } else reject("There are no books!")
// })

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // getBooks.then((bookList) => {
  //   console.log(bookList);
  //   return bookList;
  // })
  return res.status(300).send(books);
});

    // Get book details based on ISBN with Promises and callbacks
// const byIsbn = function(bookNum) {
//   const bookByIsbn = new Promise((resolve,reject) => {
//     if (books[bookNum]) {
//       resolve(books[bookNum]);
//     } else reject("There is no book with this ISBN")
//   });

//   return bookByIsbn.then((book) => {
//     console.log(book);
//     return book;
//   },  console.log("There is no book with this ISBN"))
// }

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  bookNum = req.params.isbn;
  // const book = byIsbn(bookNum);
  return res.status(300).send(books[bookNum]);
 });

    // Get book details based on author using Promises and callbacks
// const byAuthor = function (author) {
//   let fromAuthor = [];
//   const booksByAuthor = new Promise ((resolve,reject) => {
//     for (x in books) {
//       if (books[x].author.toLowerCase() === author.toLowerCase()) {
//         fromAuthor.push(books[x]);
//       }
//     }
//     if (fromAuthor.length > 0) {
//       resolve(fromAuthor);
//       return fromAuthor;
//     }
//     else reject("There are no books by this author!");
//   });

//   booksByAuthor.then((books) => {
//     console.log(books);
//   })
// }



// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const fromAuthor=[];
  // byAuthor(author);
  for (x in books) {
    if (books[x].author.toLowerCase() === author.toLowerCase()) {
      fromAuthor.push(books[x]);
    }
  }
  return res.status(300).json(fromAuthor);
});

    //Get Book details based on title using Promise callbacks
// const byTitle = function (title)  {
//   const bookByTitle = new Promise((resolve,reject) => {
//     for (x in books) {
//       if (books[x].title.toLowerCase() === title.toLowerCase()) {
//         resolve(books[x]);
//       }
//     }
//     reject("There are no books with that title");
//   })

//   bookByTitle.then((book) => {
//     
//    console.log(book);
//   })
// }

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  // byTitle(title); 
  for (x in books) {
    if (books[x].title.toLowerCase() === title.toLowerCase()) {
      return res.status(300).json(books[x]);
    }
  }
  return res.status(300).json({message: "No book exists with that title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookNum = req.params.isbn;
  return res.status(300).json(books[bookNum].reviews);
});

module.exports.general = public_users;
