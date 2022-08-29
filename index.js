const sqlite3 = require('sqlite3');
const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('students.sqlite', SQLite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});
const port = 8000;
var express = require('express');
const { json } = require('express');
var app = express();
app.use(express.json());
app.use((req, res, next) => {
    next();
});

db.serialize(async () => {
    await db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        gender VARCHAR NOT NULL,
        age SMALLINT NOT NULL
    );`);
});


app.get('/', (req, res) => {
    res.send('Birds home page');
});
app.get('/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        } else {
            res.json(rows);
        }
    });
});
app.get('/student/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM students WHERE id=${id}`, (err, row) => {
        if (err) {
            return res.send(err.message);
        } else {
            return res.json(row);
        }
    });
});
app.post('/student', (req, res) => {
    db.run(`INSERT INTO students (firstname,lastname,gender,age) VALUES (?,?,?,?)`, [req.body.firstname, req.body.lastname, req.body.gender, req.body.age],err=>{
        if(err){
            return res.send(err.message);
        }else{
            return res.send('estudiante creado con exito');
        }
    });
});
app.put('/student/:id', (req, res) => {
    const { id } = req.params;
    db.run(`UPDATE students SET firstname=?,lastname=?,gender=?,age=? WHERE id=${id}`,[req.body.firstname, req.body.lastname, req.body.gender, req.body.age], (err) => {
        if (err) {
            return res.send(err.message);
        } else {
            return  res.send('estudiante actualizado con exito');
        }
    });
});
app.delete('/student/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM students WHERE id=${id}`, (err) => {
        if (err) {
            return res.send(err.message);
        } else {
            return  res.send('estudiante eliminado con exito');
        }
    });
});
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
