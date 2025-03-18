"use client"

import { ActionSelector } from "@/components/action-selector"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { attributes, saves } from "@/lib/expertise"
import { Activity, Footprints, Heart, Shield, Zap } from "lucide-react"
import { useState } from "react"
import { AttributeRoller } from "./attribute-roller"
import { TempHPManager } from "./temp-hp-manager"

interface CharacterActionPanelProps {
  character: CombatCharacter | undefined;
  allCharacters: CombatCharacter[]
  isActive: boolean;
  onHandleAddTempHP: (characterId: string, amount: number) => void;
  onActionComplete: (
    characterId: string,
    actionName: string,
    actionTiming: string,
    targetId: string | null,
    attackRoll: number | null,
    damage: number | null,
  ) => void
}

export function CharacterActionPanel({
  character,
  allCharacters,
  onActionComplete,
  onHandleAddTempHP
}: CharacterActionPanelProps) {
  if (!character) {
    return null;
  }
  const [activeTab, setActiveTab] = useState("actions")

  const handleAddTempHP = (characterId: string, amount: number) => {
    onHandleAddTempHP(characterId, amount);
    // This function will be passed to the parent component through props
    // For now, we'll just log it
    console.log(`Adding ${amount} temporary HP to ${characterId}`)
  }

  const handleActionComplete = (
    action: any,
    target: Character | null,
    attackRoll: number | null,
    damage: number | null,
  ) => {
    onActionComplete(character.id, action.name, action.timing || "action", target?.id || null, attackRoll, damage)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{character.name}</span>
            {character.class && character.level && (
              <Badge variant="outline">
                {character.class} {character.level}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Heart className="mr-1 h-4 w-4 text-red-500" />
              <span>
                {character.health.current}/{character.health.max}
                {character.health.temporary && character.health.temporary > 0 && (
                  <span className="text-blue-500 ml-1">+{character.health.temporary}</span>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-1 h-4 w-4 text-blue-500" />
              <span>CA {character.ac}</span>
            </div>
            {character.energy && (
              <div className="flex items-center">
                <Zap className="mr-1 h-4 w-4 text-yellow-500" />
                <span>
                  EP {character.energy.current}/{character.energy.max}
                </span>
              </div>
            )}
            <TempHPManager
              characterId={character.id}
              characterName={character.name}
              currentTempHP={character.health.temporary}
              onAddTempHP={handleAddTempHP}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 text-sm">
            <Activity className="h-4 w-4" />
            <span className="font-medium">Iniciativa:</span>
            <span>{character.initiativeRoll}</span>
          </div>
          {character.movement && (
            <div className="flex items-center gap-1 text-sm">
              <Footprints className="h-4 w-4" />
              <span className="font-medium">Movimento:</span>
              <span>{character.movement} m/turno</span>
            </div>
          )}
          {character.actionsPerTurn && (
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">Ações:</span>
              <span>
                {character.actionsUsed || 0}/{character.actionsPerTurn}
              </span>
            </div>
          )}

        </div>

        <Tabs defaultValue="actions" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="actions">Ações</TabsTrigger>
            <TabsTrigger value="attributes">Atributos</TabsTrigger>
            <TabsTrigger value="saves">TR</TabsTrigger>
            <TabsTrigger value="skills">Perícias</TabsTrigger>
            <TabsTrigger value="passives">Passivas</TabsTrigger>
          </TabsList>

          <TabsContent value="actions">
            <ActionSelector
              character={character}
              targets={allCharacters.filter((c) => c.id !== character.id)}
              onActionComplete={handleActionComplete}
            />
          </TabsContent>

          <TabsContent value="attributes">
            <div className="space-y-3">
              {attributes.map((value) => (
                <AttributeRoller
                  key={value.value}
                  label={value.label}
                  value={character.attributes[value.value]}
                  isSkill={false}
                  allowManualEntry={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saves">
            <div className="space-y-3">
              {
                saves.map((save) => (
                  <AttributeRoller
                    key={save.value}
                    label={save.label}
                    value={character.saves[save.value]}
                    isSkill={true}
                    allowManualEntry={true}
                  />
                ))
              }
              {!character.saves && <p className="text-center text-muted-foreground py-4">No saving throws defined</p>}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="space-y-3">
              {Object.entries(character.skills).map(([key, value]) => (
                <AttributeRoller
                  key={key}
                  label={`${value.label}${value.hasAdvantage ? " (Adv)" : ""}`}
                  value={value.modifier}
                  isSkill={true}
                  allowManualEntry={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="passives">
            <div className="space-y-3">
              {character.passives && character.passives.length > 0 ? (
                character.passives.map((passive) => (
                  <div key={passive.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{passive.name}</h3>
                      {passive.usesPerDay && (
                        <Badge variant="outline">
                          Uses: {passive.currentUses || 0}/{passive.usesPerDay}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{passive.description}</p>
                    {passive.usesPerDay && (
                      <div className="flex justify-end mt-2">
                        <Button size="sm" variant="outline">
                          Use
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No passive abilities defined</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

