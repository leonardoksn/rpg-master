import Character from './characters';
import CharacterMongo from '@/services/character';
import Combat from './combat';

class Database {
    public characters = new Character();
    public combats = new Combat();

    public charactersMongo = new CharacterMongo();
    constructor() { }

}


const db = new Database();

export default db;