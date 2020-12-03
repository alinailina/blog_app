const express = require("express");
const app = express();
require('dotenv').config()
const mongoose = require("mongoose");
const Post = require("./models/post");

PORT = process.env.PORT || 3000;

// Register view engine
app.set("view engine", "ejs");

// Express static files middleware
app.use(express.static("public"));

// Express middleware that parses incoming requests with urlencoded payloads 
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log("New request was made:");
  console.log("Host - ", req.hostname);
  console.log("Path - ", req.path);
  console.log("Method - ", req.method);
  next();
});

// app.use((req, res, next) => {
//   console.log("Next middleware");
//   next();
// });

const uri = process.env.DB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected!");
  app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
});

app.get("/", (req, res) => {
  res.render("index", {title: "Blog App"});
});

app.get("/about", (req, res) => {
  // res.sendFile("./views/about.html", { root: __dirname });
  res.render("about", {title: "About"});
});

app.get("/posts", (req, res) => {
  Post.find()
    .then((result) => {
      res.render("blog", { title: "All posts", posts: result });
    })
    .catch((err) => console.log(err));
});

app.post("/posts", (req, res) => {
  console.log(req.body);
  const post = new Post(req.body);
  post
    .save()
    .then((result) => {
      res.redirect("/posts");
    })
    .catch((err) => console.log(err));
});

app.get("/posts/add-post", (req, res) => {
  res.render("add-post", { title: "Add post"});
});

app.get("/posts/:id", (req, res) => {
    const id = req.params.id;
    Post.findById(id)
      .then((result) => {
        res.render("post", { post: result });
      })
      .catch((err) => {
        res.status(404).render("404");
      });
  })

app.delete("/posts/:id",(req, res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
      .then((result) => {
        res.json({ redirect: "/posts" });
      })
      .catch((err) => console.log(err));
  });

// 404 middleware
app.use((req, res) => {
  res.status(404).render("404");
});
