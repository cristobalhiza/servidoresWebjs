// const http=require("http")
import http from "http"
import { heroes } from "../data/lotr.js"

//el servidor siempre se mantendrá activo escuchando desde una posición de memoria llamada puerto o port. Los 3000 o 8080 suelen estar libres.

const PORT=3000
// el primer argumento es donde se van alojar todos los datos que vienen desde el cliente y
// el otro que vamos a utilizar desde el servidor para emitir las respuestas
const app=http.createServer((req,res)=>{
    // res.writeHead(200,{'Content-Type':'text/plain'})

    // console.log(req.url)

    if(req.url==="/heroes"){
        res.setHeader("Content-type", "application/json; charset=utf-8")
        return res.end(JSON.stringify(heroes, null, 5))
    }
    if(req.url==="/contact"){
        res.setHeader("Content-type", "text/plain; charset=utf-8")
        return res.end("CONTACT PAGE")
    }
    if(req.url==="/"){
        res.setHeader("Content-type", "text/plain; charset=utf-8")
        return res.end("Server con módulo HTTP ...!")
    }
    res.setHeader("Content-type", "text/plain; charset=utf-8")
    res.end("404 | not found")    
})

app.listen(PORT, ()=>console.log(`Server online en puerto ${PORT}`))

// se hace muy dificil este método para usar query params y filtrar resultados por eso y otras cosas se inventó express.js