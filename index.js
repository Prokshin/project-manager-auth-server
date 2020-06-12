const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var cookieParser = require("cookie-parser");
const fetch = require("node-fetch");

async function postForm(body, type) {
  const res = await fetch(`http://localhost:8080/api/user/${type}`, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })
  return res.json()
}

//form parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//static file
app.use(express.static(path.join(__dirname, "public")));

//cookie parser
app.use(cookieParser());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/register", urlencodedParser, async function(req, res) {
  if (!req.body) return response.sendStatus(400);
  console.log("req.body: ", req.body)
  postForm(req.body, "register").then((e)=>{
    console.log(e)
    res.redirect("/");
  })
});

app.post("/login", urlencodedParser, async function(req, res) {
  if (!req.body) return response.sendStatus(400);
  postForm(req.body, "login").then((e)=>{
    res.cookie('userId', e.userId, {maxAge: 3600000}); 
    res.cookie('jwt', e.token, {maxAge: 3600000}); 
    res.redirect("/app/")
  })
});

app.get("/app/*", (req, res) => {
  if (req.cookies.jwt === undefined || req.cookies.jwt=== null) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname + "/public/app/index.html"));
  }
});

app.listen(9000);
