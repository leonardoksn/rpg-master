"use client"

import { deleteCharacter } from "@/actions/characters/delete-characters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import Link from "next/link"

interface CharacterCardProps {
  character: ICharacterData
  id: string;
}

export function CharacterCard({ character, id }: CharacterCardProps) {
  const onDelete = async (id: string) => {
    await deleteCharacter(id)
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{character.name}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge
                  variant={character.type === "PC" ? "default" : character.type === "NPC" ? "secondary" : "destructive"}
                >
                  {character.type}
                </Badge>
                {character.class && character.level && (
                  <Badge variant="outline">
                    {character.class} {character.level}
                  </Badge>
                )}
                {character.size && <Badge variant="outline">{character.size}</Badge>}
              </div>
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remover</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="text-xs text-muted-foreground">HP</span>
            <span className="font-bold">
              {character.maxHp}
            </span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="text-xs text-muted-foreground">CA</span>
            <span className="font-bold">{character.ac}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="text-xs text-muted-foreground">PE</span>
            <span className="font-bold">
              {character.maxEp ? `${character.maxEp}` : "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.entries(character.attributes).map(([stat, value]) => (
            <div key={stat} className="flex flex-col items-center p-1 bg-muted/50 rounded-md">
              <span className="text-xs uppercase">{stat.slice(0, 3)}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium mb-1">Ações:</h4>
            <ul className="text-sm text-muted-foreground">
              {character.actions.slice(0, 2).map((action) => (
                <li key={action.id}>{action.name}</li>
              ))}
              {character.actions.length > 2 && <li>+ {character.actions.length - 2} mais</li>}
            </ul>
          </div>

          {character.movement && (
            <div className="flex justify-between text-sm">
              <span className="font-medium">Movimento:</span>
              <span>{character.movement} m/turno</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="font-medium">Atenção:</span>
            <span>{character.otherStats.attention}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">Iniciativa:</span>
            <span>{character.otherStats.initiative}</span>
          </div>

        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/characters/${id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

