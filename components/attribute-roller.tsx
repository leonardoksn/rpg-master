"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dice6 } from "lucide-react"
import { rollAttribute, rollSkill } from "@/lib/dice"

interface AttributeRollerProps {
  label: string
  value: number
  isSkill?: boolean
  onRoll?: (result: number) => void
  allowManualEntry?: boolean
}

export function AttributeRoller({
  label,
  value,
  isSkill = false,
  onRoll,
  allowManualEntry = true,
}: AttributeRollerProps) {
  const [result, setResult] = useState<{
    roll: number
    modifier: number
    total: number
  } | null>(null)
  const [manualValue, setManualValue] = useState("")
  const [useManual, setUseManual] = useState(false)

  const handleRoll = () => {
    if (useManual && allowManualEntry) {
      const manualResult = Number.parseInt(manualValue)
      if (!isNaN(manualResult)) {
        setResult({
          roll: manualResult,
          modifier: 0,
          total: manualResult,
        })
        if (onRoll) onRoll(manualResult)
      }
    } else {
      const rollResult = isSkill ? rollSkill(value) : rollAttribute(value)
      setResult(rollResult)
      if (onRoll) onRoll(rollResult.total)
    }
  }

  const modifier = isSkill ? value : Math.floor((value - 10) / 2)
  const modifierText = modifier >= 0 ? `+${modifier}` : modifier.toString()

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          {allowManualEntry && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              onClick={() => setUseManual(!useManual)}
            >
              {useManual ? "Roll" : "Manual"}
            </Button>
          )}
          {useManual && allowManualEntry ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                className="w-16 h-7"
                placeholder="Value"
              />
              <Button type="button" size="sm" className="h-7" onClick={handleRoll}>
                Enter
              </Button>
            </div>
          ) : (
            <Button type="button" size="sm" variant="outline" className="h-7" onClick={handleRoll}>
              <Dice6 className="mr-1 h-4 w-4" />
              d20 {modifierText}
            </Button>
          )}
        </div>
      </div>

      {result && (
        <div className="p-2 bg-muted rounded-md flex justify-between items-center text-sm">
          <span>Result:</span>
          <div className="font-bold">
            {result.total}
            {!useManual && (
              <span className="text-xs text-muted-foreground ml-1">
                ({result.roll} {result.modifier >= 0 ? "+" : ""}
                {result.modifier})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

