import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcrypt";

const app = express();
const port = 4000;
const saltRounds = 8;
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
    const jsonData = JSON.stringify(data, null, 2);
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
    const jsonData = JSON.stringify(data, null, 2);
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  // Tutaj zweryfikuj prawdziwy JWT token
  if (token === "test123") {
    // Tymczasowe rozwiązanie
    next();
  } else {
    res.sendStatus(403);
  }
}

// Middleware
app.use(bodyParser.json());
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

app.patch("/user", authenticateToken, (req, res) => {
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

app.delete("/user", authenticateToken, (req, res) => {
  const loggedUserId = req.body.loggedUserId;
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

app.put("/notes", authenticateToken, (req, res) => {
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
  res.send(newNote);
});

app.get("/notes/:userId", authenticateToken, (req, res) => {
  const loggedUserId = req.params.userId;
  const result = notes.filter((note) => note.userId == loggedUserId);
  res.send(result);
});

app.delete("/notes/:id", authenticateToken, (req, res) => {
  const noteId = parseInt(req.params.id);
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

app.patch("/notes", authenticateToken, (req, res) => {
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

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
