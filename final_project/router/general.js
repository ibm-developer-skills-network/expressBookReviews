const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
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
  const username = req.body.username;
  const password = req.body.password;


  if (username && password) {
    if (!isValid(username)){
        users.push({
            username: username,
            password: password
        })
        return res.status(200).json({ message: `User ${username} created`});
    } else {
        return res.status(400).json({ message: "User already exists"}); 
    }
}
    else {
        return res.status(400).json ({ message: "Invalid request"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;

  res.send(books[ISBN])
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(ans);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let ans = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              ans.push(books[key]);
          }
      }
  }
  if(ans.length == 0){
      return res.status(300).json({message: "Title not found"});
  }
  res.send(ans);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let promise = new Promise ((resolve, reject)=> {
    setTimeout (() => resolve(books [req.params.isbn].reviews), 1000);
  });
  promise.then ((value)=> {
    return res.status(200).send(JSON.stringify(value, null, 4));
  }).catch((err) => {
    return res.status(404).send(`Requested isbn not found`);
  });
});

// Task 10 
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList(){
  return new Promise((resolve,reject)=>{
    resolve(books);
  })
}

// Get the book list available in the shop
public_users.get("/", async function (req, res){
    try {
        return res.status(StatusCodes.OK).json({books });
    } catch (error) {
        console.log(error);
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });

    }

});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn){
  let book_ = books[isbn];  
  return new Promise((resolve,reject)=>{
    if (book_) {
      resolve(book_);
    }else{
      reject("Unable to find book!");
    }    
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const { isbn } = req.params;
  try {
    const book = await getBooksbyISBN(isbn);
    res.status(StatusCodes.OK).json(book);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json(error);
  }

  const getBooksByISBN = (isbn) => {
    return new Promise((resolve, reject)=> {
        const book = books [isbn];
        if (book) {
            resolve({book});
        } else ({message: 'book with ISBN ${isbn} not found'});
    }); 
  }

 });

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    const { author } = req.params;
    try {
      const book = await getBooksByAuthor(author);
      res.status(StatusCodes.OK).json(book);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json(error);
    }
  });
  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.author == author
      );
      if (filteredBooks.length > 0) {
        resolve({ books: filteredBooks });
      } else {
        reject({ msg: `no book found for author ${author}` });
      }
    });
};

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.


function getFromTitle(title){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title){
        output.push(book_);
      }
    }
    resolve(output);  
  })
}

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const { title } = req.params;
    try {
      const book = await getBooksByTitle(title);
      res.status(StatusCodes.OK).json(book);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json(error);
    }
  });
  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.title == title
      );
      if (filteredBooks.length > 0) {
        resolve({ books: filteredBooks });
      } else {
        reject({ msg: `no book found for title ${title}` });
      }
    });
  };

module.exports.general = public_users;