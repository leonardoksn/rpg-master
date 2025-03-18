"use client"

import type React from "react"

import { createCombat } from "@/actions/combat/create-combat"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Dice6, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CharacterTemplateSelector } from "./character-template-selector"

export default function CreationCombat({ characters }: { characters: Record<string, ICharacterData> }) {

    const router = useRouter()
    const [combatName, setCombatName] = useState("Novo Combate")
    const [initiativeRolls, setInitiativeRolls] = useState<Record<string, number>>({})
    const [combatCharacters, setCombatCharacters] = useState<Character[]>([])

    const rollInitiative = (character: Character) => {
        const roll = Math.floor(Math.random() * 20) + 1
        const initiative = roll + character.otherStats.initiative
        setInitiativeRolls({
            ...initiativeRolls,
            [character.id]: initiative,
        })
    }

    const rollAllInitiative = () => {
        const rolls: Record<string, number> = {}

        // Roll for added combat characters
        combatCharacters.forEach((character) => {
            const roll = Math.floor(Math.random() * 20) + 1
            rolls[character.id] = roll + character.otherStats.initiative
        })

        setInitiativeRolls(rolls)
    }

    const handleAddCharacters = (newCharacters: Character[]) => {
        setCombatCharacters([...combatCharacters, ...newCharacters])
    }

    const removeCharacter = (characterId: string) => {
        setCombatCharacters(combatCharacters.filter((c) => c.id !== characterId))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const combatSession: CombatSessionRequest = {
            activeCharacterIndex: 0,
            characters: combatCharacters.map((c) => ({
                ...c,
                initiative: initiativeRolls[c.id],
                initiativeRoll: initiativeRolls[c.id],
            })).sort((a, b) => b.initiative - a.initiative),
            name: combatName,
            round: 1,
        };
        const id = await createCombat(combatSession);

        // In a real app, we would save the combat session here
        router.push(`/combat/${id.data}`)
    }

    // Combine selected characters from the list and added combat characters
    const allSelectedCharacterIds = [...combatCharacters.map((c) => c.id)]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                    <Link href="/combat">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Start New Combat</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do combate</CardTitle>
                            <CardDescription>Dê um nome ao seu encontro de combate</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="combatName">Nome do combate</Label>
                                <Input
                                    id="combatName"
                                    value={combatName}
                                    onChange={(e) => setCombatName(e.target.value)}
                                    placeholder="Insira o nome do combate"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle>Selecione os participantes</CardTitle>
                                <CardDescription>Escolha personagens para este combate</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={rollAllInitiative}
                                disabled={allSelectedCharacterIds.length === 0}
                            >
                                <Dice6 className="mr-2 h-4 w-4" /> Iniciativa Roll All
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Existing characters from the database */}
                                {/* Characters added from templates */}
                                {combatCharacters.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium">Personagens de modelo adicionados</h3>
                                        {combatCharacters.map((character) => (
                                            <div key={character.id} className="flex items-center justify-between p-2 border rounded-md">
                                                <div className="flex items-center space-x-2">
                                                    <Label className="flex items-center">
                                                        <span>{character.name}</span>
                                                        <span className="ml-2 text-xs text-muted-foreground">({character.type})</span>
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm">Initiativa:</span>
                                                        <Input
                                                            type="number"
                                                            className="w-16 h-8"
                                                            value={initiativeRolls[character.id] || ""}
                                                            onChange={(e) => {
                                                                setInitiativeRolls({
                                                                    ...initiativeRolls,
                                                                    [character.id]: Number.parseInt(e.target.value) || 0,
                                                                })
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => rollInitiative(character)}>
                                                        <Dice6 className="h-4 w-4" />
                                                        <span className="sr-only">Rolar iniciativa</span>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeCharacter(character.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                        <span className="sr-only">Remover personagem</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button type="button" variant="outline" asChild className="flex-1">
                                        <Link href="/characters/new">
                                            <Plus className="mr-2 h-4 w-4" /> Criar novo personagem
                                        </Link>
                                    </Button>

                                    <div className="flex-1">
                                        <CharacterTemplateSelector
                                            availableCharacters={characters}
                                            onAddCharacters={handleAddCharacters}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-sm text-muted-foreground">{allSelectedCharacterIds.length} personagens selecionado(s)</p>
                        </CardFooter>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" asChild>
                        <Link href="/combat">Cancelar</Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            allSelectedCharacterIds.length === 0 ||
                            Object.keys(initiativeRolls).length !== allSelectedCharacterIds.length
                        }
                    >
                        Iniciar combate
                    </Button>
                </div>
            </form>
        </div>
    )
}

