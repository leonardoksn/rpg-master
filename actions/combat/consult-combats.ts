// Primeiro, crie um arquivo server action (ex: app/actions/character.ts)
"use server"

import db from "@/lib/db/db"; // Supondo que você tenha uma configuração de banco de dados


export async function consultCombats() {
    try {

        // Aqui você implementaria a lógica real do banco de dados
        // Por exemplo, usando Prisma:
        const combats = await db.combats.findAll()
        if (!combats) {
            return { success: false, error: "Failed to find combats" }
        }

        return { success: true, data: Object.values(combats) }
    } catch (error) {
        console.error("Error creating character:", error)
        return { success: false, error: "Failed to create character" }
    }
}
