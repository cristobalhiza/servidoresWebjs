import express from "express"
import { heroes } from "../data/lotr.js"

const PORT = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send('OK')
})

app.get("/saludo", (req, res) => {
    console.log(req.query)

    let { nombre, despedida } = req.query
    if (!nombre) {
        return res.send("Complete nombre via query param...!")
    }

    let saludo = `${despedida ? "Chao" : "Hola"}, ${nombre}`

    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(saludo)
})

app.get("/heroes", (req, res) => {
    let { limit, skip } = req.query;

    if (limit) {
        limit = Number(limit);
        if (isNaN(limit) || limit < 0) {
            return res.status(400).send("Limit debe ser un número entero mayor o igual a 0");
        }
    } else {
        limit = heroes.length;
    }

    if (skip) {
        skip = Number(skip);
        if (isNaN(skip) || skip < 0) {
            return res.status(400).send("Skip debe ser un número entero mayor o igual a 0");
        }
    } else {
        skip = 0;
    }

    let resultado = heroes.slice(skip, skip + limit);

    res.send(resultado);
});

const server = app.listen(PORT, () =>
    console.log(`Server online en puerto ${PORT}`))
