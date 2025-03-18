import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Swords, Users, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Feiticeiros e Maldições</h1>
        <p className="text-xl text-muted-foreground">Aplicação RPG Master</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/characters" className="no-underline">
          <div className="border rounded-lg p-6 h-full hover:bg-accent transition-colors flex flex-col items-center text-center">
            <Users className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Gerenciamento de Personagens</h2>
            <p className="text-muted-foreground">Registre e gerencie personagens de jogadores, NPCs e criaturas</p>
          </div>
        </Link>

        <Link href="/combat" className="no-underline">
          <div className="border rounded-lg p-6 h-full hover:bg-accent transition-colors flex flex-col items-center text-center">
            <Swords className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Rastreador de Combate</h2>
            <p className="text-muted-foreground">Gerenciar iniciativa, turnos e ações de combate</p>
          </div>
        </Link>

        <Link href="/rules" className="no-underline">
          <div className="border rounded-lg p-6 h-full hover:bg-accent transition-colors flex flex-col items-center text-center">
            <BookOpen className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Referência de regras</h2>
            <p className="text-muted-foreground">Acesso rápido às regras e tabelas de Sorcerers & Curses</p>
          </div>
        </Link>

        <Link href="/combat-history" className="no-underline">
          <div className="border rounded-lg p-6 h-full hover:bg-accent transition-colors flex flex-col items-center text-center">
            <Shield className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">História de Combate</h2>
            <p className="text-muted-foreground">Ver registros de encontros de combate anteriores</p>
          </div>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/combat/new">Comece um novo combate</Link>
        </Button>
      </div>
    </div>
  )
}

