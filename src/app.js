import express from "express"
import {heroes} from "../data/lotr.js"

const PORT=3000

const app=express()

app.listen(PORT, ()=>console.log(`Server online en puerto ${PORT}`))

app.get("/", (req, res)=>{

    console.log(req.url)

    res.send("<h1 style='color:green; margin: 50px 0 0 50px;'>Hola mundo - Express Js</h1>")
})

app.get("/heroes",(req, res)=>{
    res.send(heroes)
} )