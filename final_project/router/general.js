
const express = require('express');
const public = express.Router();

let db = require('./booksdb.js').books;

let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;



// db connection not provided in the course



function search(col, it, res) {
    if (col === '/') return res.status(200).json({ books: db });
    else if (col === 'review' && db.hasOwnProperty(it))
        return res.status(200).json(db[it].reviews);
    else {
        let result = {};
        if (col === 'isbn') Object.keys(db)
            .filter(id => String(id).indexOf(it) > -1)
            .forEach(id => result[id] = db[id])
            ;
        else {
            for (const id in db) {
                if (Object.hasOwnProperty.call(db, id)) {
                    if (String(db[id][col]).indexOf(it) > -1) {
                        result[id] = db[id]
                    }
                }
            }
        }
        if (Object.keys(result).length)
            return res.status(200).json(result);
        else return res.status(404).json({ message: 'Not Found' })
    }
}



public.get('/', function(req, res) {
    return search('/', null, res)
});

public.get('/isbn/:isbn', function(req, res) {
    return search('isbn', req.params['isbn'], res)
});

public.get('/author/:author', function(req, res) {
    return search('author', req.params['author'], res)
});

public.get('/title/:title', function(req, res) {
    return search('title', req.params['title'], res)
});

public.get('/review/:isbn', function(req, res) {
    return search('review', req.params['isbn'], res)
});



public.post('/register', (req, res) => {
    const db = isValid(req.body.username);
    let note = 'is not valid (2 to 8 characters, lowercase or numbers)'
      , code = 401
      ;
    if (db === 0) note = 'is unavailable';
    else if (db === 1) {
        code = 200;
        users.push({
            username: req.body.username,
            password: req.body.password
        });
        note = 'successfully registered, you can login'
    }
    return res.status(code).json({ message: `${req.body.username} ${note}` })
});



module.exports.general = public;
