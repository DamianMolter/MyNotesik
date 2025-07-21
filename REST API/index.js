import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;
const saltRounds = 12;
let users = [];
let notes = [];

function generateToken(userId, email) {
  return jwt.sign(
    {
      userId: userId,
      email: email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

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
    return res.status(401).json({
      error: "Token dostępu wymagany",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      error: "Nieprawidłowy lub wygasły token",
    });
  }

  // Dodaj dane użytkownika do request
  req.user = {
    userId: decoded.userId,
    email: decoded.email,
  };

  next();
}

function validateLoginData(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email i hasło są wymagane",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      error: "Nieprawidłowy format email",
    });
  }

  next();
}

function validateRegistrationData(req, res, next) {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      error: "Wszystkie pola są wymagane",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      error: "Nieprawidłowy format email",
    });
  }

  if (password.length < 3) {
    return res.status(400).json({
      error: "Hasło musi mieć co najmniej 3 znaki",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Hasła nie są identyczne",
    });
  }

  next();
}

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));
loadUsers();
loadNotes();

app.post("/login", validateLoginData, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({
        error: "Nieprawidłowe dane logowania",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Nieprawidłowe dane logowania",
      });
    }

    // Generuj JWT token
    const token = generateToken(user.id, user.email);

    res.json({
      token: token,
      userId: user.id,
      userEmail: user.email,
      message: "Zalogowano pomyślnie",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Błąd serwera podczas logowania",
    });
  }
});

app.post("/register", validateRegistrationData, async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: "Na podany adres email zostało już założone konto",
      });
    }

    const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: newUserId,
      email: email,
      password: hashedPassword,
    };

    users.push(newUser);
    saveUsersToFile(users);

    res.status(201).json({
      message: "Konto zostało założone pomyślnie",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Błąd serwera podczas rejestracji",
    });
  }
});

app.patch("/user", authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.userId; // Z JWT tokena

    if (!newPassword || newPassword.length < 3) {
      return res.status(400).json({
        error: "Nowe hasło musi mieć co najmniej 3 znaki",
      });
    }

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        error: "Użytkownik nie znaleziony",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    users[userIndex].password = hashedPassword;

    saveUsersToFile(users);

    res.json({
      message: "Hasło zmieniono pomyślnie",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      error: "Błąd serwera podczas zmiany hasła",
    });
  }
});

app.delete("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Z JWT tokena

    users = users.filter((user) => user.id !== userId);
    notes = notes.filter((note) => note.userId !== userId);

    saveUsersToFile(users);
    saveNotesToFile(notes);

    res.json({
      message: "Konto usunięte pomyślnie",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      error: "Błąd serwera podczas usuwania konta",
    });
  }
});

app.post("/notes", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId; // Z JWT tokena

    if (!title || !content) {
      return res.status(400).json({
        error: "Tytuł i treść są wymagane",
      });
    }

    const newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;

    const newNote = {
      id: newId,
      userId: userId,
      title: title,
      content: content,
    };

    notes.push(newNote);
    saveNotesToFile(notes);

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      error: "Błąd serwera podczas tworzenia notatki",
    });
  }
});

app.get("/notes/:userId", authenticateToken, (req, res) => {
  try {
    const requestedUserId = parseInt(req.params.userId);
    const tokenUserId = req.user.userId;

    // Sprawdź czy użytkownik próbuje dostać swoje notatki
    if (requestedUserId !== tokenUserId) {
      return res.status(403).json({
        error: "Brak dostępu do notatek tego użytkownika",
      });
    }

    const userNotes = notes.filter((note) => note.userId === requestedUserId);
    res.json(userNotes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      error: "Błąd serwera podczas pobierania notatek",
    });
  }
});

app.delete("/notes/:id", authenticateToken, async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const userId = req.user.userId;

    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({
        error: "Notatka nie znaleziona",
      });
    }

    // Sprawdź czy notatka należy do użytkownika
    if (notes[noteIndex].userId !== userId) {
      return res.status(403).json({
        error: "Brak dostępu do tej notatki",
      });
    }

    notes.splice(noteIndex, 1);
    saveNotesToFile(notes);

    res.json({
      message: "Notatka usunięta pomyślnie",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      error: "Błąd serwera podczas usuwania notatki",
    });
  }
});

app.put("/notes/:id", authenticateToken, async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const { title, content } = req.body;
    const userId = req.user.userId;

    if (!noteId || !title || !content) {
      return res.status(400).json({
        error: "ID, tytuł i treść są wymagane",
      });
    }

    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({
        error: "Notatka nie znaleziona",
      });
    }

    // Sprawdź czy notatka należy do użytkownika
    if (notes[noteIndex].userId !== userId) {
      return res.status(403).json({
        error: "Brak dostępu do tej notatki",
      });
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
    };

    saveNotesToFile(notes);

    res.json({
      message: "Notatka zaktualizowana pomyślnie",
      note: notes[noteIndex],
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      error: "Błąd serwera podczas aktualizacji notatki",
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
