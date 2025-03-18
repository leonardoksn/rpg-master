"use server"
import db from "@/lib/db/db"

export async function updateCombatCharacterTemporaryHealth(props: { combatId: string, characterId: string }, tempHp: number) {
    try {

        // Aqui você implementaria a lógica real do banco de dados
        // Por exemplo, usando Prisma:
        const combatId = await db.combats.updateCombatCharacterTemporaryHealth(props, tempHp)

        return { success: true, data: combatId }
    } catch (error) {
        console.error("Error creating character:", error)
        return { success: false, error: "Failed to create character" }
    }
}