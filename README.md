# Developing Back-End Apps with Node.js and Express
> From IBM on Coursera

In this final project, we will build a server-side online book review application and integrate it with a secure REST API server which will use authentication at session level using JWT. You will then test your application using Promises callbacks or Async-Await functions.
## Results with Postman
[Screenshots of tasks 1 to 9](https://github.com/j5py/express/tree/crud-jwt/screenshots)
## Test locally
Get the book list available in the shop
```Shell
curl -i localhost:5000/
```
Get the books based on ISBN
```Shell
curl -i localhost:5000/isbn/1
```
Get all books by the author
```Shell
curl -i localhost:5000/author/Unknown
```
Get all books based on title
```Shell
curl -i localhost:5000/title/Fairy%20tales
```
Get a book review
```Shell
curl -i localhost:5000/review/6
```
Register new user
```Shell
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{ "username":"john", "password":"fake" }' \
    localhost:5000/register
```
Login as a registered user
```Shell
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{ "username":"john", "password":"fake" }' \
    localhost:5000/customer/login
```