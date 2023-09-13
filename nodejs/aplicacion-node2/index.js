const express = require('express');
const app = express();

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, desde el servidor 2!');
});

// Inicia el servidor
app.listen(81, () => {
  console.log("Servidor escuchando en http://localhost:81");
});