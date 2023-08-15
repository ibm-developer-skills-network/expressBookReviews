Final Project

POSTMAN

Register user:

POST http://localhost:5000/register
{"username":"user1", "password":"password1"}

Login user:
POST http://localhost:5000/customer/login
{"username":"user1", "password":"password1"}

Get list of available books:
GET http://localhost:5000/

Get book info based on ISBN:

Update book review:
PUT http://localhost:5000/customer/auth/review/1
{"username":"user1", "review":"The book is great!!"}

GET http://localhost:5000/promise/author/Unknown
