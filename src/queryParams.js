import express from "express";
// import { heroes } from "./data/lotr.js"
import { HeroesManager } from "./dao/heroesManager.js";

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//esta última línea permitirá que el servidor pueda interpretar mejor los datos complejos que viajen desde la url y mapearlos correctamente en el req.query

HeroesManager.path = "./src/data/lotr.json";

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ error: "OK" });
});
//esta última se llama Manejador de ruta o Route handler

app.get("/api/saludo", (req, res) => {
    console.log(req.query);

    let { nombre, despedida } = req.query;
    if (!nombre) {
        return res.status(400).json({ error: "Complete nombre via query param.!" });
    }

    let saludo = `${despedida ? "Chao" : "Hola"}, ${nombre}`;

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ saludo });
});

app.get("/api/heroes", async (req, res) => {
    let heroes;
    try {
        heroes = await HeroesManager.getHeroes();
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde",
            detallle: `${error.message}`,
        });
    }

    let { limit, skip } = req.query;

    if (limit) {
        limit = Number(limit);
        if (isNaN(limit) || limit < 0) {
            return res
                .status(400)
                .json({ error: "Limit debe ser un número entero mayor o igual a 0" });
        }
    } else {
        limit = heroes.length;
    }

    if (skip) {
        skip = Number(skip);
        if (isNaN(skip) || skip < 0) {
            return res
                .status(400)
                .json({ error: "Skip debe ser un número entero mayor o igual a 0" });
        }
    } else {
        skip = 0;
    }

    let resultado = heroes.slice(skip, skip + limit);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ resultado });
});

app.get("/api/heroes/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "id debe ser un número" });
    }
    // let heroes = await HeroesManager.getHeroes()
    let heroes;
    try {
        heroes = await HeroesManager.getHeroes();
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde",
            detallle: `${error.message}`,
        });
    }

    let heroe = heroes.find((h) => h.id === id);
    if (!heroe) {
        return res.status(404).json({ error: `Heroe con id ${id} no encontrado` });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ heroe });
});

app.post("/api/heroes/", async (req, res) => {
    let { name, ...otros } = req.body //...es aquí el operador rest
    if (!name) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "El nombre del héroe es requerido" })
    }
    let heroes = await HeroesManager.getHeroes()
    let existe = heroes.find(h => h.name.toLowerCase() === name.toLowerCase())
    if (existe) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `Ya existe un personaje llamado ${name}` });
    }
    //Validar lo que se necesite
    try {
        let heroeNuevo = await HeroesManager.addHeroe({ name, ...otros })
        res.setHeader("Content-Type", "application/json");
        return res.status(201).json({ heroeNuevo });
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Error inesperado en el servidor - Intente nuevamente" })
    }
})

app.put("/api/heroes/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "id debe ser un número" });
    }
    // let heroes = await HeroesManager.getHeroes()
    let heroes;
    try {
        heroes = await HeroesManager.getHeroes();
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente más tarde",
            detallle: `${error.message}`,
        });
    }

    let heroe = heroes.find((h) => h.id === id);
    if (!heroe) {
        return res.status(404).json({ error: `Heroe con id ${id} no encontrado` });
    }
    let { ...aModificar } = req.body;

    delete aModificar.id;
    //validaciones 
    if (aModificar.name) {
        let existe = heroes.find(h => h.name.toLowerCase() === aModificar.name.toLowerCase())
        if (existe) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Ya existe un personaje llamado ${aModificar.name}` })
        }
    }
    try {
        let heroeModificado = await HeroesManager.updateHeroe(id, aModificar)
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ heroeModificado })
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Error inesperado en el servidor - Intente nuevamente" })
    }
});

app.delete("/api/heroes/:id", async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "id debe ser un número" });
    }
    try {
        let resultado = await HeroesManager.deleteHeroe(id)
        if(resultado>0){
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({payload:"Personaje Elimimnado!"})
        } else {
            res.setHeader("Content-Type", "application/json");
            return res.status(404).json({ error: `Heroe con id ${id} no eliminado :(`})
        }
    } catch (error) {
        console.log(error);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error inesperado en el servidor - Intente Nuevamente",
            detallle: `${error.message}`
        }
        )
    }

});

const server = app.listen(PORT, () =>
    console.log(`Server online en puerto ${PORT}`)
);

//Metodos (usar Postman)
let nombre = "Cristobal";

app.get("/api/nombre", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ nombre });
});

app.post("/api/nombre/", (req, res) => {
    let { nombre: nombreBody } = req.body;
    if (!nombreBody) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "Complete nombre" });
    }
    nombre = `${nombre} ${nombreBody}`.trim();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ nombre });
});
