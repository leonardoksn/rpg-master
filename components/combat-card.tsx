"use client"

import { deleteCombat } from "@/actions/combat/delete-combat";
import { History, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function CombatCard({ session }: { session: CombatSession }) {
    const onDelete = async () => {
        await deleteCombat(session.id)
    }
    return <Card>
        <CardHeader className="relative">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{session.name}</CardTitle>
                    <CardDescription>
                        <Badge variant={session.status === "active" ? "default" : "secondary"}>
                            {session.status === "active" ? "Ativo" : "Completo"}
                        </Badge>
                        <span className="ml-2 text-xs text-muted-foreground">Rodada {session.round}</span>
                    </CardDescription>
                </div>
            </div>
            <div className="flex space-x-2 absolute top-0 right-1">
                {onDelete && (
                    <Button variant="ghost" size="icon" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover</span>
                    </Button>
                )}
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <h4 className="text-sm font-medium">Participantes:</h4>
                <ul className="text-sm text-muted-foreground">
                    {session.characters.slice(0, 3).map((character) => (
                        <li key={character.id} className="flex justify-between">
                            <span>{character.name}</span>
                            <span>Initiative: {character.initiativeRoll}</span>
                        </li>
                    ))}
                    {session.characters.length > 3 && <li>+ {session.characters.length - 3} more</li>}
                </ul>
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/combat-history/${session.id}`}>
                    <History className="mr-2 h-4 w-4" /> Logs
                </Link>
            </Button>
            <Button size="sm" asChild>
                <Link href={`/combat/${session.id}`}>
                    <Play className="mr-2 h-4 w-4" /> {session.status === "active" ? "Continuar" : "Ver"}
                </Link>
            </Button>
        </CardFooter>
    </Card>
}