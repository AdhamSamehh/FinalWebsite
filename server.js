const express = require('express');
// const db_access = require('./db.js');
// const db = db_access.db;
const server = express();
const port = 8888;
server.use(express.json());
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const createusertable = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, 
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL,
    age INTEGER
    )`;



server.post('/user/register', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let age = req.body.age;
    if (!name || !email || !password) {
        return res.status(400).send("name, email, and password are required.");
    }
    const insertquery = `INSERT INTO USER(name, email, password) Values('${name}', '${email}', '${password}')`;
    db.run(insertquery, (err) => {
        if (err) {
            return res.status(500).send(`Error during registration: ${ err.message }`);
        } else {
            return res.status(200).send("Registration successful");
        }
    })
})

server.post('/user/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    db.get(`SELECT * FROM USER WHERE EMAIL = '${email}' AND PASSWORD = '${password}'`, (err, row) => {
        if (err || !row)
            return res.status(401).send("Invaild Credentials!")
        else
            return res.status(200).send("Login Successful")
    })
})



db.serialize(() => {
    db.exec(createusertable, (err) => {
        if (err) {
            console.error("Error creating user table:", err);
        } else {
            console.log("User table created successfully!");
        }
    })
})



server.listen(port, () => {
    console.log(`Server is listening at port ${ port }`)
});