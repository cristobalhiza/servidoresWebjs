import fs from 'fs';
export class HeroesManager {
    static path

    static async getHeroes() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.readFileSync(this.path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }

    static async addHeroe(heroe = {}) {
        let heroes = await this.getHeroes()
        let id = 1
        if (heroes.length > 0) {
            id = Math.max(...heroes.map(d => d.id)) + 1
        }
        let nuevoHeroe = {
            id,
            ...heroe //aquí los ... son el operador spread
        }
        heroes.push(nuevoHeroe)
        await fs.promises.writeFile(this.path, JSON.stringify(heroes, null, 8))
        return nuevoHeroe
    }

    static async updateHeroe(id, aModificar = {}) {
        let heroes = await this.getHeroes()
        let index = heroes.findIndex(d => d.id === id)
        if (index === -1) {
            throw new Error(`Error: no existe el id${id}`)
        }
        heroes[index] = { ...heroes[index], ...aModificar, id }
        await fs.promises.writeFile(this.path, JSON.stringify(heroes, null, 8))
        return heroes[index]
    }

    static async deleteHeroe(id) {
        let heroes = await this.getHeroes()
        let index = heroes.findIndex(d => d.id === id)
        if (index === -1) {
            throw new Error(`Error: no existe el id${id}`)
        }
        let cantidad0 = heroes.length
        heroes = heroes.filter(h => h.id !== id)
        let cantidad1 = heroes.length
        await fs.promises.writeFile(this.path, JSON.stringify(heroes, null, 8))
        return cantidad0 - cantidad1
    }
}

