import { ArrowRight, Heart, MinusCircle, PlusCircle, Zap } from "lucide-react";
import { SetStateAction } from "react";
import { ArmorClassEditor } from "./armor-class-editor";
import { ConditionManager } from "./condition-manager";
import { IntegrityManager } from "./integrity-manager";
import { RemoveCharacterDialog } from "./remove-character-dialog";
import { TempHPManager } from "./temp-hp-manager";
import { Button } from "./ui/button";

export default function CombatSessionCharacterCard(
    { character, updateArmorClass, selectedCharacterId, adjustIntegrity, addTemporaryHP, removeCondition, addCondition, index, activeIndex, setSelectedCharacterId, adjustHealth, handleChange, adjustEnergy, removeCharacterFromCombat }:
        CombatSessionCharacterCardProps) {
    return (
        <div
            key={character.id}
            className={`p-2 border rounded-md flex flex-wrap justify-between items-center cursor-pointer relative ${index === activeIndex ? "bg-accent" : ""} ${character.id === selectedCharacterId ? "border-primary" : ""}`}
            onClick={() => setSelectedCharacterId(character.id)}
        >
            <RemoveCharacterDialog character={character} onRemoveCharacter={removeCharacterFromCombat} />
            <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                    {index === activeIndex && <ArrowRight className="mr-2 h-4 w-4 text-primary" />}
                    <div>
                        <div className="font-medium">{character.name}</div>
                        <div className="text-xs text-muted-foreground">Iniciativa: {character.initiativeRoll}</div>
                    </div>
                </div>
                <ArmorClassEditor
                    characterId={character.id}
                    characterName={character.name}
                    currentAC={character.ac}
                    onUpdateAC={updateArmorClass}
                />
            </div>

            <ConditionManager
                characterId={character.id}
                characterName={character.name}
                conditions={character.conditions}
                onAddCondition={addCondition}
                onRemoveCondition={removeCondition}
            />

            <div className="flex flex-wrap items-center justify-between w-full gap-2 mt-2">
                <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); adjustHealth(character.id, -1); }}>
                        <MinusCircle className="h-3 w-3 text-red-500" />
                    </Button>
                    <div className="w-18 text-center text-xs flex items-center justify-center">
                        <Heart className="inline-block h-3 w-3 mr-1" />
                        <input type="number" className="w-12 text-center text-xs border rounded" value={character.health.current} onChange={(e) => handleChange(character.id, Number(e.currentTarget.value))} min={0} max={character.health.max} />
                        <span className="ml-1">/{character.health.max}  </span>
                        {!!character.health.temporary && <span className="ml-1 text-blue-500">+({character.health.temporary})</span>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); adjustHealth(character.id, 1); }}>
                        <PlusCircle className="h-3 w-3 text-green-500" />
                    </Button>
                </div>

                <TempHPManager
                    characterId={character.id}
                    characterName={character.name}
                    currentTempHP={character.health.temporary}
                    onAddTempHP={addTemporaryHP}
                />

                <IntegrityManager
                    characterId={character.id}
                    characterName={character.name}
                    integrity={character.integrity!}
                    onAdjustIntegrity={adjustIntegrity}
                />

                {character.energy && (
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); adjustEnergy(character.id, -1); }}>
                            <MinusCircle className="h-3 w-3 text-blue-500" />
                        </Button>
                        <div className="w-16 text-center text-xs">
                            <Zap className="inline-block h-3 w-3 mr-1" />
                            {character.energy.current}/{character.energy.max}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); adjustEnergy(character.id, 1); }}>
                            <PlusCircle className="h-3 w-3 text-yellow-500" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
