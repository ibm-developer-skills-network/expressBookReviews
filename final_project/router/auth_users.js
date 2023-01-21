const express = require('express');
const jwt = require('jsonwebtoken');
let bookEnum = require("../enuns/enum_book.js");
let books = require("./booksdb.js");
let buscarBook = require("../utils/buscarPorFIltroUtil.js");
const regd_users = express.Router();

const axios = require('axios').default;

let users = [];

const isValid = (username)=>{
	return (username && username.length < 5) ? true : false;
}

const authenticatedUser = (username,password)=>{
	let validusers = users.filter((user)=>{
	  return (user.username === username && user.password === password)
	});
	if(validusers.length > 0){
	  return true;
	} else {
	  return false;
	}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({message: "Erro ao fazer login!!"});
	}

	if (authenticatedUser(username,password)) {
		let accessToken = jwt.sign({
		data: password
		}, 'access', { expiresIn: 60});

		req.session.authorization = {
		accessToken,username
	}
	return res.status(200).send("Usuáro logado com sucesso!");
	} else {
		return res.status(208).json({message: "Login Invalido. Por favor verificar username e password"});
	}
});

// DELETE request: Delete a friend by email id
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbnReq = req.params.isbn;

	const bookIsbn = buscarBook.echoId(books, bookEnum.isbn.key, isbnReq);
	let book = books[bookIsbn];
	let resultado;
	if (book){
		let name = req.session.authorization.username;
		let reviewsEncontrada = buscarBook.echoId(book["reviews"], bookEnum.name.key, name);

		if(reviewsEncontrada) {
			delete book["reviews"][reviewsEncontrada];
			resultado = "Resenha excluida com sucesso!!"
		}else {
			resultado = `Resenha não encontrada para o usuario  ${name}.`
		}

		books[bookIsbn] = book;
	}

	res.send(resultado);
});

const sendGetRequest = async (url) => {
    try {
        const resp = await axios.get(url);
		// console.log(resp.data);
		return resp.data;
    } catch (err) {
        // Handle Error Here
        return err;
    }
};

regd_users.get('/auth/list-book',function (req, res) {

	let retornaList = 'http://localhost:5000/';
	sendGetRequest(retornaList).then(restorno => res.send(restorno));

});

regd_users.get('/auth/book/isbn/:isbn',function (req, res) {

	let isbn = req.params.isbn;

	let retornaBookIsbn = `http://localhost:5000/isbn/${isbn}`;

	sendGetRequest(retornaBookIsbn).then(restorno => res.send(restorno));

});

regd_users.get('/auth/book/autor/:autor',function (req, res) {

	let autor = req.params.autor;

	let retornaBookautor = `http://localhost:5000/author/${autor}`;

	sendGetRequest(retornaBookautor).then(restorno => res.send(restorno));

});

regd_users.get('/auth/book/title/:title',function (req, res) {

	let title = req.params.title;

	let retornaBooktitle = `http://localhost:5000/title/${title}`;

	sendGetRequest(retornaBooktitle).then(restorno => res.send(restorno));

});

regd_users.get('/auth/book:isbn',function (req, res) {

	let url = "http://localhost:5000//isbn/" + req.params.isbn;

	axios.get(url)
    .then(resp => {
		res.send(resp.data);
    })
    .catch(err => {
		res.send(err);
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

	const isbnReq = req.params.isbn;

	const bookIsbn = buscarBook.echoId(books, bookEnum.isbn.key, isbnReq);
	let book = books[bookIsbn];
	if (book) { //Check is book exists
		let name = req.session.authorization.username;
		let comment = req.body.comment;
		let note = req.body.note; 
		let resultado;
				
		if(name && comment) {

			let reviewsEncontrada = buscarBook.echoId(book["reviews"], bookEnum.name.key, name);

			if(reviewsEncontrada) {
				book["reviews"][reviewsEncontrada].comment = comment ? comment : book["reviews"][reviewsEncontrada].comment;
				book["reviews"][reviewsEncontrada].note = note ? note : book["reviews"][reviewsEncontrada].note;
				resultado = "Resenha alterada com sucesso!!";
			}else {

				let position = Object.keys(book["reviews"]).length + 1;
				console.log("position", position);

				let newReviw = {"name": name, "comment": comment, "note": note};
				book["reviews"][position] = newReviw;
				resultado = "Resenha criada com sucesso!!";
			}
		}else {
			resultado = "Campo nome e review são Obrigatorios"
		}

		books[bookIsbn] = book;

		res.send(resultado);
	}
	else{
		res.send("Unable to find friend!");
	}
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
