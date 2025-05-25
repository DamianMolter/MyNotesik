import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcrypt";

const app = express();
const port = 4000;
const saltRounds = 8;
let lastId = 1;
let users = [];

function loadUsers() {
  try {
    const rawData = fs.readFileSync("./users.json", "utf8");
    users = JSON.parse(rawData);
    console.log("Dane JSON wczytane pomyślnie.");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Błąd: Plik users nie został znaleziony.`);
      users = [];
    } else if (error instanceof SyntaxError) {
      console.error(`Błąd: Nieprawidłowy format JSON w pliku users.`);
      users = [];
    } else {
      console.error(
        "Wystąpił nieoczekiwany błąd podczas wczytywania pliku JSON:",
        error
      );
      users = [];
    }
  }
}

function saveNewUser(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // null i 2 dla ładniejszego formatowania JSON
    fs.writeFile("./users.json", jsonData, "utf8", (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
    console.log("Dane JSON zapisane pomyślnie.");
  } catch (error) {
    console.error("Błąd podczas zapisu pliku JSON:", error);
    throw error;
  }
}

// Middleware
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
loadUsers();

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const searchIndex = users.findIndex(
    (user) => user.email === email && user.password === password
  );
  if (searchIndex >= 0) {
    res.send({
      token: "test123",
      userId: users[searchIndex].id,
      loginError: false,
    });
  } else {
    res.send({
      token: "",
      userId: -1,
      loginError: true,
    });
  }
});

app.post("/register", (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const searchIndex = users.findIndex((user) => user.email === email);
  if (searchIndex >= 0) {
    res.send({
      emailOccupied: true,
    });
  } else if (password !== confirmPassword) {
    res.send({
      passwordConfirmFailed: true,
    });
  } else {
    const newUserId = users[users.length - 1].id + 1;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log("Błąd hashowania hasła:", err);
      } else {
        console.log(hash);
        let newUserData = {
          id: newUserId,
          email: email,
          password: hash,
        };
        users.push(newUserData);
        saveNewUser(users);
        res.send({
          registerSuccessfull: true,
        });
      }
    });
  }
});

//CHALLENGE 1: GET All posts

app.get("/", (req, res) => {
  res.json(users);
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
