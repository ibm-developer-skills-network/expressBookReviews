const express = require('express');
const jwt = require('jsonwebtoken');
//let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let books = {
    1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {"as":"xyz","zrc":"kjh"} },
    2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
    3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {} },
    4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {} },
    5: {"author": "Unknown","title": "The Book Of Job", "reviews": {} },
    6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {} },
    7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": {} },
    8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {} },
    9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": {} },
    10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const user=req.body.user;
  if(!user)
  {
    return res.status(404).json({message:"Body Empty"})
  }

  let accessToken=jwt.sign({
    data:user
  },'access',{ expiresIn:60*60});
  req.session.authorization={
    accessToken
  }
  req.session.username=user;
  return res.status(200).json({message: "User successfuly logged in!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username=req.session.username;
  console.log(username);
  const isbn=req.params.isbn;
  const reviewss=req.query.review;
  console.log(reviewss);

  let user=users[username];
  

  if(doesExist(username,isbn))
  {
    console.log(books[isbn].reviews[`${username}`])
    books[isbn].reviews[`${username}`]=reviewss;
  

    return res.status(200).json({message:`Review Updated with isbn number as ${isbn}`});
  }
  else{
    console.log(username);

   return res.status(200).json({message:`Review Updated with isbn number as ${isbn}`});
  }

 
});

const doesExist = (username,isbn)=>{

    const keys1=Object.keys(books[isbn].reviews);
    console.log(keys1);
    for(index=0;index<keys1.length;index++)
    {
        if(keys1[index]===username)
        {
            return true;
        }
    }
    return false;
  }

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn=req.params.isbn;
    if(isbn)
    {
        console.log(books[isbn].reviews);
        console.log(books);

       delete books[isbn]
      return res.status(200).json({message:"Review Deleted"});

    }
    return res.status(200).json({message:"No"});

  })

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
