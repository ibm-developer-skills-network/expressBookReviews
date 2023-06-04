### in brief about the medium project about server-side application that stores, retrieves, and manages book ratings and reviews

- Book Review Application that implements session and JWT authentication only to allow logged in users to perform - specified operations.
- Write a RESTful web service given skeleton code using the Express framework.
- Book Review Application that uses callbacks, and/or Async/Await functions to allow multiple users to interact with your application simultaneously.

# index.js

- This code sets up an Express server to handle requests from authenticated and non-authenticated users. It first imports the necessary dependencies such as Express, JWT, and session. Then, it defines two router files for handling requests from authenticated and non-authenticated users.

- The server is set up to use JSON as the data format for incoming requests and to use session middleware for authentication. The session middleware is configured with a secret key and is applied only to routes starting with "/customer".

- Next, a middleware function is defined to check if the user is authenticated before allowing access to routes starting with "/customer/auth/". It checks if the user has a valid authorization token in their session. If the token is valid, the user's information is extracted from the token and added to the request object. If the token is invalid or missing, an appropriate error message is returned.

- Finally, the server is set up to listen on port 5000 and to use the defined router files for handling requests.

# general.js

- This code defines a router file for handling requests from non-authenticated users. It first imports the necessary dependencies such as Express, booksdb.js, and auth_users.js. Then, it defines several routes for getting book information based on ISBN, author, title, and reviews.

- Additionally, it defines a route for registering new users. If the username and password are provided, it checks if the user already exists in the system. If not, the user is added to the system and a success message is returned. If the user already exists, an error message is returned.

- Finally, the router file is exported for use in the main server file.

# auth_users.js

- This code defines a router file for handling requests from registered users. It first imports the necessary dependencies such as Express and jwt. Then, it defines an empty array for storing user information and a function for checking if a username already exists in the system.

- The router file defines several routes for retrieving user information, logging in, adding book reviews, and deleting book reviews. The login route checks if the provided username and password match the ones stored in the system and generates a JWT token for authentication.

- The add review route allows registered users to add reviews for books based on ISBN. The delete review route allows registered users to delete their own reviews for books based on ISBN.

- Finally, the router file exports the necessary functions and arrays for use in the main server file.
