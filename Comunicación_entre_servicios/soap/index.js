const express = require('express');
const soap = require('soap');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 4001;

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
app.options('/consultar_con_soap', cors());

const ConsultaAlumnosNombres = async (args, callback) => {
    try {
        const personas = await Alumnos.findAll();
        const alumnos = personas.map(({ id, apellidos, nombres, dni }) => ({
            id: id.toString(),
            apellidos,
            nombres,
            dni: dni.toString()
        }));
        callback(null, { alumnos });
    } catch (error) {
        console.error('Error al consultar la base de datos: ', error);
        callback(error);
    }
  } 

const ConsultaAlumnosNota = async (args, callback) => {
    try {
        const alumnos = await Alumnos.findAll({
          attributes: ['id', 'apellidos', 'nombres', 'dni', 'nota'],
          order: [['nota', 'DESC']],
        });
    
        const formattedAlumnos = alumnos.map(({ id, apellidos, nombres, dni, nota }) => ({
          id: id.toString(),
          apellidos,
          nombres,
          dni: dni.toString(),
          nota: nota.toString(),
        }));
    
        callback(null, { alumnos: formattedAlumnos });
      } catch (error) {
        console.error('Error al consultar la base de datos: ', error);
        callback(error);
      }
    };

app.listen(PORT, () => {
  console.log(`Servidor REST funciona en el puerto ${PORT}`);
});

const xml = require('fs').readFileSync('consultarAlumnos.wsdl', 'utf8');

const serviceObject = {
  ConsultarAlumnosService: {
    ConsultarAlumnosPort: {
      ConsultaAlumnosNombres: ConsultaAlumnosNombres,
      ConsultaAlumnosNota: ConsultaAlumnosNota,
    },
  },
};

soap.listen(app, '/consultar_con_soap', serviceObject, xml);
