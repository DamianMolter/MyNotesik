import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import notes from "./Database/notes.js";
import users from "./Database/users.js";

const app = express();
const port = 4000;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
];

let lastId = 1;

// Middleware
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/login", (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);
  res.send({
    token: "test123",
  });
});

//CHALLENGE 1: GET All posts

app.get("/", (req, res) => {
  res.json(posts);
});

//CHALLENGE 2: GET a specific post by id

app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = posts.findIndex((post) => post.id === id);
  res.json(posts[searchIndex]);
});

//CHALLENGE 3: POST a new post

app.post("/posts", (req, res) => {
  const newId = posts[posts.length - 1].id + 1;
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  const newPost = {
    id: newId,
    title: title,
    content: content,
    author: author,
    date: new Date(),
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

//CHALLENGE 4: PATCH a post when you just want to update one parameter

app.patch("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existingPost = posts.find((post) => post.id === id);

  const replacementPost = {
    id: id,
    title: req.body.title || existingPost.title,
    content: req.body.content || existingPost.content,
    author: req.body.author || existingPost.author,
    date: new Date(),
  };
  const searchIndex = posts.findIndex((post) => post.id === id);
  posts[searchIndex] = replacementPost;
  res.json(replacementPost);
});

//CHALLENGE 5: DELETE a specific post by providing the post id.

app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = posts.findIndex((post) => post.id === id);
  console.log(searchIndex);
  if (searchIndex > -1) {
    posts.splice(searchIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: `Post with id ${id} not found.` });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
