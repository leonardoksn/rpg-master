"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, MinusCircle, Gauge } from "lucide-react"

interface IntegrityManagerProps {
  characterId: string
  characterName: string
  integrity: {
    current: number
    max: number
  }
  onAdjustIntegrity: (characterId: string, amount: number) => void
}

export function IntegrityManager({ characterId, characterName, integrity, onAdjustIntegrity }: IntegrityManagerProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [adjustAmount, setAdjustAmount] = useState<number>(0)

  const handleAdjustIntegrity = (isIncrease: boolean) => {
    if (adjustAmount > 0) {
      onAdjustIntegrity(characterId, isIncrease ? adjustAmount : -adjustAmount)
      setDialogOpen(false)
      setAdjustAmount(0)
    }
  }

  // Calculate integrity percentage for visual indicator
  const integrityPercentage = Math.round((integrity.current / integrity.max) * 100)

  // Determine color based on integrity level
  const getIntegrityColor = () => {
    if (integrityPercentage > 66) return "text-green-500"
    if (integrityPercentage > 33) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAdjustIntegrity(characterId, -1)}>
        <MinusCircle className="h-3 w-3 text-red-500" />
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div className={`w-16 text-center text-xs cursor-pointer ${getIntegrityColor()}`}>
            <Gauge className="inline-block h-3 w-3 mr-1" />
            {integrity.current}/{integrity.max}
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjust Integrity</DialogTitle>
            <DialogDescription>Modify the integrity value for {characterName}.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="integrity-amount">Amount</Label>
              <Input
                id="integrity-amount"
                type="number"
                min="0"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Quick Decrease</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAdjustAmount(5)}>
                    5
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAdjustAmount(10)}>
                    10
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAdjustAmount(25)}>
                    25
                  </Button>
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Quick Increase</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAdjustAmount(5)}>
                    5
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAdjustAmount(10)}>
                    10
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAdjustAmount(25)}>
                    25
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-sm">
              <p>
                Current Integrity:{" "}
                <span className={getIntegrityColor()}>
                  {integrity.current}/{integrity.max}
                </span>
              </p>
              <div className="w-full bg-secondary h-2 rounded-full mt-2">
                <div
                  className={`h-2 rounded-full ${
                    integrityPercentage > 66
                      ? "bg-green-500"
                      : integrityPercentage > 33
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${integrityPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleAdjustIntegrity(false)} disabled={adjustAmount <= 0}>
              <MinusCircle className="mr-2 h-4 w-4" />
              Decrease by {adjustAmount}
            </Button>
            <Button variant="default" onClick={() => handleAdjustIntegrity(true)} disabled={adjustAmount <= 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Increase by {adjustAmount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAdjustIntegrity(characterId, 1)}>
        <PlusCircle className="h-3 w-3 text-green-500" />
      </Button>
    </div>
  )
}

