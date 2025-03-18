// Primeiro, crie um arquivo server action (ex: app/actions/character.ts)
"use server"

import db from "@/lib/db/db"; // Supondo que você tenha uma configuração de banco de dados


export async function getCharacter(id: string) {
    try {

        // Aqui você implementaria a lógica real do banco de dados
        // Por exemplo, usando Prisma:
        const character = await db.characters.findOne(id);

        return character;
    } catch (error) {
        throw new Error("Erro ao busca personagen")
    }
}
