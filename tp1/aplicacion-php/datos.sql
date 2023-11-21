
-- Crear la base de datos "prueba"
CREATE DATABASE IF NOT EXISTS prueba;

-- Usar la base de datos "prueba"
USE prueba;

-- Crear la tabla "alumnos"
CREATE TABLE IF NOT EXISTS personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apellidos VARCHAR(200),
    nombres VARCHAR(200),
    dni INT(11)
);

-- Insertar registros en la tabla "alumnos"
INSERT INTO personas (apellidos, nombres, dni) VALUES
    ('Marcos', 'Montellano', 345678901),
    ('Pablo', 'Rodriguez', 456789012),
    ('Diego', 'Britos', 367890123);