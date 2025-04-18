"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'
import React, { useState } from "react"

interface HPManagerProps extends React.PropsWithChildren {
    characterId: string
    characterName: string
    currentHP: number
    onUpdate: (characterId: string, amount: number, isTemp?: boolean) => void
}

export function HPManager({ characterId, characterName, currentHP, onUpdate, children }: HPManagerProps) {
    const [hp, setHp] = useState<string>('0')
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [isTemp, setIsTemp] = useState<boolean>(true)
    const handleAddHP = () => {
        if (!hp) return
        const hpNumber = parseInt(hp);

        if (isNaN(hpNumber)) {
            alert("Por favor, insira um número válido.")
            return
        }

        onUpdate(characterId, hpNumber, isTemp)
        setDialogOpen(false)
        setHp('0')
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 border-none text-red-300">
                    {children}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Atualizar vida do personagem</DialogTitle>
                    <DialogDescription>
                        Atualize o hp do {characterName}.
                        Vida atual: {currentHP}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="temp-hp-amount">Quantidade de HP ganho ou perdido</Label>
                        <Input
                            id="temp-hp-amount"
                            type="number"
                            value={hp}
                            onChange={(e) => setHp(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button variant="outline" onClick={() => setIsTemp(!isTemp)}>
                        {isTemp ? "Remover HP temporário" : "Ignorar HP temporário"}
                    </Button>
                    <Button onClick={handleAddHP}>
                        <Plus className="mr-2 h-4 w-4" />
                        Atualizar {hp} HP
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

