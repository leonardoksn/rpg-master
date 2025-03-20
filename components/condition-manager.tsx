"use client"

import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CONDITIONS } from "@/lib/constants"
import { AlertTriangle, Plus, X } from "lucide-react"
import { useState } from "react"

interface ConditionManagerProps {
  characterId: string
  characterName: string
  conditions: Condition[]
  onAddCondition: (characterId: string, condition: Condition) => void
  onRemoveCondition: (characterId: string, conditionType: ConditionType) => void
}

export function ConditionManager({
  characterId,
  characterName,
  conditions,
  onAddCondition,
  onRemoveCondition,
}: ConditionManagerProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedCondition, setSelectedCondition] = useState<string>("")
  const [duration, setDuration] = useState<string>("")
  const [source, setSource] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  const handleAddCondition = () => {
    if (!selectedCondition) return

    const newCondition: Condition = {
      type: selectedCondition as ConditionType,
      duration: duration ? Number.parseInt(duration) : undefined,
      source: source || undefined,
      notes: notes || undefined,
    }

    onAddCondition(characterId, newCondition)
    setDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedCondition("")
    setDuration("")
    setSource("")
    setNotes("")
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2">
        {conditions.map((condition) => (
          <Badge key={condition.type} variant="secondary" className="flex items-center gap-1">
            {CONDITIONS[condition.type]}
            {condition.duration && <span className="text-xs">({condition.duration})</span>}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => onRemoveCondition(characterId, condition.type)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remover</span>
            </Button>
          </Badge>
        ))}
        {conditions.length === 0 && <span className="text-xs text-muted-foreground">Sem condições</span>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar condição
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar condição</DialogTitle>
            <DialogDescription>Aplicar condição ao {characterName}.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="condition-type">Condição</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger id="condition-type">
                  <SelectValue placeholder="Selecionar condição" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONDITIONS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition-duration">
                Duração (rodadas)
                <span className="text-xs text-muted-foreground ml-2">Opcional</span>
              </Label>
              <Input
                id="condition-duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Deixe em branco por tempo indeterminado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition-source">
                Fonte
                <span className="text-xs text-muted-foreground ml-2">Opcional</span>
              </Label>
              <Input
                id="condition-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Oque causou essa condição?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition-notes">
                Observações
                <span className="text-xs text-muted-foreground ml-2">Opcional</span>
              </Label>
              <Textarea
                id="condition-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalhes adicionais sobre essa condição"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCondition} disabled={!selectedCondition}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Aplicar condição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

