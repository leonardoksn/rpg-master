"use client"

import { updateActiveCharacterIndex } from "@/actions/combat/update-active-character-index"
import { updateCombatCharacter } from "@/actions/combat/update-combat-character"
import { updateCombatLog } from "@/actions/combat/update-combat-character copy"
import { updateRound } from "@/actions/combat/update-round"
import { CharacterActionPanel } from "@/components/character-action-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CONDITIONS } from "@/lib/constants"
import { ArrowLeft, ClipboardCopy, SkipForward } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { AddCharacterDialog } from "./add-character-dialog"
import CombatSessionCharacterCard from "./combat-session-character-card"
import { CombatSessionLogs } from "./combat-session-logs"
import { DiceRoller } from "./dice-roller"

export default function CombatSession({ combatSession, availableCharacters }: { combatSession: CombatSession; availableCharacters?: Record<string, ICharacterData> | undefined }) {
    // In a real app, we would fetch the combat session by ID
    const router = useRouter();

    const [round, setRound] = useState(combatSession.round)
    const [activeIndex, setActiveIndex] = useState(combatSession.activeCharacterIndex)
    const [characters, setCharacters] = useState<CombatCharacter[]>(
        [...combatSession.characters].sort((a, b) => b.initiativeRoll - a.initiativeRoll),
    )
    const [logs, setLogs] = useState<CombatLog[]>(combatSession.logs)
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)

    const activeCharacter = characters[activeIndex]
    const selectedCharacter = selectedCharacterId ? characters.find((c) => c.id === selectedCharacterId) : activeCharacter

    const nextTurn = async () => {
        if (activeIndex === characters.length - 1) {
            setRound(round + 1)
            setActiveIndex(0)

            // Reset action usage for all characters at the start of a new round
            const resetCharacters = characters.map((char) => {

                const updatedConditions: Condition[] = []
                char.conditions.forEach((condition) => {
                    if (condition.duration === undefined) {
                        updatedConditions.push(condition)
                        return
                    } // Keep indefinite conditions
                    if (condition.duration > 1) {
                        // Reduce duration by 1
                        updatedConditions.push({ ...condition, duration: condition.duration - 1 })
                        return
                    }
                    return
                })
                const removedConditions = char.conditions.filter((c) => c.duration === 1).map((c) => c.type)
                if (removedConditions.length > 0) {
                    const newLog: CombatLog = {
                        id: `log-${Date.now()}-conditions`,
                        round,
                        turn: activeIndex + 1,
                        characterId: char.id,
                        characterName: char.name,
                        action: "Condição expirada",
                        details: `Condições expiradas: ${removedConditions
                            .map((c) => CONDITIONS[c])
                            .join(", ")}`,
                        result: "other",
                        conditionChange: {
                            removed: removedConditions as ConditionType[],
                        },
                        timestamp: new Date().toISOString(),
                    }
                    setLogs((logs) => [...logs, newLog])
                    updateCombatLog(combatSession.id, [...logs, newLog])

                }

                return {
                    ...char,
                    actionsUsed: 0,
                    conditions: updatedConditions,
                    bonusActionsUsed: 0,
                    reactionsUsed: 0,
                    actions: char.actions.map((action) => ({
                        ...action,
                        currentUses: 0,
                    })),
                    bonusActions: char.bonusActions.map((action) => ({
                        ...action,
                        currentUses: 0,
                    })),
                    reactions: char.reactions.map((action) => ({
                        ...action,
                        currentUses: 0,
                    })),
                }
            })
            setCharacters(resetCharacters);
            await updateCombatCharacter(combatSession.id, resetCharacters);
            await updateRound(combatSession.id, round + 1);
            await updateActiveCharacterIndex(combatSession.id, 0)
        } else {
            setActiveIndex(activeIndex + 1)
            await updateActiveCharacterIndex(combatSession.id, activeIndex + 1)
        }

        setSelectedCharacterId(null);
    }

    const handleActionComplete = async (
        actionProps: Action,
        characterId: string,
        targetId: string | null,
        attackRoll: number | null,
        damage: number | null,
    ) => {
        const character = characters.find((c) => c.id === characterId)
        const target = targetId ? characters.find((c) => c.id === targetId) : null

        if (!character) return

        // Create a new log entry
        const newLog: CombatLog = {
            id: `log-${Date.now()}`,
            round,
            turn: activeIndex + 1,
            characterId: character.id,
            characterName: character.name,
            action: actionProps.name,
            actionTiming: actionProps.timing as ActionTiming,
            target: target
                ? {
                    id: target.id,
                    name: target.name,
                }
                : undefined,
            details: attackRoll ? `Rolou ${attackRoll} para acertar contra CA ${target?.ac}` : "Habilidade usada", result: target && attackRoll ? (attackRoll >= target.ac ? "hit" : "miss") : "other",
            damage: damage || undefined,
            timestamp: new Date().toISOString(),
        }

        setLogs([...logs, newLog]);
        await updateCombatLog(combatSession.id, [...logs, newLog])

        // Apply damage if hit
        let updatedCharacters: CombatCharacter[] = [];
        if (target && attackRoll && attackRoll >= target.ac && damage) {
            updatedCharacters = characters.map((c) => {
                if (c.id === target.id) {
                    const exceededDamage = Number(c.health.temporary ?? 0) - damage;
                    if (exceededDamage > 0) {
                        return {
                            ...c,
                            health: {
                                current: c.health.current,
                                max: c.health.max,
                                temporary: exceededDamage,
                            },
                        }
                    } else {
                        return {
                            ...c,
                            health: {
                                max: c.health.max,
                                current: c.health.current + exceededDamage,
                                temporary: 0
                            },
                        }
                    }
                }
                return c
            })
        } else {
            updatedCharacters = characters;
        }

        // Update action usage for the character
        updatedCharacters = updatedCharacters.map((c) => {
            if (c.id === characterId) {
                // Find the action that was used
                const updatedChar = structuredClone(c);

                if (actionProps.timing === "action") {
                    updatedChar.actionsUsed = (updatedChar.actionsUsed || 0) + (actionProps.actions || 1)
                    if(updatedChar.energy){
                        updatedChar.energy.current -= actionProps.cost ? actionProps.cost : 0
                    }
                    updatedChar.actions = updatedChar.actions.map((action) => {
                        if (action.name === actionProps.name) {
                            return {
                                ...action,
                                currentUses: (action.currentUses || 0) + 1,
                            }
                        }
                        return action
                    })
                } else if (actionProps.timing === "bonus") {
                    updatedChar.bonusActionsUsed =(updatedChar.actionsUsed || 0) + (actionProps.actions || 1)
                    if(updatedChar.energy){
                        updatedChar.energy.current -= actionProps.cost ? actionProps.cost : 0
                    }
                    updatedChar.bonusActions = updatedChar.bonusActions.map((action) => {
                        if (action.name === actionProps.name) {
                            return {
                                ...action,
                                currentUses: (action.currentUses || 0) + 1,
                            }
                        }
                        return action
                    })
                } else if (actionProps.timing === "reaction") {
                    updatedChar.reactionsUsed = (updatedChar.actionsUsed || 0) + (actionProps.actions || 1)
                    if(updatedChar.energy){
                        updatedChar.energy.current -= actionProps.cost ? actionProps.cost : 0
                    }
                    updatedChar.reactions = updatedChar.reactions.map((action) => {
                        if (action.name === actionProps.name) {
                            return {
                                ...action,
                                currentUses: (action.currentUses || 0) + 1,
                            }
                        }
                        return action
                    })
                }

                return updatedChar
            }
            return c
        })

        setCharacters(updatedCharacters);
        await updateCombatCharacter(combatSession.id, updatedCharacters)

    }

    const adjustHealth = (characterId: string, amount: number) => {
        const updatedCharacters = characters.map((c) => {
            if (c.id === characterId) {
                return {
                    ...c,
                    health: {
                        ...c.health,
                        current: Math.min(c.health.max, Math.max(0, c.health.current + amount)),
                    },
                }
            }
            return c
        })
        if (amount !== 0) {
            const character = characters.find((c) => c.id === characterId)
            if (character) {
                const newLog: CombatLog = {
                    id: `log-${Date.now()}`,
                    round,
                    turn: activeIndex + 1,
                    characterId,
                    characterName: character.name,
                    action: amount > 0 ? "Cura" : "Dano",
                    details: `${amount > 0 ? "Curado" : "Tomou"} ${Math.abs(amount)} ${amount > 0 ? "pontos de vida" : "dano"}`,
                    result: "other",
                    healing: amount > 0 ? amount : undefined,
                    damage: amount < 0 ? Math.abs(amount) : undefined,
                    timestamp: new Date().toISOString(),
                }
                setLogs([...logs, newLog])
                updateCombatLog(combatSession.id, [...logs, newLog])
            }
        }

        setCharacters(updatedCharacters)
        updateCombatCharacter(combatSession.id, updatedCharacters)

    }
    const handleTemporaryHp = (characterId: string, amount: number) => {
        const updatedCharacters = characters.map((c) => {
            if (c.id === characterId && c.health) {
                return {
                    ...c,
                    health: {
                        ...c.health,
                        temporary: amount,
                    },
                }
            }
            return c
        })
        setCharacters(updatedCharacters);

        updateCombatCharacter(combatSession.id, updatedCharacters)
    }

    const handleChange = (characterId: string, amount: number) => {
        const updatedCharacters = characters.map((c) => {
            if (c.id === characterId && c.health) {
                return {
                    ...c,
                    health: {
                        ...c.health,
                        current: amount,
                    },
                }
            }
            return c
        })
        setCharacters(updatedCharacters);

        updateCombatCharacter(combatSession.id, updatedCharacters)
    }

    const adjustEnergy = async (characterId: string, amount: number) => {
        const updatedCharacters = characters.map((c) => {
            if (c.id === characterId && c.energy) {
                return {
                    ...c,
                    energy: {
                        ...c.energy,
                        current: Math.min(c.energy.max, Math.max(0, c.energy.current + amount)),
                    },
                }
            }
            return c
        })
        setCharacters(updatedCharacters)
        updateCombatCharacter(combatSession.id, updatedCharacters)
    }

    const adjustIntegrity = (characterId: string, amount: number) => {
        const character = characters.find((c) => c.id === characterId)
        if (!character || !character.integrity) return

        const oldValue = character.integrity.current
        const newValue = Math.min(character.integrity.max, Math.max(0, oldValue + amount))

        const updatedCharacters = characters.map((c) => {
            if (c.id === characterId) {
                return {
                    ...c,
                    integrity: {
                        ...c.integrity!,
                        current: newValue,
                    },
                }
            }
            return c
        })
        setCharacters(updatedCharacters)

        // Log integrity change
        if (amount !== 0) {
            const newLog: CombatLog = {
                id: `log-${Date.now()}-integrity`,
                round,
                turn: activeIndex + 1,
                characterId,
                characterName: character.name,
                action: "Integrity Change",
                details: `${amount > 0 ? "Gained" : "Lost"} ${Math.abs(amount)} integrity points`,
                result: "other",
                integrityChange: {
                    oldValue,
                    newValue,
                },
                timestamp: new Date().toISOString(),
            }
            setLogs([...logs, newLog])
            updateCombatLog(combatSession.id, [...logs, newLog])
        }

        updateCombatCharacter(combatSession.id, updatedCharacters)
    }

    const updateArmorClass = (characterId: string, newAC: number) => {
        const character = characters.find((c) => c.id === characterId)
        if (!character) return

        const oldAC = character.ac

        const updatedCharacters = characters.map((c) => {
            if (c.id === characterId) {
                return {
                    ...c,
                    ac: newAC,
                }
            }
            return c
        })
        setCharacters(updatedCharacters)

        // Log AC change
        const newLog: CombatLog = {
            id: `log-${Date.now()}-ac`,
            round,
            turn: activeIndex + 1,
            characterId,
            characterName: character.name,
            action: "Mudança de classe de armadura",
            details: `Classe de armadura alterada de ${oldAC} para ${newAC}`,
            result: "other",
            armorClassChange: {
                oldValue: oldAC,
                newValue: newAC,
            },
            timestamp: new Date().toISOString(),
        }
        setLogs([...logs, newLog])
        updateCombatCharacter(combatSession.id, updatedCharacters)
        updateCombatLog(combatSession.id, [...logs, newLog])

    }


    const addCondition = (characterId: string, condition: Condition) => {
        const character = characters.find((c) => c.id === characterId)
        if (!character) return

        // Check if condition already exists
        const existingCondition = character.conditions.find((c) => c.type === condition.type)
        if (existingCondition) {
            // Replace existing condition
            const updatedCharacters = characters.map((c) => {
                if (c.id === characterId) {
                    return {
                        ...c,
                        conditions: c.conditions.map((cond) => (cond.type === condition.type ? condition : cond)),
                    }
                }
                return c
            })
            setCharacters(updatedCharacters)
            updateCombatCharacter(combatSession.id, updatedCharacters)

        } else {
            // Add new condition
            const updatedCharacters = characters.map((c) => {
                if (c.id === characterId) {
                    return {
                        ...c,
                        conditions: [...c.conditions, condition],
                    }
                }
                return c
            })
            setCharacters(updatedCharacters)
            updateCombatCharacter(combatSession.id, updatedCharacters)

        }

        // Log condition addition
        const conditionLabel = CONDITIONS[condition.type]
        const newLog: CombatLog = {
            id: `log-${Date.now()}-condition`,
            round,
            turn: activeIndex + 1,
            characterId,
            characterName: character.name,
            action: "Condição aplicada",
            details: `Aplicou a condição "${conditionLabel}"${condition.duration ? ` para ${condition.duration} rodadas` : ""}${condition.source ? ` de ${condition.source}` : ""}`,
            result: "other",
            conditionChange: {
                added: [condition.type],
            },
            timestamp: new Date().toISOString(),
        }
        setLogs([...logs, newLog])

        updateCombatLog(combatSession.id, [...logs, newLog])
    }


    const removeCondition = (characterId: string, conditionType: ConditionType) => {
        const character = characters.find((c) => c.id === characterId)
        if (!character) return

        const conditionExists = character.conditions.some((c) => c.type === conditionType)
        if (!conditionExists) return

        const updatedCharacters = characters.map((c) => {
            if (c.id === characterId) {
                return {
                    ...c,
                    conditions: c.conditions.filter((cond) => cond.type !== conditionType),
                }
            }
            return c
        })
        setCharacters(updatedCharacters)

        // Log condition removal
        const conditionLabel = CONDITIONS[conditionType]
        const newLog: CombatLog = {
            id: `log-${Date.now()}-condition-remove`,
            round,
            turn: activeIndex + 1,
            characterId,
            characterName: character.name,
            action: "Condition Removed",
            details: `Removed "${conditionLabel}" condition`,
            result: "other",
            conditionChange: {
                removed: [conditionType],
            },
            timestamp: new Date().toISOString(),
        }
        setLogs([...logs, newLog])

        updateCombatCharacter(combatSession.id, updatedCharacters)
        updateCombatLog(combatSession.id, [...logs, newLog])
    }



    const undoLastAction = () => {
        if (logs.length === 0) return

        const lastLog = logs[logs.length - 1]

        // Remove the log
        setLogs(logs.slice(0, -1))

        // Undo damage if applicable
        if (lastLog.target && lastLog.damage) {
            const updatedCharacters = characters.map((c) => {
                if (c.id === lastLog.target?.id) {
                    return {
                        ...c,
                        health: {
                            ...c.health,
                            current: Math.min(c.health.max, c.health.current + (lastLog.damage || 0)),
                        },
                    }
                }
                return c
            })
            setCharacters(updatedCharacters)
        }

        // Undo action usage
        const updatedCharacters = characters.map((c) => {
            if (c.id === lastLog.characterId) {
                const updatedChar = { ...c }

                if (lastLog.actionTiming === "action") {
                    updatedChar.actionsUsed = Math.max(0, (updatedChar.actionsUsed || 0) - 1)
                    updatedChar.actions = updatedChar.actions.map((action) => {
                        if (action.name === lastLog.action) {
                            return {
                                ...action,
                                currentUses: Math.max(0, (action.currentUses || 0) - 1),
                            }
                        }
                        return action
                    })
                } else if (lastLog.actionTiming === "bonus") {
                    updatedChar.bonusActionsUsed = Math.max(0, (updatedChar.bonusActionsUsed || 0) - 1)
                    updatedChar.bonusActions = updatedChar.bonusActions.map((action) => {
                        if (action.name === lastLog.action) {
                            return {
                                ...action,
                                currentUses: Math.max(0, (action.currentUses || 0) - 1),
                            }
                        }
                        return action
                    })
                } else if (lastLog.actionTiming === "reaction") {
                    updatedChar.reactionsUsed = Math.max(0, (updatedChar.reactionsUsed || 0) - 1)
                    updatedChar.reactions = updatedChar.reactions.map((action) => {
                        if (action.name === lastLog.action) {
                            return {
                                ...action,
                                currentUses: Math.max(0, (action.currentUses || 0) - 1),
                            }
                        }
                        return action
                    })
                }

                return updatedChar
            }
            return c
        })

        setCharacters(updatedCharacters)
        updateCombatCharacter(combatSession.id, updatedCharacters)
        updateCombatLog(combatSession.id, logs.slice(0, -1))
    }

    const copyIniciative = () => {
        let string = "";

        characters.forEach((c) => {
            string = string.concat(`[${c.name}] ${c.initiativeRoll} \n`)
        });
        navigator.clipboard.writeText(string).then(() => {
            toast("Copiado com sucesso", {
                description: new Date().toLocaleDateString(),
            })
        }).catch(err => {
            toast("Erro ao copiar", {
                description: JSON.stringify(err),
            })
        });

    }

    const addTemporaryHP = (characterId: string, amount: number) => {
        const updatedCharacters = characters.map((c) => {
            if (c.id === characterId) {
                // Only replace temporary HP if the new amount is higher
                const currentTempHP = c.health.temporary || 0
                const newTempHP = amount > currentTempHP ? amount : currentTempHP

                return {
                    ...c,
                    health: {
                        ...c.health,
                        temporary: newTempHP,
                    },
                }
            }
            return c
        })
        setCharacters(updatedCharacters)
        updateCombatCharacter(combatSession.id, updatedCharacters)

        // Log the temporary HP addition
        const character = characters.find((c) => c.id === characterId)
        if (character) {
            const currentTempHP = character.health.temporary || 0
            const newLog: CombatLog = {
                id: `log-${Date.now()}`,
                round,
                turn: activeIndex + 1,
                characterId,
                characterName: character.name,
                action: "Temporary HP",
                details:
                    amount > currentTempHP
                        ? `Gained ${amount} pontos de vida temporários`
                        : `Tentou adicionar ${amount} pontos de vida temporários (não maior que ${currentTempHP} atual)`,
                result: "other",
                temporaryHP: amount > currentTempHP ? amount : undefined,
                timestamp: new Date().toISOString(),
            }
            setLogs([...logs, newLog]);
            updateCombatLog(combatSession.id, [...logs, newLog])
        }
    }
    const handleAddCharacterFromDialog = async (newCharacter: CombatCharacter) => {
        // Add the character to the combat
        setCharacters([...characters, newCharacter].sort((a, b) => b.initiativeRoll - a.initiativeRoll))
        updateCombatCharacter(combatSession.id, [...characters, newCharacter].sort((a, b) => b.initiativeRoll - a.initiativeRoll))
        // Log the addition
        const newLog: CombatLog = {
            id: `log-${Date.now()}-add-character`,
            round,
            turn: activeIndex + 1,
            characterId: newCharacter.id,
            characterName: newCharacter.name,
            action: "Joined Combat",
            details: `Added to combat with initiative ${newCharacter.initiativeRoll}`,
            result: "other",
            timestamp: new Date().toISOString(),
        }
        setLogs([...logs, newLog])
        await updateCombatLog(combatSession.id, [...logs, newLog])
    }

    // Then, add a function to handle removing a character
    const removeCharacterFromCombat = async (characterId: string) => {
        // Find the character
        const character = characters.find((c) => c.id === characterId)
        if (!character) return

        // Remove the character
        setCharacters(characters.filter((c) => c.id !== characterId))
        await updateCombatCharacter(combatSession.id, characters.filter((c) => c.id !== characterId))
        // Log the removal
        const newLog: CombatLog = {
            id: `log-${Date.now()}-remove-character`,
            round,
            turn: activeIndex + 1,
            characterId: "system",
            characterName: "System",
            action: "Character Removed",
            details: `${character.name} was removed from combat`,
            result: "other",
            timestamp: new Date().toISOString(),
        }
        setLogs([...logs, newLog])
        await updateCombatLog(combatSession.id, [...logs, newLog])


        // If the active character was removed, move to the next character
        if (characterId === activeCharacter.id) {
            // If this was the last character, go back to the first
            if (activeIndex >= characters.length - 1) {
                setActiveIndex(0)
            }
            // Otherwise, the activeIndex stays the same but points to the next character
        }

        // If the selected character was removed, clear the selection
        if (characterId === selectedCharacterId) {
            setSelectedCharacterId(null)
        }

    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                    <Link href="/combat">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Voltar</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">{combatSession.name}</h1>
                    <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                            Rodada {round}
                        </Badge>
                        <Badge>
                            Turno {activeIndex + 1}/{characters.length}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center">
                                <span>
                                    {selectedCharacterId && selectedCharacterId !== activeCharacter.id
                                        ? "Selecionar personagem"
                                        : "Personagem ativo"}
                                </span>
                                <div className="flex gap-2">
                                    {selectedCharacterId && selectedCharacterId !== activeCharacter.id && (
                                        <Button variant="outline" onClick={() => setSelectedCharacterId(null)}>
                                            Retornar para ativo
                                        </Button>
                                    )}
                                    <Button onClick={nextTurn}>
                                        <SkipForward className="mr-2 h-4 w-4" /> Próximo turno
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CharacterActionPanel
                                onAddCondition={addCondition}
                                onRemoveCondition={removeCondition}
                                onUpdateAC={updateArmorClass}
                                onAddTempHP={addTemporaryHP}
                                onAdjustIntegrity={adjustIntegrity}
                                onHandleAddTempHP={handleTemporaryHp}
                                character={selectedCharacter}
                                allCharacters={characters}
                                isActive={selectedCharacter?.id === activeCharacter.id}
                                onActionComplete={handleActionComplete}
                            />
                        </CardContent>
                    </Card>
                    <CombatSessionLogs logs={logs} undoLastAction={undoLastAction} />
                </div>

                <div className="space-y-68">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Ordem de Iniciativa
                                <Button size="icon" variant="ghost" onClick={copyIniciative}>
                                    <ClipboardCopy className="w-5 h-5" />
                                </Button>
                            </CardTitle>
                            <CardDescription>Ordem de turno atual</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {characters.map((character, index) => (
                                    <CombatSessionCharacterCard
                                        removeCharacterFromCombat={removeCharacterFromCombat}
                                        addTemporaryHP={addTemporaryHP}
                                        adjustIntegrity={adjustIntegrity}
                                        addCondition={addCondition}
                                        removeCondition={removeCondition}
                                        updateArmorClass={updateArmorClass}
                                        key={character.id}
                                        activeIndex={activeIndex}
                                        adjustEnergy={adjustEnergy}
                                        adjustHealth={adjustHealth}
                                        character={character}
                                        handleChange={handleChange}
                                        index={index}
                                        setSelectedCharacterId={setSelectedCharacterId}
                                        selectedCharacterId={selectedCharacterId}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Ações rápidas</CardTitle>
                            <CardDescription>Ações de combate comuns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Roll Dice</h3>
                                    <DiceRoller />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium mb-2">Adicionar personagem ao combate</h3>
                                    <AddCharacterDialog
                                        availableCharacters={availableCharacters}
                                        onAddCharacter={handleAddCharacterFromDialog}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

