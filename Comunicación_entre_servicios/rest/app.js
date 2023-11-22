const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();
const PORT = 3000;

const dbConnInfo = {
  name: 'prueba',
  user: 'root',
  password: 'root1',
  host: 'base-datos',
  dialect: 'mysql',
};

const sequelize = new Sequelize(
  dbConnInfo.name,
  dbConnInfo.user,
  dbConnInfo.password,
  {
    host: dbConnInfo.host,
    dialect: dbConnInfo.dialect,
  },
);

const Alumnos = sequelize.define(
  'alumnos',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    apellidos: {
      type: DataTypes.STRING,
    },
    nombres: {
      type: DataTypes.STRING,
    },
    dni: {
      type: DataTypes.STRING,
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

sequelize.sync();

app.use(cors());
app.options('/insertar_con_rest', cors());
app.use(express.json());

app.get('/consultarAlumnosPorApellido', async (req, res) => {
  try {
    const alumnos = await Alumnos.findAll({
      attributes: ['id', 'apellidos', 'nombres', 'dni'],
      order: [['nombres', 'ASC']],
    });
    res.json(alumnos);
  } catch (error) {
    console.error('Error al consultar la base de datos: ', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

app.get('/consultarAlumnosPorNota', async (req, res) => {
  try {
    const alumnos = await Alumnos.findAll({
      attributes: ['id', 'apellidos', 'nombres', 'dni'],
      order: [['dni', 'ASC']],
    });
    res.json(alumnos);
  } catch (error) {
    console.error('Error al consultar la base de datos: ', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor REST funciona en el puerto ${PORT}`);
});

