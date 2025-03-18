import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { generateId } from "../generate-id";

export default class Combat {

    private db: Low<Record<string, CombatSession>> | null = null;


    private async init() {
        this.db = await JSONFilePreset<Record<string, CombatSession>>('combat-session.json', {})
    }
    async create(data: CombatSessionRequest) {
        await this.init();
        const id = generateId();
        const register: CombatSession = { ...data, id, logs: [], status: 'active', createdAt: new Date().toISOString(), round: 1, activeCharacterIndex: 0 }
        await this.db?.update((value) => {
            value[id] = register;
            return value;
        })
        return id
    }

    async findAll() {
        await this.init();
        return this.db?.data
    }

    async findById(id: string) {
        await this.init();
        return this.db?.data[id]
    }

    async updateCombatCharacter(id: string, data: CombatCharacter[]) {
        await this.init();
        await this.db?.update((value) => {
            value[id].characters = data;
            return value;
        })
        return id;
    }

    async updateCombatLog(id: string, data: CombatLog[]) {
        await this.init();

        await this.db?.update((value) => {
            value[id].logs = data
            return value;
        })
    }

    async updateActiveCharacterIndex(id: string, activeCharacterIndex: number) {
        await this.init();
        await this.db?.update((value) => {
            value[id].activeCharacterIndex = activeCharacterIndex;
            return value;
        })
    }
    async updateRound(id: string, round: number) {
        await this.init();
        await this.db?.update((value) => {
            value[id].round = round;
            return value;
        })
    }

    async deleteCombat(id: string) {
        await this.init();
        await this.db?.update((value) => {
            delete value[id];
            return value;
        })
    }
    async updateCombatCharacterTemporaryHealth({ combatId, characterId }: { combatId: string, characterId: string }, tempHp: number) {
        await this.init();
        await this.db?.update((value) => {
            const character = value[combatId].characters.findIndex(({ id }) => id === characterId);
            if (character === -1) {
                return value;
            }
            value[combatId].characters[character].health.temporary = tempHp;
            character
        })
    }
}
