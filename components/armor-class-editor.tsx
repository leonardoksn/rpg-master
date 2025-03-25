"use client"

import { Button } from "@/components/ui/button"
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
import { Shield } from "lucide-react"
import { useState } from "react"

interface ArmorClassEditorProps {
  characterId: string
  characterName: string
  currentAC: number
  onUpdateAC: (characterId: string, newAC: number) => void
}

export function ArmorClassEditor({ characterId, characterName, currentAC, onUpdateAC }: ArmorClassEditorProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [newAC, setNewAC] = useState<number>(currentAC)

  const handleUpdateAC = () => {
    if (newAC !== currentAC) {
      onUpdateAC(characterId, newAC)
      setDialogOpen(false)
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open)
        if (open) setNewAC(currentAC)
      }}
    >
      <DialogTrigger asChild>
        <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
          <Shield className="h-4 w-4 text-blue-400 mr-1" />
          <span>{currentAC}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar classe de armadura</DialogTitle>
          <DialogDescription>Atualizar a classe de armadura para {characterName}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="armor-class">Classe de Armadura</Label>
            <Input
              id="armor-class"
              type="number"
              min="0"
              value={newAC}
              onChange={(e) => setNewAC(Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="flex items-center">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => setNewAC(Math.max(0, newAC - 1))}>
                -1
              </Button>
              <Button variant="outline" size="sm" onClick={() => setNewAC(Math.max(0, newAC - 2))}>
                -2
              </Button>
              <Button variant="outline" size="sm" onClick={() => setNewAC(Math.max(0, newAC - 5))}>
                -5
              </Button>
            </div>
            <div className="w-8"></div>
            <div className="flex-1 grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => setNewAC(newAC + 1)}>
                +1
              </Button>
              <Button variant="outline" size="sm" onClick={() => setNewAC(newAC + 2)}>
                +2
              </Button>
              <Button variant="outline" size="sm" onClick={() => setNewAC(newAC + 5)}>
                +5
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateAC} disabled={newAC === currentAC}>
            Atualizar CA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

