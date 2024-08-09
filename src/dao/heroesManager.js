import fs from 'fs';
export class HeroesManager {
    static path

    static async getHeroes() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.readFileSync(this.path, {encoding:"utf-8"}))
        }else{
            return []
        }
    }
}
