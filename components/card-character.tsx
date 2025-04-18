import { CONDITIONS } from "@/lib/constants";
import { ChevronRight, Flame, Heart, X, Zap } from "lucide-react";
import { ArmorClassEditor } from "./armor-class-editor";
import { ConditionManager } from "./condition-manager";
import { HPManager } from "./hp-manager";
import { RemoveCharacterDialog } from "./remove-character-dialog";
import { TempHPManager } from "./temp-hp-manager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const getHealthColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage > 66) return "-green-500"
    if (percentage > 33) return "-yellow-500"
    return "-red-500"
}

export function CardCharacter({ adjustEnergy, adjustHealth, adjustIntegrity, handleChange, setSelectedCharacterId, character, index, activeIndex, selectedCharacterId, addCondition, updateArmorClass, removeCharacterFromCombat, removeCondition, addTemporaryHP }: CombatSessionCharacterCardProps) {
    return <Card
        onClick={() => setSelectedCharacterId(character.id)}
        className={`border-l-4 ${index === activeIndex ? "border-l-primary" : "border-l-gray-700"} ${character.id === selectedCharacterId ? "border-primary" : ""} p-0 overflow-hidden`}
    >
        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    {index === activeIndex && <ChevronRight className="h-5 w-5 text-primary mr-1" />}
                    <h3 className="font-bold text-lg mr-2">{character.name}</h3>
                    <TempHPManager
                        characterId={character.id}
                        characterName={character.name}
                        currentTempHP={character.health.temporary}
                        onAddTempHP={addTemporaryHP}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <ArmorClassEditor
                        characterId={character.id}
                        characterName={character.name}
                        currentAC={character.ac}
                        onUpdateAC={updateArmorClass}
                    />
                    <RemoveCharacterDialog character={character} onRemoveCharacter={removeCharacterFromCombat} />
                </div>
            </div>

            <div className="text-sm text-gray-400 mb-3">
                Iniciativa: {character.initiative}
                <span className="mx-2">•</span> {!character.conditions.length && "Sem condições"}
                <div className="flex flex-wrap gap-1 mb-2">
                    {character.conditions.map((condition) => (
                        <Badge key={condition.type} variant="secondary" className="flex items-center gap-1">
                            {CONDITIONS[condition.type]}
                            {condition.duration && <span className="text-xs">({condition.duration})</span>}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeCondition(character.id, condition.type)}
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remover</span>
                            </Button>
                        </Badge>
                    ))}
                </div>
            </div>
            <ConditionManager
                characterId={character.id}
                characterName={character.name}
                conditions={character.conditions}
                onAddCondition={addCondition}
                onRemoveCondition={removeCondition}
            />

            <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center">
                    <HPManager 
                        characterId={character.id}
                        characterName={character.name}
                        currentHP={character.health.current}
                        onUpdate={adjustHealth}
                    >
                        <Heart className={`h-4 w-4 mr-1 text${getHealthColor(character.health.current, character.health.max)}`} />
                    </HPManager>
                    <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
                        <div
                            className={`h-full bg${getHealthColor(character.health.current, character.health.max)} px-1 text-xs flex items-center w-full`}
                            style={{ width: `${(character.health.current / character.health.max) * 100}%` }}
                        >
                            <input
                                type="number"
                                className="border-none outline-none bg-transparent text-inherit w-10"
                                value={character.health.current}
                                onChange={(e) => handleChange(character.id, Number(e.currentTarget.value))}
                                max={character.health.max}
                            /> /{character.health.max} {
                                character.health.temporary && <span className="text-blue-200">({character.health.temporary})</span>
                            }
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-1 text-purple-400" />
                    <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
                        <div
                            className="h-full bg-purple-600 px-1 text-xs flex items-center"
                            style={{ width: `${(character.integrity.current / character.integrity.max) * 100}%` }}
                        >
                            <input
                                type="number"
                                className="border-none outline-none bg-transparent text-inherit w-10"
                                value={character.integrity.current}
                                onChange={(e) => adjustIntegrity(character.id, Number.parseInt(e.target.value) || 0)}
                                max={character.integrity.max}
                            />/{character.integrity.max}
                        </div>
                    </div>
                </div>
                {character.energy && character.energy.max > 0 && (
                    <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-1 text-yellow-400" />
                        <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
                            <div
                                className="h-full bg-yellow-600 px-1 text-xs flex items-center"
                                style={{ width: `${(character.energy.current / character.energy.max) * 100}%` }}
                            >
                                <input
                                    type="number"
                                    className="border-none outline-none bg-transparent text-inherit w-10"
                                    value={character.energy.current}
                                    onChange={(e) => adjustEnergy(character.id, Number.parseInt(e.target.value) || 0)}
                                    max={character.energy.max}
                                />/{character.energy.max}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </Card>
}