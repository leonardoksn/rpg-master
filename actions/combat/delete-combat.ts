"use server"
import db from "@/lib/db/db"

export async function deleteCombat(id: string) {
    try {

        // Aqui você implementaria a lógica real do banco de dados
        // Por exemplo, usando Prisma:
        await db.combats.deleteCombat(id);

        return { success: true, data: "removido" }
    } catch (error) {
        console.error("Error update active character:", error)
        return { success: false, error: "Failed to create character" }
    }
}