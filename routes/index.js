const express = require("express");
const { root, register, login, logout } = require("../controllers");
const app = express();
const { verifyToken } = require("./middleware");

app.get("/", root);

app.post("/register", register);

app.post("/login", login);

app.get("/logout", verifyToken, logout);

module.exports = app;
