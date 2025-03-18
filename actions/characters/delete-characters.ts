// Primeiro, crie um arquivo server action (ex: app/actions/character.ts)
"use server"

import db from "@/lib/db/db"; // Supondo que você tenha uma configuração de banco de dados


export async function deleteCharacter(id: string) {
    try {

        // Aqui você implementaria a lógica real do banco de dados
        // Por exemplo, usando Prisma:
        const characterId = await db.characters.delete(id)
        console.log("Character deleted:", characterId)

        return { success: true, characterId }
    } catch (error) {
        console.error("Error creating character:", error)
        return { success: false, error: "Failed to create character" }
    }
}
