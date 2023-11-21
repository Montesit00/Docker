const express = require("express");
const Docker = require("dockerode");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const port = 3000;
let puertoBase = 3000;

// Un objeto para realizar un seguimiento de los nombres de los contenedores y sus IP
const contenedores = {};

// Configura la conexión con Docker
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Función para obtener la IP de un contenedor por su nombre
function obtenerIPDelContenedor(nombre, callback) {
  const container = docker.getContainer(nombre);

  container.inspect((err, data) => {
    if (err) {
      console.error(
        `Error al obtener información del contenedor ${nombre}:`,
        err
      );
      callback(err, null);
      return;
    }

    const ip = data.NetworkSettings.IPAddress;
    callback(null, ip);
  });
}

// Función para agregar un contenedor al seguimiento y al archivo de configuración de Nginx
function agregarContenedor(nombre, ip) {
  contenedores[nombre] = ip;

  // Actualiza el archivo de configuración de Nginx con todas las IP de los contenedores
  const ips = Object.values(contenedores);
  actualizarConfiguracionDeNginx(ips);
}

// Función para eliminar un contenedor del seguimiento y del archivo de configuración de Nginx
function eliminarContenedor(nombre) {
  delete contenedores[nombre];

  // Actualiza el archivo de configuración de Nginx sin la IP del contenedor eliminado
  const ips = Object.values(contenedores);
  actualizarConfiguracionDeNginx(ips);
}

// Función para actualizar el archivo de configuración de Nginx
function actualizarConfiguracionDeNginx(ips) {
  console.log(ips)
  const nuevaConfiguracion = `
    upstream loadBalancer {
      server 172.17.0.3:3000,
      ${ips.map((ip) => `server ${ip}:3000;`).join("\n      ")}
    }
    server{
        listen 3000;
        location / {
        proxy_pass http://loadbalancer/;
        }
        }
    
  `;
  console.log(nuevaConfiguracion)

  // Escribe el nuevo archivo de configuración
  fs.writeFile(__dirname + "/default.conf", nuevaConfiguracion, (err) => {
    if (err) {
      console.error("Error al escribir en default.conf:", err);
    } else {
      console.log("Configuración de Nginx actualizada con éxito.");
      // Reinicia Nginx para aplicar los cambios (esto puede requerir permisos)
    }
  });
}

app.post("/crear-contenedor", (req, res) => {
  const image = "wolter/containers"; // Cambia esto a la imagen que deseas utilizar
  const containerName = req.body.nombre;
  const puertoHost = puertoBase; // Usa el puerto base actual

  puertoBase++;

  const portMappings = {
    "3000/tcp": [{ HostPort: puertoHost.toString() }], // Mapeo del puerto 8080 del contenedor al puerto 4001 del host
    // Puedes agregar más mapeos de puertos si es necesario
  };
  const hostConfig = {
    PortBindings: portMappings,
  };

  docker
    .createContainer({
      Image: image,
      name: containerName,
      hostConfig: hostConfig,
    })
    .then((container) => {
      return container.start();
    })
    .then(() => {
      // Después de crear el contenedor, obtén su IP y agrega el contenedor al seguimiento
      obtenerIPDelContenedor(containerName, (err, ip) => {
        if (err) {
          res.send(
            `Contenedor ${containerName} creado, pero no se pudo obtener su IP.`
          );
        } else {
          agregarContenedor(containerName, ip);
          res.send(
            `Contenedor ${containerName} creado y en ejecución, IP: ${ip}`
          );
        }
      });
    })
    .catch((err) => {
      res.send(`Error al crear el contenedor: ${err.message}`);
    });
});

app.post("/eliminar-contenedor", (req, res) => {
  const containerName = req.body.id;

  const container = docker.getContainer(containerName);

  container
    .remove({ force: true })
    .then(() => {
      // Después de eliminar el contenedor, elimina el contenedor del seguimiento
      eliminarContenedor(containerName);
      res.send(`Contenedor ${containerName} eliminado.`);
    })
    .catch((err) => {
      res.send(`Error al eliminar el contenedor: ${err.message}`);
    });
});

app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});
