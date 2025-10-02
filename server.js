import express from "express";
import { WebSocketServer } from "ws";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const USERS_FILE = "./users.json";

app.use(bodyParser.json());
app.use(express.static(path.resolve("./frontend"))); // si mueves los HTML aquí

// Leer usuarios
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Guardar usuarios
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Registro
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  let users = loadUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "El correo ya está registrado." });
  }

  users.push({ email, password }); // ⚠️ Mejorar con bcrypt en producción
  saveUsers(users);

  res.json({ message: "Usuario registrado correctamente" });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let users = loadUsers();

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ message: "Credenciales inválidas" });
  }

  res.json({ message: "Inicio de sesión exitoso" });
});

// Iniciar servidor HTTP
const server = app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});

// WebSocket
const wss = new WebSocketServer({ server });

// Inicia el bot que se suba en /bot/index.js
let botProcess = spawn("node", ["./bot/index.js"]);

wss.on("connection", (ws) => {
  console.log("Cliente conectado a la consola");

  botProcess.stdout.on("data", (data) => {
    ws.send(data.toString());
  });

  botProcess.stderr.on("data", (data) => {
    ws.send("ERROR: " + data.toString());
  });

  ws.on("message", (msg) => {
    if (botProcess) {
      botProcess.stdin.write(msg.toString() + "\n");
    }
  });
});