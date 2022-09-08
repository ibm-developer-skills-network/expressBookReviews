const express = require("express");
const router = express.Router();
const { register, login, update, deleteUser } = require("./auth");
const { adminAuth } = require("../middleware/auth")

router.route("/register").post(register)
router.route("/login").post(login);
router.route("/update").put(update);
router.route("/update").put(adminAuth, update)
router.route("/deleteUser").delete(adminAuth, deleteUser)
module.exports = router;