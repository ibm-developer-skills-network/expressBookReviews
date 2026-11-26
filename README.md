# Bookstore API with Authentication and Reviews

A RESTful API for managing books, reviews, and user authentication, built with **Node.js**, **Express**, and **Axios**. This project demonstrates asynchronous programming using Promises and Async/Await, as well as JWT-based authentication for secure operations.

---

## 🚀 Features

### Public Routes
- **Get All Books:** Retrieve a list of all available books in the shop.
- **Search by ISBN:** Get details of a book using its ISBN.
- **Search by Author:** Find books written by a specific author.
- **Search by Title:** Retrieve books based on their title.
- **Get Book Reviews:** View reviews for a specific book.

### User Authentication
- **Register:** Create a new user account.
- **Login:** Authenticate registered users and provide session-based JWT tokens.

### Protected Routes
- **Add/Modify Reviews:** Post or update a review for a book, specific to the logged-in user.
- **Delete Reviews:** Remove a user's review for a book.

### Refactored with Promises and Async/Await
Tasks for fetching books and details are implemented using Promises or Async/Await to improve code readability and efficiency.

---

## 🛠️ Technologies Used

- **Node.js**: Server-side runtime.
- **Express.js**: Backend framework.
- **Axios**: Promise-based HTTP client.
- **JSON Web Tokens (JWT)**: For authentication and session management.
- **Express Session**: To manage session persistence.
- **Nodemon**: For development server auto-reloading.

---

## 📂 Project Structure

```plaintext
📁 expressBookReviews
| ├──📁 final_project
| ├──📁 screenshots
| | ├──📁 router
| | ├──📄auth_users.js      # Routes for authenticated users (Login/Logout)
| | ├── 📄booksdb.js         # Database of books (Book details and reviews)
| | ├──📄general.js         # Routes for public access (Book retrieval)
| ├── 📄 index.js           # Main application file (App entry point)
| ├── 📄 package.json       # Project metadata and dependencies
| ├── 📄 README.md          # Project documentation

```

## 🚀 Getting Started

**Prerequisites**

+ Node.js (v14 or later)
+ npm (v6 or later)

**Installation**
1. Clone the repository:
```
git clone https://github.com/Amen-Zelealem/expressBookReviews.git

cd expressBookReviews

```

2. Install dependencies:
```
npm install
```

3. Start the server
```
npm start
```

## 🧪 API Endpoints

### Public Endpoints

| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| GET    | `/`                | Get a list of all books            |
| GET    | `/isbn/:isbn`      | Get details of a book by ISBN      |
| GET    | `/author/:author`  | Get details of books by an author  |
| GET    | `/title/:title`    | Get details of books by title      |
| GET    | `/review/:isbn`    | Get reviews for a specific book    |

### User Authentication

| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| POST   | `/register`        | Register a new user                |
| POST   | `/login`           | Login as a registered user         |

### Protected Endpoints (Require Login)

| Method | Endpoint               | Description                           |
|--------|------------------------|---------------------------------------|
| PUT    | `/auth/review/:isbn`   | Add or modify a review for a book     |
| DELETE | `/auth/review/:isbn`   | Delete a review for a book            |

---

## 📝 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute it.

---

## 📧 Contact

For questions or feedback, feel free to reach out:

**Email:** [amenzelealemtadese@gmail.com]  
**GitHub:** [Amen-Zelealem](https://github.com/Amen-Zelealem)
