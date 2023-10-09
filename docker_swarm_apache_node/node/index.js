const express = require('express');
const mysql2 = require('mysql2');

const app = express();


const db = mysql2.createConnection({
    host: 'mysql1',
    user: 'root',
    password: 'root1',
    database: 'prueba'
});

setTimeout(() => {
    db.connect((err) => {
        if(err) {
            throw err;
        }
        console.log('Connected to database');
    }); 
}, 10000);

app.get('/', (req, res) => {
    db.query('SELECT * FROM alumnos', (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
