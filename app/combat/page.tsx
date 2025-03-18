import { consultCombats } from "@/actions/combat/consult-combats"
import CombatCard from "@/components/combat-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function CombatPage() {
  const combats = await consultCombats();
  if (!combats.data) {
    return <div>Erro ao carregar combates</div>
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rastreador de Combate</h1>
        <Button asChild>
          <Link href="/combat/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Combate
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(combats.data).map((session) => (
          <CombatCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  )
}

