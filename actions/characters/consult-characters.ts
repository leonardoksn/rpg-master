// Primeiro, crie um arquivo server action (ex: app/actions/character.ts)
"use server"

import db from "@/lib/db/db"; // Supondo que você tenha uma configuração de banco de dados


export async function charactersFindall() {
    try {

        // Aqui você implementaria a lógica real do banco de dados
        // Por exemplo, usando Prisma:
        const characters = await db.charactersMongo.findAll()

        const charactersData = characters.map((character) => {
            const characterData = character.toJSON(); // Converte para JSON
            characterData.id = character._id.toString(); // Adiciona o ID
            characterData._id = character._id.toString(); // Adiciona o ID
            characterData.createdAt = character.createdAt.toString(); // Adiciona a data de criação
            characterData.updatedAt = character.updatedAt.toString(); // Adiciona a data de atualização
            // characterData.passives = character.passives.toJSON();
            return characterData;
        })
        return charactersData;
    } catch (error) {
        throw new Error("Erro ao buscar personagens")
    }
}
