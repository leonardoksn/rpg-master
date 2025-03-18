import { CharacterCard } from "@/components/character-card"
import { Button } from "@/components/ui/button"
import db from "@/lib/db/db"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function CharactersPage() {

  const characters = await db.characters.findAll();

  if (!characters) {
    return <div>Carregando...</div>
  }

  const charactersArray = Object.keys(characters);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Personagens</h1>
        <Button asChild>
          <Link href="/characters/new">
            <Plus className="mr-2 h-4 w-4" /> Novo personagem
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charactersArray.map((id) => (
          <CharacterCard key={id} id={id} character={characters[id] as ICharacterData} />
        ))}
      </div>
    </div>
  )
}

