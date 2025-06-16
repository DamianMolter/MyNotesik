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
let notes = [];

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

function loadNotes() {
  try {
    const rawData = fs.readFileSync("./notes.json", "utf8");
    notes = JSON.parse(rawData);
    console.log("Dane JSON wczytane pomyślnie.");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Błąd: Plik notes nie został znaleziony.`);
      users = [];
    } else if (error instanceof SyntaxError) {
      console.error(`Błąd: Nieprawidłowy format JSON w pliku notes.`);
      users = [];
    } else {
      console.error(
        "Wystąpił nieoczekiwany błąd podczas wczytywania pliku JSON:",
        error
      );
      notes = [];
    }
  }
}

function saveUsersToFile(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // null i 2 dla ładniejszego formatowania JSON
    fs.writeFile("./users.json", jsonData, "utf8", (err) => {
      if (err) throw err;
      console.log("Plik zapisany pomyślnie!");
    });
    console.log("Dane JSON zapisane pomyślnie.");
  } catch (error) {
    console.error("Błąd podczas zapisu pliku JSON:", error);
    throw error;
  }
}

function saveNotesToFile(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // null i 2 dla ładniejszego formatowania JSON
    fs.writeFile("./notes.json", jsonData, "utf8", (err) => {
      if (err) throw err;
      console.log("Plik zapisany pomyślnie!");
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
loadNotes();

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const searchIndex = users.findIndex((user) => user.email === email);

  if (searchIndex < 0) {
    res.send({
      token: "",
      userId: -1,
      loginError: true,
    });
  }

  const user = users[searchIndex];
  const storedHashedPassword = user.password;

  bcrypt.compare(password, storedHashedPassword, (err, result) => {
    if (result) {
      res.send({
        token: "test123",
        userId: users[searchIndex].id,
        userEmail: users[searchIndex].email,
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
    var newUserId = 1;
    if (users.length > 0) {
      newUserId = users[users.length - 1].id + 1;
    }
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log("Błąd hashowania hasła:", err);
      } else {
        let newUserData = {
          id: newUserId,
          email: email,
          password: hash,
        };
        users.push(newUserData);
        saveUsersToFile(users);
        res.send({
          registerSuccessfull: true,
        });
      }
    });
  }
});

app.patch("/user", (req, res) => {
  const { newPassword, loggedUserId } = req.body;
  const searchIndex = users.findIndex((user) => user.id == loggedUserId);
  const storedHashedPassword = users[searchIndex].password;
  bcrypt.hash(newPassword, saltRounds, (err, hash) => {
    if (err) {
      console.log("Błąd hashowania hasła:", err);
    } else {
      users[searchIndex].password = hash;
      saveUsersToFile(users);
      res.send({
        changeSuccessfull: "Hasło zmieniono pomyślnie.",
      });
    }
  });
});

app.delete("/user", (req, res) => {
  const loggedUserId = req.body.loggedUserId;
  console.log(loggedUserId);
  const searchIndex = users.findIndex((user) => user.id == loggedUserId);
  users = users.filter((user) => user.id != loggedUserId);
  notes = notes.filter((note) => note.userId != loggedUserId);
  saveUsersToFile(users);
  saveNotesToFile(notes);
  res.send({
    deleteSuccessfull:
      "Konto usunięte pomyślnie. Za 3 sekundy nastąpi automatyczne wylogowanie.",
  });
});

app.put("/notes", (req, res) => {
  var newId = 1;
  if (notes.length > 0) {
    newId = notes[notes.length - 1].id + 1;
  }
  const userId = req.body.userId;
  const title = req.body.title;
  const content = req.body.content;
  const newNote = {
    id: newId,
    userId: userId,
    title: title,
    content: content,
  };
  notes.push(newNote);
  saveNotesToFile(notes);
  console.log(newNote);
  res.send(newNote);
});

app.get("/notes/:userId", (req, res) => {
  const loggedUserId = req.params.userId;
  const result = notes.filter((note) => note.userId == loggedUserId);
  res.send(result);
});

app.delete("/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  console.log(noteId);
  const searchIndex = notes.findIndex((note) => note.id === noteId);
  if (searchIndex > -1) {
    notes.splice(searchIndex, 1);
    saveNotesToFile(notes);
    res.send({ alert: "Notatka usunięta pomyślnie!" });
  } else {
    res
      .status(404)
      .json({ error: `Notatka z id równym ${noteId} nie znaleziona.` });
  }
});

app.patch("/notes", (req, res) => {
  const existingNote = notes.find((note) => note.id === req.body.id);
  const newNote = {
    id: existingNote.id,
    userId: existingNote.userId,
    title: req.body.title || existingNote.title,
    content: req.body.content || existingNote.content,
  };
  const searchIndex = notes.findIndex((note) => note.id === req.body.id);
  notes[searchIndex] = newNote;
  saveNotesToFile(notes);
  res.send({ alert: "Notatka edytowana pomyślnie!" });
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
