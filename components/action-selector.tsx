"use client"

import { DiceRoller } from "@/components/dice-roller"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Zap } from "lucide-react"
import { useState } from "react"

interface ActionSelectorProps {
  character: Character
  targets: Character[]
  onActionComplete: (action: Action, target: Character | null, attackRoll: number | null, damage: number | null) => void
}

export function ActionSelector({ character, targets, onActionComplete }: ActionSelectorProps) {
  const [actionType, setActionType] = useState<ActionTiming>("action")
  const [selectedActionId, setSelectedActionId] = useState("")
  const [selectedTargetId, setSelectedTargetId] = useState("")
  const [attackRoll, setAttackRoll] = useState<number | null>(null)
  const [damageRoll, setDamageRoll] = useState<number | null>(null)

  const getActionsForType = (type: ActionTiming) => {
    switch (type) {
      case "action":
        return character.actions
      case "bonus":
        return character.bonusActions
      case "reaction":
        return character.reactions
      default:
        return character.actions
    }
  }

  const selectedAction = getActionsForType(actionType).find((a) => a.id === selectedActionId)
  const selectedTarget = targets.find((t) => t.id === selectedTargetId)

  const handleComplete = () => {
    if (selectedAction) {
      onActionComplete(selectedAction, selectedTarget || null, attackRoll, damageRoll)

      // Reset state
      setSelectedActionId("")
      setSelectedTargetId("")
      setAttackRoll(null)
      setDamageRoll(null)
    }
  }

  const getActionUsesRemaining = (action: Action) => {
    if (action.usesPerRound === undefined) return "∞"
    const used = action.currentUses || 0
    return `${used}/${action.usesPerRound}`
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="action" onValueChange={(value) => setActionType(value as ActionTiming)}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="action">Actions</TabsTrigger>
          <TabsTrigger value="bonus">Bonus Actions</TabsTrigger>
          <TabsTrigger value="reaction">Reactions</TabsTrigger>
        </TabsList>

        <TabsContent value="action" className="space-y-4">
          <ActionList
            actions={character.actions}
            selectedActionId={selectedActionId}
            onSelectAction={setSelectedActionId}
            showUsesRemaining={true}
          />
        </TabsContent>

        <TabsContent value="bonus" className="space-y-4">
          <ActionList
            actions={character.bonusActions}
            selectedActionId={selectedActionId}
            onSelectAction={setSelectedActionId}
            showUsesRemaining={true}
          />
        </TabsContent>

        <TabsContent value="reaction" className="space-y-4">
          <ActionList
            actions={character.reactions}
            selectedActionId={selectedActionId}
            onSelectAction={setSelectedActionId}
            showUsesRemaining={true}
          />
        </TabsContent>
      </Tabs>

      {selectedAction && (
        <div className="space-y-4">
          <div className="p-3 border rounded-md">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{selectedAction.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{selectedAction.actionType}</Badge>
                  {selectedAction.usesPerRound && (
                    <Badge variant="secondary">Uses: {getActionUsesRemaining(selectedAction)}</Badge>
                  )}
                </div>
              </div>
              {selectedAction.range && <Badge variant="secondary">Range: {selectedAction.range} m</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{selectedAction.description}</p>
          </div>

          {(selectedAction.actionType === "attack" || selectedAction.actionType === "spell") && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Select Target</label>
                <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a target" />
                  </SelectTrigger>
                  <SelectContent>
                    {targets.map((target) => (
                      <SelectItem key={target.id} value={target.id}>
                        {target.name} (HP: {target.health.current}/{target.health.max})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTargetId && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {selectedAction.attackBonus !== undefined && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center">
                            <Target className="mr-2 h-4 w-4" />
                            Attack Roll (vs AC {selectedTarget?.ac})
                          </h4>
                          <DiceRoller
                            defaultFormula={`1d20+${selectedAction.attackBonus}`}
                            onRoll={setAttackRoll}
                            allowManualEntry={true}
                          />
                        </div>
                      )}

                      {selectedAction.damageFormula &&
                        (attackRoll === null || attackRoll >= (selectedTarget?.ac || 0)) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Zap className="mr-2 h-4 w-4" />
                              Damage Roll
                            </h4>
                            <DiceRoller
                              defaultFormula={selectedAction.damageFormula}
                              onRoll={setDamageRoll}
                              allowManualEntry={true}
                            />
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleComplete}
              disabled={
                !selectedAction ||
                (selectedAction.actionType === "attack" && !selectedTargetId) ||
                (selectedAction.actionType === "attack" && attackRoll === null) ||
                (selectedAction.usesPerRound !== undefined && (selectedAction.currentUses || 0) >= selectedAction.usesPerRound)
              }
            >
              Completar {actionType}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

interface ActionListProps {
  actions: Action[]
  selectedActionId: string
  onSelectAction: (id: string) => void
  showUsesRemaining?: boolean
}

function ActionList({ actions, selectedActionId, onSelectAction, showUsesRemaining = false }: ActionListProps) {
  if (actions.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No actions available</div>
  }

  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <div
          key={action.id}
          className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedActionId === action.id ? "bg-accent" : "hover:bg-accent/50"
            }`}
          onClick={() => onSelectAction(action.id)}
        >
          <div className="flex justify-between">
            <span className="font-medium">{action.name}</span>
            <div className="flex gap-2">
              <Badge variant="outline">{action.actionType}</Badge>
              {showUsesRemaining && action.usesPerRound && (
                <Badge variant={(action.currentUses || 0) >= action.usesPerRound ? "destructive" : "secondary"}>
                  {action.currentUses || 0}/{action.usesPerRound}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

