const express = require("express");
const app = express();

app.get("/login", (req, res) => {
  res.send("Login in to your account");
});

app.get("*", (req, res) => {
  res.send("Welcome to the page");
});

app.listen("8000", (req, res) => {
  console.log("Listening on port 8000");
});
