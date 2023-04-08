const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
require("dotenv").config();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", async (req, res, next) => {
  const token = req.session.authorization;
  if (!token) {
    return res.status(401).json({ Message: "User not logged in" });
  }

  const accessToken = token.accessToken;
  try {
    const user = await jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
    req.user = { username: user.username };
    next();

    next();
  } catch (err) {
    return res.status(401).json({ Message: "Something has error. Try again" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
