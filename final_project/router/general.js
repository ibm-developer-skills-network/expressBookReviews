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
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login!"});
        } else {
            return res.status(404).json({message: "User already exist!"});
        }
    }
    return res.status(500).json({message: "Unable to register user."});
});
 

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

//Get the book list available in the shop using promise callbacks or async-await
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('https://chimaisiguzo-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai//books');
      
      const books = response.data;
  
      // Sending the books data as a JSON response
      return res.send(JSON.stringify(books, null, 4));
    } catch (error) {
      // Handle errors here, e.g., log the error and send an error response
      console.error('Error fetching books:', error.message);
      return res.status(500).send('Internal Server Error');
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.send(books[isbn])
 });

 //Get book details based on ISBN using promise callbacks or async-await
 public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
  
      const response = await axios.get('https://chimaisiguzo-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai//books/${isbn}');
      
      const book = response.data;
  
      // Sending the book data as a JSON response
      return res.send(JSON.stringify(book, null, 4));
    } catch (error) {
      // Handle errors here, e.g., log the error and send an error response
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
      return res.status(500).send('Internal Server Error');
    }
  });
 
  
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({"isbn":isbn,
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbyauthor}, null, 4));
});

//Get book details based on author using promise callbacks or async-await
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
  
      const response = await axios.get(`https://chimaisiguzo-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai//books?author=${author}`);
      
      const booksbyauthor = response.data.map(book => ({
        isbn: book.isbn,
        title: book.title,
        reviews: book.reviews
      }));
  
      // Sending the books by the author as a JSON response
      return res.send(JSON.stringify({ booksbyauthor }, null, 4));
    } catch (error) {
      // Handle errors here, e.g., log the error and send an error response
      console.error(`Error fetching books by author ${author}:`, error.message);
      return res.status(500).send('Internal Server Error');
    }
  });
 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      booksbytitle.push({"isbn":isbn,
                          "author":books[isbn]["author"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbytitle}, null, 4));
});

//Get all books based on title using promise callbacks or async-await
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
  
      const response = await axios.get(`https://chimaisiguzo-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai//books?title=${title}`);
      
      const booksbytitle = response.data.map(book => ({
        isbn: book.isbn,
        author: book.author,
        reviews: book.reviews
      }));
  
      // Sending the books by title as a JSON response
      return res.send(JSON.stringify({ booksbytitle }, null, 4));
    } catch (error) {
      // Handle errors here, e.g., log the error and send an error response
      console.error(`Error fetching books with title ${title}:`, error.message);
      return res.status(500).send('Internal Server Error');
    }
  });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
