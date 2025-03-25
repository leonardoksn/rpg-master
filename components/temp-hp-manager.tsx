"use client"

import { DiceRoller } from "@/components/dice-roller"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hourglass, Plus } from 'lucide-react'
import { useState } from "react"

interface TempHPManagerProps {
    characterId: string
    characterName: string
    currentTempHP?: number
    onAddTempHP: (characterId: string, amount: number) => void
}

export function TempHPManager({ characterId, characterName, currentTempHP = 0, onAddTempHP }: TempHPManagerProps) {
    const [tempHP, setTempHP] = useState<number>(0)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const handleAddTempHP = () => {
        if (tempHP > 0) {
            onAddTempHP(characterId, tempHP)
            setDialogOpen(false)
            setTempHP(0)
        }
    }

    const handleDiceRoll = (result: number) => {
        setTempHP(result)
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 border-none text-red-300">
                    <Hourglass className="h-4 w-4 mr-1" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar pontos de vida temporários</DialogTitle>
                    <DialogDescription>
                        Adicione pontos de vida temporários a {characterName}. Eles serão esgotados antes dos pontos de vida regulares.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="temp-hp-amount">Quantidade de HP temporária</Label>
                        <Input
                            id="temp-hp-amount"
                            type="number"
                            min="0"
                            value={tempHP}
                            onChange={(e) => setTempHP(parseInt(e.target.value) || 0)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Role os dados para HP temporário</Label>
                        <DiceRoller
                            defaultFormula="1d8+2"
                            onRoll={handleDiceRoll}
                            allowManualEntry={true}
                        />
                    </div>

                    {currentTempHP > 0 && (
                        <div className="text-sm text-amber-500 dark:text-amber-400">
                            Observação: novos pontos de vida temporários substituirão os pontos de vida temporários atuais {currentTempHP}, se forem maiores.
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddTempHP} disabled={tempHP <= 0}>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar {tempHP} HP temporário
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

