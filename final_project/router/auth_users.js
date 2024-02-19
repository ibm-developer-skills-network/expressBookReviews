const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "username",
        password: "password"
    },
    {
        username: "admin",
        password: "admin"
    }
];

const isValid = (username) => {
    //write code to check is the username is valid
   // let userswithsamename = users.filter((user) => {
        return users.some((user) => user.username === username); // === username;
    //});
    //if (userswithsamename.length > 0) {
    //    return true;
    //} else {
    //    return false;
    //}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
/*let valid = users.filter((user) => {
    return (user.username === username && user.password === password)
});
if(valid.lenght > 0){
    return true; 
} else {
    return false;
}
} */
return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password; 
  if (!username && !password){
    return res.status(400).json({message: "Error loggin in"});
  }
  if (authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60 *60 });
    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).json({ message: "User succesfully logged in :)"});
  } else {
    return res.status(402).json({message: "Invalid Login. Check username or password :("});

  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const review = req.params.review; 
  if (ISBN) {
    books[req.params.isbn] = {
        "reviews": review,
    }
  }
  res.send("The review for the book with ISBN" + ('') + (req.params.isbn)+ "Has been added :)");

  //return res.status(300).json({message: "Yet to be implemented"});
});

//DELETE A BOOK REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.session.authorization['username'];
    const book = books[ISBN];

    if(!book){
        return res.status(404).json({message: "Book not found"});

    } else {
        delete book["reviews"][username];
        return res.status(200).json({message: "Review deleted succesfully!!"});
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
