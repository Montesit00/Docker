const express = require('express');
const app = express();

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor 1!');
});

// Inicia el servidor
//81 puerto
app.listen(3000, () => { 
  console.log("Servidor escuchando en http://localhost:3000")
});