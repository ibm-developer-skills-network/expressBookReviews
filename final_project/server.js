const express = require("express")
const app = express()
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");

app.use(express.json())
app.use("/api/auth", require("./Auth/route"))
app.use(cookieParser());

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/admin", adminAuth, (req, res) => res.render("admin"))
app.get("/basic", userAuth, (req, res) => res.render("user"))

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" })
  res.redirect("/")
})


const PORT = 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))