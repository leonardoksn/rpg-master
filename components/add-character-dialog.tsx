"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dice6, UserPlus } from "lucide-react"
import { useState } from "react"

interface AddCharacterDialogProps {
    availableCharacters?: Record<string, ICharacterData>;
    onAddCharacter: (character: CombatCharacter) => void
}

export function AddCharacterDialog({ availableCharacters, onAddCharacter }: AddCharacterDialogProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>("")
    const [initiativeRoll, setInitiativeRoll] = useState<number | null>(null)
    const [customName, setCustomName] = useState<string>("")

    const selectedCharacter = availableCharacters?.[selectedCharacterId];

    const rollInitiative = () => {
        if (!selectedCharacter) return
        const roll = Math.floor(Math.random() * 20) + 1
        setInitiativeRoll(roll + selectedCharacter.otherStats.initiative)
    }

    const handleAddCharacter = () => {
        if (!selectedCharacter || initiativeRoll === null) return

        // Create a unique ID for this instance
        const newId = `${selectedCharacterId}-instance-${Date.now()}`

        // Create a combat character from the template
        const newCharacterClone = structuredClone(selectedCharacter)
        const newCharacter: CombatCharacter = {
            ...newCharacterClone,
            initiativeRoll: initiativeRoll,
            initiative: initiativeRoll,
            conditions: [],
            integrity: {
                current: 100,
                max: 100
            },
            health: {
                current: newCharacterClone.maxHp,
                max: newCharacterClone.maxHp,
            },
            id: newId,
            name: customName,
            energy: {
                current: newCharacterClone.maxEp,
                max: newCharacterClone.maxEp,
            },

        }

        onAddCharacter(newCharacter)
        setDialogOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setSelectedCharacterId("")
        setInitiativeRoll(null)
        setCustomName("")
    }

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) resetForm()
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar personagem
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Adicionar personagem ao combate</DialogTitle>
                    <DialogDescription>Selecione um personagem para adicionar ao encontro de combate atual.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="character-select">Select Character</Label>
                        <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                            <SelectTrigger id="character-select">
                                <SelectValue placeholder="Escolha um personagem" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(availableCharacters ?? {}).map(([id, character]) => (
                                    <SelectItem key={id} value={id}>
                                        {character.name} ({character.type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedCharacter && (
                        <>
                            <Card>
                                <CardHeader className="py-2">
                                    <CardTitle className="text-base flex items-center justify-between">
                                        <span>{selectedCharacter.name}</span>
                                        <Badge
                                            variant={
                                                selectedCharacter.type === "PC"
                                                    ? "default"
                                                    : selectedCharacter.type === "NPC"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {selectedCharacter.type}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="py-2 text-sm">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <span className="font-medium">HP:</span> {selectedCharacter.maxHp}
                                        </div>
                                        <div>
                                            <span className="font-medium">CA:</span> {selectedCharacter.ac}
                                        </div>
                                        <div>
                                            <span className="font-medium">Iniciativa:</span> +{selectedCharacter.otherStats.initiative}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-2">
                                <Label htmlFor="custom-name">Nome personalizado (opcional)</Label>
                                <Input
                                    id="custom-name"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    placeholder={selectedCharacter.name}
                                />
                                <p className="text-xs text-muted-foreground">Deixe em branco para usar o nome original</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="initiative-roll">Iniciativa de rolagem</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="initiative-roll"
                                        type="number"
                                        value={initiativeRoll === null ? "" : initiativeRoll}
                                        onChange={(e) => setInitiativeRoll(Number.parseInt(e.target.value) || 0)}
                                        placeholder="Iniciativa de rolagem"
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="outline" onClick={rollInitiative}>
                                        <Dice6 className="mr-2 h-4 w-4" />
                                        Roll
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        CancelAR
                    </Button>
                    <Button onClick={handleAddCharacter} disabled={!selectedCharacter || initiativeRoll === null}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Adicionar ao combate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

