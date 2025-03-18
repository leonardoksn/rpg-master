// Primeiro, crie um arquivo server action (ex: app/actions/character.ts)
"use server"

import db from "@/lib/db/db"; // Supondo que você tenha uma configuração de banco de dados


export async function findall() {
    try {

        // Aqui você implementaria a lógica real do banco de dados
        // Por exemplo, usando Prisma:
        const characters = await db.characters.findAll()


        return characters;
    } catch (error) {
       throw new Error("Erro ao buscar personagens")
    }
}
