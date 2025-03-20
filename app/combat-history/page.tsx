import { consultCombats } from "@/actions/combat/consult-combats"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Calendar, Eye } from "lucide-react"
import Link from "next/link"

export default async function CombatHistoryPage() {
  const combatSessions = await consultCombats();
  if (combatSessions.error || !combatSessions.data) {
    return <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">Nenhum histórico de combate disponível</p>
      <Button asChild>
        <Link href="/combat/new">Iniciar novo combate</Link>
      </Button>
    </div>
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Combat History</h1>
        <Button variant="outline">
          <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
        </Button>
      </div>

      <div className="space-y-4">
        {combatSessions.data.map((session) => (
          <Card key={session.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{session.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                    <Badge variant={session.status === "active" ? "default" : "secondary"} className="ml-2">
                      {session.status === "active" ? "Active" : "Completed"}
                    </Badge>
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/combat-history/${session.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Participantes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.characters.map((character) => (
                      <Badge key={character.id} variant="outline">
                        {character.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Resumo:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-xs text-muted-foreground">Rodadas</div>
                      <div className="font-bold">{session.round}</div>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-xs text-muted-foreground">Participantes</div>
                      <div className="font-bold">{session.characters.length}</div>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-xs text-muted-foreground">Ações</div>
                      <div className="font-bold">{session.logs.length}</div>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-xs text-muted-foreground">Duração</div>
                      <div className="font-bold">--:--</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

