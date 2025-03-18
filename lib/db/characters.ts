import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { generateId } from "../generate-id";

export default class Character {

    private db: Low<Record<string, ICharacterData>> | null = null;

    async init() {
        this.db = await JSONFilePreset<Record<string, ICharacterData>>('characters.json', {})
    }
    async create(data: ICharacterData) {
        await this.init()

        const id = generateId();
        await this.db?.update((value) => {
            value[id] = data;
            return value;
        })
        return id
    }

    async findAll() {
        await this.init()
        return this.db?.data
    }
    async findOne(id: string) {
        await this.init()
        return this.db?.data[id];
    }

    async delete(id: string) {
        await this.init();

        await this.db?.update((value) => {
            delete value[id];
            return value;
        })
        return id
    }
    async update(id: string, data: ICharacterData) {
        await this.init()
        await this.db?.update((value) => {
            value[id] = data;
            return value;
        })
        return id
    }
}
