// Guardar registros en localStorage
function register() {
  const email = document.getElementById("email").value
  const pass = document.getElementById("password").value

  if (!email || !pass) return alert("Completa todos los campos")
  if (localStorage.getItem(email)) return alert("Ese correo ya está registrado")

  localStorage.setItem(email, pass)
  alert("Registrado con éxito, ahora inicia sesión")
}

// Iniciar sesión
function login() {
  const email = document.getElementById("email").value
  const pass = document.getElementById("password").value

  if (localStorage.getItem(email) === pass) {
    alert("Bienvenido " + email)
    window.location.href = "dashboard.html"
  } else {
    alert("Correo o contraseña incorrectos")
  }
}

// Simulación de servidor en dashboard
let serverRunning = false
let ramUsage = 0
let ramInterval

function startServer() {
  if (serverRunning) return log("⚠️ El servidor ya está en ejecución")

  serverRunning = true
  log("🚀 Servidor iniciado...")
  ramInterval = setInterval(() => {
    ramUsage = Math.min(500, ramUsage + Math.floor(Math.random() * 50))
    document.getElementById("ram").innerText = ramUsage + " MB"
    log("Proceso ejecutándose... RAM usada: " + ramUsage + " MB")
  }, 2000)
}

function stopServer() {
  if (!serverRunning) return log("⚠️ El servidor no está activo")

  serverRunning = false
  clearInterval(ramInterval)
  ramUsage = 0
  document.getElementById("ram").innerText = "0 MB"
  log("🛑 Servidor detenido")
}

function log(msg) {
  const consoleDiv = document.getElementById("console")
  consoleDiv.innerHTML += msg + "<br>"
  consoleDiv.scrollTop = consoleDiv.scrollHeight
    }
