"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { rollDice } from "@/lib/dice"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react"
import { useEffect, useState } from "react"

interface DiceRollerProps {
  defaultFormula?: string
  onRoll?: (result: number) => void
  allowManualEntry?: boolean
  className?: string
}

export function DiceRoller({
  defaultFormula = "1d20",
  onRoll,
  allowManualEntry = true,
  className = "",
}: DiceRollerProps) {
  const [formula, setFormula] = useState(defaultFormula)
  const [result, setResult] = useState<{
    total: number
    rolls: number[]
    modifier: number
  } | null>(null)
  const [manualValue, setManualValue] = useState("")
  const [useManual, setUseManual] = useState(false)

  const handleRoll = () => {
    if (useManual && allowManualEntry) {
      const manualResult = Number.parseInt(manualValue)
      if (!isNaN(manualResult)) {
        setResult({
          total: manualResult,
          rolls: [manualResult],
          modifier: 0,
        })
        if (onRoll) onRoll(manualResult)
      }
    } else {
      try {
        const diceResult = rollDice(formula)
        setResult({
          total: diceResult.result,
          rolls: diceResult.rolls,
          modifier: diceResult.modifier,
        })
        if (onRoll) onRoll(diceResult.result)
      } catch (error) {
        console.error("Invalid dice formula:", error)
      }
    }
  }

  const quickRoll = (diceFormula: string) => {
    setFormula(diceFormula)
    setUseManual(false)
    try {
      const diceResult = rollDice(diceFormula)
      setResult({
        total: diceResult.result,
        rolls: diceResult.rolls,
        modifier: diceResult.modifier,
      })
      if (onRoll) onRoll(diceResult.result)
    } catch (error) {
      console.error("Invalid dice formula:", error)
    }
  }
  const DiceIcon = () => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const [RrandomDice, setRandomDice] = useState<typeof Dice1 | null>(null)

    useEffect(() => {
      setRandomDice(icons[Math.floor(Math.random() * icons.length)])
    }, [])

    if (!RrandomDice) return null // Evita renderizar algo inconsistente no SSR

    return <RrandomDice className="h-5 w-5" />
  }


  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => quickRoll("1d4")}>
          d4
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => quickRoll("1d6")}>
          d6
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => quickRoll("1d8")}>
          d8
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => quickRoll("1d10")}>
          d10
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => quickRoll("1d12")}>
          d12
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => quickRoll("1d20")}>
          d20
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => quickRoll("1d100")}>
          d100
        </Button>
      </div>

      <div className="flex gap-2">
        {allowManualEntry && (
          <Button
            type="button"
            size="sm"
            variant={useManual ? "default" : "outline"}
            onClick={() => setUseManual(true)}
          >
            Manual
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant={!useManual ? "default" : "outline"}
          onClick={() => setUseManual(false)}
          disabled={!allowManualEntry}
        >
          Rolar Dados
        </Button>
      </div>

      <div className="flex gap-2">
        {useManual && allowManualEntry ? (
          <div className="flex-1">
            <Label htmlFor="manual-value" className="sr-only">
              Manual Value
            </Label>
            <Input
              id="manual-value"
              type="number"
              value={manualValue}
              onChange={(e) => setManualValue(e.target.value)}
              placeholder="Enter value"
              className="w-full"
            />
          </div>
        ) : (
          <div className="flex-1">
            <Label htmlFor="dice-formula" className="sr-only">
              Fórmula de dados
            </Label>
            <Input
              id="dice-formula"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g. 2d6+3"
              className="w-full"
            />
          </div>
        )}
        <Button type="button" onClick={handleRoll} className="whitespace-nowrap">
          <DiceIcon />
          <span className="ml-2">{useManual ? "Enviar" : "Rolar"}</span>
        </Button>
      </div>

      {result && (
        <div className="p-3 bg-muted rounded-md text-center">
          <div className="text-2xl font-bold">{result.total}</div>
          {!useManual && (
            <div className="text-xs text-muted-foreground">
              Rolls: [{result.rolls.join(", ")}]
              {result.modifier !== 0 && (
                <span>
                  {" "}
                  {result.modifier > 0 ? "+" : ""}
                  {result.modifier}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

