const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=>{
    let userwithsamename = users.filter((user)=>{
        return user.username ===  username
    });
    if(userwithsamename.length > 0){
        return true;
    }
    else{
        return false;
    }
};

const authenticatedUser = (username,password)=>{
    let validUsers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validUsers.length > 0){
        return true;
    }
    else{
        return false;
    }
};

// Task 7: Registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		return res.status(404).json({message: 'Error logging in. The username or password is invalid.'})
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
        console.log('Check3');
        return res.status(208).json({message: 'Invalid Login. Check username and password'})
    }
});

// Task 8: Add a book review
regd_users.put("/auth/review/:isbn",(req, res)=>{
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = req.session.authorization["username"];
    books[isbn]["reviews"][user] = review;
    res.send("A new review was added to book ISBN: " + isbn + " by user: " + user );
});
    
// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization["username"];
    delete books[isbn]["reviews"][user];
    res.send("The review for book ISBN: " + isbn + " was deleted by user: " + user);
});

module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;