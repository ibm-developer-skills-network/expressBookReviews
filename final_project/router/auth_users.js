const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const isValid = (username)=>{
    let existing_users = users.filter((user)=>{
        return user.username ===  username
    });
    if(existing_users.length > 0){
        return true;
    }
    else{
        return false;
    }
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validUsers = users.filter((user)=>{
    return (user.username === username && user.password === password)
});
if(validUsers.length > 0){
    return true;
}
else{
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		return res.status(404).json({message: 'Error logging in. Invalid username or password'})
	}
	else if (authenticatedUser(username, password)){
		let accessToken = jwt.sign(
			{data: password,
            },
            'access',
            {expiresIn: 60 * 60}
        );
		req.session.authorization = {
			accessToken,
            username,
		}
		return res.status(200).send('User successfully logged in')
	}
    else {        
        return res.status(208).json({message: 'Invalid Login. Check username and password'})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const user = req.session.authorization["username"];
  books[isbn]["reviews"][user] = review;
  res.send("New review added to book ISBN: " + isbn + " by User: " + user );
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization["username"];
    delete books[isbn]["reviews"][user];
    res.send("The review for book ISBN: " + isbn + " is deleted by user: " + user);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
