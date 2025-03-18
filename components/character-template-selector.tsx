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
import { Copy, UserPlus } from "lucide-react"
import { useState } from "react"

interface CharacterTemplateSelectorProps {
    availableCharacters: Record<string, ICharacterData>
    onAddCharacters: (characters: Character[]) => void
}

export function CharacterTemplateSelector({ availableCharacters, onAddCharacters }: CharacterTemplateSelectorProps) {
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(1)
    const [namePrefix, setNamePrefix] = useState<string>("")
    const [nameSuffix, setNameSuffix] = useState<string>("")
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const selectedCharacter = availableCharacters[selectedCharacterId];

    const handleAddCharacters = () => {
        if (!selectedCharacter) return

        const newCharacters: Character[] = []

        for (let i = 0; i < quantity; i++) {
            // Create a new ID for each instance
            const newId = `${selectedCharacterId}-instance-${Date.now()}-${i}`

            // Create a new name based on prefix/suffix if provided
            let newName = selectedCharacter.name
            if (namePrefix) newName = `${namePrefix} ${newName}`
            if (nameSuffix) newName = `${newName} ${nameSuffix}`
            if (quantity > 1) newName = `${newName} ${i + 1}`

            // Clone the character with new ID and name;
            const newCharacterClone = structuredClone(selectedCharacter)
            const newCharacter: Character = {
                ...newCharacterClone,
                conditions: [],
                health: {
                    current: newCharacterClone.maxHp,
                    max: newCharacterClone.maxHp,
                },
                id: newId,
                name: newName,
                energy: {
                    current: newCharacterClone.maxEp,
                    max: newCharacterClone.maxEp,
                },
            }

            newCharacters.push(newCharacter)
        }

        onAddCharacters(newCharacters)
        setDialogOpen(false)

        // Reset form
        setSelectedCharacterId("")
        setQuantity(1)
        setNamePrefix("")
        setNameSuffix("")
    }
    const availableCharactersArray = Object.keys(availableCharacters);
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" /> Adicionar do modelo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Adicionar personagens do modelo</DialogTitle>
                    <DialogDescription>
                        Selecione um personagem existente para usar como modelo e adicione várias instâncias ao combate.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="character-template">Modelo de personagem</Label>
                        <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                            <SelectTrigger id="character-template">
                                <SelectValue placeholder="Selecione um modelo de personagem" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCharactersArray.map((id) => (
                                    <SelectItem key={id} value={id}>
                                        {availableCharacters[id].name} ({availableCharacters[id].type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedCharacter && (
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
                                        <span className="font-medium">Initiativa:</span> +{selectedCharacter.otherStats.initiative}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantidade</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            max="20"
                            value={quantity}
                            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                        />
                        <p className="text-xs text-muted-foreground">Quantas instâncias deste personagem adicionar</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name-prefix">Prefixo do nome (opcional)</Label>
                            <Input
                                id="name-prefix"
                                value={namePrefix}
                                onChange={(e) => setNamePrefix(e.target.value)}
                                placeholder="e.g. Elite"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name-suffix">Sufixo de nome (opcional)</Label>
                            <Input
                                id="name-suffix"
                                value={nameSuffix}
                                onChange={(e) => setNameSuffix(e.target.value)}
                                placeholder="e.g. Archer"
                            />
                        </div>
                    </div>

                    {selectedCharacter && quantity > 0 && (
                        <div className="text-sm text-muted-foreground">
                            <p>
                                Preview: {namePrefix ? `${namePrefix} ` : ""}
                                {selectedCharacter.name}
                                {nameSuffix ? ` ${nameSuffix}` : ""} {quantity > 1 ? "1" : ""}
                            </p>
                            {quantity > 1 && (
                                <p>
                                    through {namePrefix ? `${namePrefix} ` : ""}
                                    {selectedCharacter.name}
                                    {nameSuffix ? ` ${nameSuffix}` : ""} {quantity}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleAddCharacters} disabled={!selectedCharacterId || quantity < 1}>
                        <Copy className="mr-2 h-4 w-4" />
                        Adicionar {quantity} personagem{quantity !== 1 ? "s" : ""}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

