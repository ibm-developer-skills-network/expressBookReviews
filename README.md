# Developing Back-End Apps with Node.js and Express
> From IBM on Coursera

In this final project, we will build a server-side online book review application and integrate it with a secure REST API server which will use authentication at session level using JWT. You will then test your application using Promises callbacks or Async-Await functions.
## Tasks assessed by a screenshot
### Results
[Screenshots of tasks 1 to 9](https://github.com/j5py/express/tree/crud-jwt/screenshots)
### Try it yourself
```Shell
npm install
```
```Shell
npm start
```
#### Testable locally via CLI
##### Get the book list available in the shop
```Shell
curl -i localhost:5000/
```
##### Get the books based on ISBN
```Shell
curl -i localhost:5000/isbn/1
```
##### Get all books by the author
```Shell
curl -i localhost:5000/author/Unknown
```
##### Get all books based on title
```Shell
curl -i localhost:5000/title/Fairy%20tales
```
##### Get a book review
```Shell
curl -i localhost:5000/review/6
```
##### Register new user
```Shell
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{ "username":"john", "password":"fake" }' \
    localhost:5000/register
```
##### Login as a registered user
```Shell
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{ "username":"john", "password":"fake" }' \
    localhost:5000/customer/login
```
#### Testable via Postman
> For this part it is necessary that the app is accessible from the Internet via the free [Postman](https://www.postman.com/) account that you have created, since `curl` cannot access `req.session` from CLI
##### Add/modify a book review
```
PUT <labURL>/customer/auth/review/1?review=good
```
##### Delete book review added by that particular user
```
DELETE <labURL>/customer/auth/review/1
```
## Tasks that only offer text fields for evaluation
### Get all books – Using async callback function
```JavaScript
// Example tested successfully (but not kept in general.js)

public.get('/', async function(req, res) {
    return await search('/', null, res)
});
```
### Search by ISBN – Using Promises
```JavaScript
// Example tested successfully (but not modified in general.js)

public.get('/isbn/:isbn', function(req, res) {
    const request = new Promise((resolve) => {
        (async function(){
            const response = await search('isbn', req.params['isbn'], res);
            resolve(response)
        })()
    });
    request.then(result => { return result })
});
```
#### Previous methods use my search function below covering public requests
> db connection not provided in the course
```JavaScript
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
```