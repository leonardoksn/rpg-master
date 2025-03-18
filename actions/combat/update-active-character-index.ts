"use server"
import db from "@/lib/db/db"

export async function updateActiveCharacterIndex(id: string, data: number) {
    try {

        // Aqui você implementaria a lógica real do banco de dados
        // Por exemplo, usando Prisma:
        const combatId = await db.combats.updateActiveCharacterIndex(id, data)

        return { success: true, data: combatId }
    } catch (error) {
        console.error("Error update active character:", error)
        return { success: false, error: "Failed to create character" }
    }
}