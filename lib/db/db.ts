import Character from './characters';
import Combat from './combat';

class Database {
    public characters = new Character();
    public combats = new Combat();
    constructor() { }

}


const db = new Database();

export default db;