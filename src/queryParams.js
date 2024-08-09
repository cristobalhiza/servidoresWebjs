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

    let {nombre, despedida}=req.query
    if (!nombre){
        return res.send("Complete nombre via query param...!")
    }

    let saludo=`${despedida?"Chao":"Hola"}, ${nombre}`

    res.setHeader('Content-Type', 'text/plain')
    res.status(200).send(saludo)
})

const server = app.listen(PORT, () => 
    console.log(`Server online en puerto ${PORT}`))

