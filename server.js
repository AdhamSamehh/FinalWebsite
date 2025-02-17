const express = require('express');
const server = express();
const port = 888;
server.use(express.json());
const db_access = require('./myDB.js')
const db = db_access.db

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

server.post('/products/addproducts', (req, res) => {
    const product = req.body.product
    const price = req.body.price
    const category = req.body.category
    const description = req.body.description
    const quantity = parseInt(req.body.quantity)

    db.run(express.query, [product, price, category, description, quantity], (err) => {

        if (err) {
            console.log(err)
            return res.send(err)
        } else {
            return res.send('Flight added sucessfully')
        }
    })
})



db.serialize(() => {
    db.run(db_access.createusertable, (err) => {
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