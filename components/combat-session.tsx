"use client"

import { updateActiveCharacterIndex } from "@/actions/combat/update-active-character-index"
import { updateCombatCharacter } from "@/actions/combat/update-combat-character"
import { updateCombatLog } from "@/actions/combat/update-combat-character copy"
import { updateRound } from "@/actions/combat/update-round"
import { CharacterActionPanel } from "@/components/character-action-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, ClipboardCopy, Heart, MinusCircle, PlusCircle, SkipForward, Undo, UserPlus, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { DiceRoller } from "./dice-roller"

export default function CombatSession({ combatSession }: { combatSession: CombatSession }) {
    // In a real app, we would fetch the combat session by ID

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
            const resetCharacters = characters.map((char) => ({
                ...char,
                actionsUsed: 0,
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
            }))
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
        characterId: string,
        actionName: string,
        actionTiming: string,
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
            action: actionName,
            actionTiming: actionTiming as ActionTiming,
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
                    console.log(c)
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

                if (actionTiming === "action") {
                    updatedChar.actionsUsed = (updatedChar.actionsUsed || 0) + 1
                    updatedChar.actions = updatedChar.actions.map((action) => {
                        if (action.name === actionName) {
                            return {
                                ...action,
                                currentUses: (action.currentUses || 0) + 1,
                            }
                        }
                        return action
                    })
                } else if (actionTiming === "bonus") {
                    updatedChar.bonusActionsUsed = (updatedChar.bonusActionsUsed || 0) + 1
                    updatedChar.bonusActions = updatedChar.bonusActions.map((action) => {
                        if (action.name === actionName) {
                            return {
                                ...action,
                                currentUses: (action.currentUses || 0) + 1,
                            }
                        }
                        return action
                    })
                } else if (actionTiming === "reaction") {
                    updatedChar.reactionsUsed = (updatedChar.reactionsUsed || 0) + 1
                    updatedChar.reactions = updatedChar.reactions.map((action) => {
                        if (action.name === actionName) {
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
                                onHandleAddTempHP={handleTemporaryHp}
                                character={selectedCharacter}
                                allCharacters={characters}
                                isActive={selectedCharacter?.id === activeCharacter.id}
                                onActionComplete={handleActionComplete}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Registro de Combate</CardTitle>
                            <CardDescription>Ações e eventos recentes</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[300px] overflow-y-auto">
                            {logs.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">Nenhuma ação tomada ainda</p>
                            ) : (
                                <div className="space-y-2">
                                    {logs
                                        .slice()
                                        .reverse()
                                        .map((log) => (
                                            <div key={log.id} className="p-2 border rounded-md">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">
                                                        Rodada {log.round}, Turno {log.turn}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {log.actionTiming && <Badge variant="outline">{log.actionTiming}</Badge>}
                                                        <Badge variant={log.result === "hit" ? "default" : "secondary"}>{log.result}</Badge>
                                                    </div>
                                                </div>
                                                <p className="mt-1">
                                                    <span className="font-medium">{log.characterName}</span> usou{" "}
                                                    <span className="italic">{log.action}</span>
                                                    {log.target && (
                                                        <>
                                                            {" "}
                                                            on <span className="font-medium">{log.target.name}</span>
                                                        </>
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{log.details}</p>
                                                {log.damage && <p className="text-sm font-medium text-red-500">Dano: {log.damage}</p>}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" disabled={logs.length === 0} onClick={undoLastAction}>
                                <Undo className="mr-2 h-4 w-4" /> Desfazer última ação
                            </Button>
                        </CardFooter>
                    </Card>
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
                                    <div
                                        key={character.id}
                                        className={`p-2 border rounded-md flex justify-between items-center cursor-pointer ${index === activeIndex ? "bg-accent" : ""
                                            } ${character.id === selectedCharacterId ? "border-primary" : ""}`}
                                        onClick={() => setSelectedCharacterId(character.id)}
                                    >
                                        <div className="flex items-center">
                                            {index === activeIndex && <ArrowRight className="mr-2 h-4 w-4 text-primary" />}
                                            <div>
                                                <div className="font-medium">{character.name}</div>
                                                <div className="text-xs text-muted-foreground">Initiativa: {character.initiativeRoll}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        adjustHealth(character.id, -1);
                                                    }}
                                                >
                                                    <MinusCircle className="h-3 w-3 text-red-500" />
                                                </Button>
                                                <div className="w-18 text-center text-xs flex items-center justify-center">
                                                    <Heart className="inline-block h-3 w-3 mr-1" />
                                                    <input
                                                        type="number"
                                                        className="w-12 text-center text-xs border rounded"
                                                        value={character.health.current}
                                                        onChange={(e) => handleChange(character.id, Number(e.currentTarget.value))}
                                                        min={0}
                                                        max={character.health.max}
                                                    />
                                                    <span className="ml-1">/{character.health.max}  </span>{
                                                        !!character.health.temporary &&
                                                        <span className="ml-1 text-blue-500">+({character.health.temporary})</span>
                                                    }
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        adjustHealth(character.id, 1);
                                                    }}
                                                >
                                                    <PlusCircle className="h-3 w-3 text-green-500" />
                                                </Button>
                                            </div>
                                            {character.energy && (
                                                <div className="flex items-center space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            adjustEnergy(character.id, -1)
                                                        }}
                                                    >
                                                        <MinusCircle className="h-3 w-3 text-blue-500" />
                                                    </Button>
                                                    <div className="w-16 text-center text-xs">
                                                        <Zap className="inline-block h-3 w-3 mr-1" />
                                                        {character.energy.current}/{character.energy.max}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            adjustEnergy(character.id, 1)
                                                        }}
                                                    >
                                                        <PlusCircle className="h-3 w-3 text-yellow-500" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
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
                                    <h3 className="text-sm font-medium mb-2">Rolar Dados</h3>
                                    <DiceRoller />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium mb-2">Adicione personagem ao combate</h3>
                                    <div className="flex space-x-2">
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select character" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">Criar novo</SelectItem>
                                                {/* List available characters not in combat */}
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Adicionar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

