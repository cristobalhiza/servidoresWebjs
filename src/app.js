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

//Params

app.get("/saludo/:nombre/:apellido", (req,res)=>{
    console.log(req.params)

    let {nombre, apellido}=req.params

    let saludo=`Hola ${nombre} ${apellido}`

    res.send(saludo)
})

// OJO QUE app.get("/saludo/:nombre", (req,res)=>{} SE INTERPRETA IGUAL QUE app.get("/saludo/:apellido", (req,res)=>{} 
// POR LO QUE SI SE COLOCA UNO TRAS OTRO SIMPLEMENTE SE EJECUTARÁ EL PRIMERO, SALVO QUE SE CAMBIE LA RUTA O SE AGREGUE OTRA (El /SALUDO)

app.get("/heroes/:id", (req,res)=>{
    let{id}=req.params
    id=Number(id) 
    if(isNaN(id)){
        return res.send("Error: el id no es un número")
    }

    let heroe=heroes.find((heroe)=>heroe.id===+id)
    res.send(heroe)
})