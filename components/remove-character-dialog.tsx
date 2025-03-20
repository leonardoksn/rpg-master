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
import { UserMinus } from "lucide-react"
import { useState } from "react"

interface RemoveCharacterDialogProps {
  character: CombatCharacter
  onRemoveCharacter: (characterId: string) => void
}

export function RemoveCharacterDialog({ character, onRemoveCharacter }: RemoveCharacterDialogProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const handleRemoveCharacter = () => {
    onRemoveCharacter(character.id)
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 absolute top-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          <UserMinus className="h-4 w-4 text-destructive" />
          <span className="sr-only">Remover do combate</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remover personagem</DialogTitle>
          <DialogDescription>Tem certeza de que deseja remover {character.name} do combate?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleRemoveCharacter}>
            <UserMinus className="mr-2 h-4 w-4" />
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

