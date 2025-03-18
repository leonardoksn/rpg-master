"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Edit, Plus, Save, Trash2, X } from "lucide-react"
import { useState } from "react"

interface ActionManagerProps {
    actions: Action[]
    actionType: ActionTiming
    onChange: (actions: Action[]) => void
}

export function ActionManager({ actions, actionType, onChange }: ActionManagerProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    // Form state for editing or creating a new action
    const [formState, setFormState] = useState<Partial<Action>>({
        name: "",
        description: "",
        actionType: "ability",
        timing: actionType,
        usesPerRound: 1,
        currentUses: 0,
        attackBonus: undefined,
        damageFormula: undefined,
        range: undefined,
    })

    // Create a new action
    const handleAddAction = () => {
        const newAction: Action = {
            id: `${actionType}-${Date.now()}`,
            name: formState.name || `New ${actionType}`,
            description: formState.description || "",
            actionType: (formState.actionType as ActionType) || "ability",
            timing: actionType,
            usesPerRound: formState.usesPerRound || 1,
            currentUses: 0,
        }

        if (formState.attackBonus !== undefined) {
            newAction.attackBonus = formState.attackBonus
        }

        if (formState.damageFormula) {
            newAction.damageFormula = formState.damageFormula
        }

        if (formState.range) {
            newAction.range = formState.range
        }

        onChange([...actions, newAction])

        // Reset form
        setFormState({
            name: "",
            description: "",
            actionType: "ability",
            timing: actionType,
            usesPerRound: 1,
            currentUses: 0,
            attackBonus: undefined,
            damageFormula: undefined,
            range: undefined,
        })

        setEditingId(null)
    }

    // Update an existing action
    const handleUpdateAction = (id: string) => {
        const updatedActions = actions.map((action) => {
            if (action.id === id) {
                return {
                    ...action,
                    name: formState.name || action.name,
                    description: formState.description || action.description,
                    actionType: (formState.actionType as ActionType) || action.actionType,
                    usesPerRound: formState.usesPerRound || action.usesPerRound,
                    attackBonus: formState.attackBonus,
                    damageFormula: formState.damageFormula,
                    range: formState.range,
                }
            }
            return action
        })

        onChange(updatedActions)
        setEditingId(null)
    }

    // Delete an action
    const handleDeleteAction = (id: string) => {
        onChange(actions.filter((action) => action.id !== id))
    }

    // Start editing an action
    const handleEditAction = (action: Action) => {
        setFormState({
            name: action.name,
            description: action.description,
            actionType: action.actionType,
            timing: action.timing,
            usesPerRound: action.usesPerRound,
            attackBonus: action.attackBonus,
            damageFormula: action.damageFormula,
            range: action.range,
        })
        setEditingId(action.id)
        setExpandedId(action.id)
    }

    // Toggle expanded view for an action
    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
    }

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null)
        setFormState({
            name: "",
            description: "",
            actionType: "ability",
            timing: actionType,
            usesPerRound: 1,
            currentUses: 0,
            attackBonus: undefined,
            damageFormula: undefined,
            range: undefined,
        })
    }

    const actionTypeLabel = actionType === "action" ? "Ação" : actionType === "bonus" ? "Ação Bônus" : "Reação"

    return (
        <div className="space-y-4">
            {actions.length === 0 ? (
                <div className="text-center p-4 border rounded-md text-muted-foreground">Nenhum {actionType} adicionado ainda</div>
            ) : (
                <div className="space-y-2">
                    {actions.map((action) => (
                        <Card key={action.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div
                                    className={`p-3 border-b flex justify-between items-center cursor-pointer ${expandedId === action.id ? "bg-accent/50" : ""
                                        }`}
                                    onClick={() => toggleExpand(action.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        {expandedId === action.id ? (
                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="font-medium">{action.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{action.actionType}</Badge>
                                        {action.usesPerRound && <Badge variant="secondary">Uses: {action.usesPerRound}/round</Badge>}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditAction(action)
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteAction(action.id)
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </div>

                                {expandedId === action.id && editingId !== action.id && (
                                    <div className="p-3 space-y-2">
                                        <p className="text-sm text-muted-foreground">{action.description}</p>

                                        {(action.attackBonus !== undefined || action.damageFormula || action.range) && (
                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                {action.attackBonus !== undefined && (
                                                    <div className="text-sm">
                                                        <span className="font-medium">Attack:</span> +{action.attackBonus}
                                                    </div>
                                                )}
                                                {action.damageFormula && (
                                                    <div className="text-sm">
                                                        <span className="font-medium">Damage:</span> {action.damageFormula}
                                                    </div>
                                                )}
                                                {action.range && (
                                                    <div className="text-sm">
                                                        <span className="font-medium">Range:</span> {action.range}m
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {editingId === action.id && (
                                    <div className="p-3 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-name-${action.id}`}>Name</Label>
                                                <Input
                                                    id={`edit-name-${action.id}`}
                                                    value={formState.name}
                                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                    placeholder="Action name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-type-${action.id}`}>Type</Label>
                                                <Select
                                                    value={formState.actionType}
                                                    onValueChange={(value) => setFormState({ ...formState, actionType: value as ActionType })}
                                                >
                                                    <SelectTrigger id={`edit-type-${action.id}`}>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="attack">Attack</SelectItem>
                                                        <SelectItem value="spell">Spell</SelectItem>
                                                        <SelectItem value="ability">Ability</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`edit-desc-${action.id}`}>Description</Label>
                                            <Textarea
                                                id={`edit-desc-${action.id}`}
                                                value={formState.description}
                                                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                                                placeholder="Describe what this action does"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-attack-${action.id}`}>Attack Bonus</Label>
                                                <Input
                                                    id={`edit-attack-${action.id}`}
                                                    type="number"
                                                    value={formState.attackBonus === undefined ? "" : formState.attackBonus}
                                                    onChange={(e) =>
                                                        setFormState({
                                                            ...formState,
                                                            attackBonus: e.target.value === "" ? undefined : Number.parseInt(e.target.value),
                                                        })
                                                    }
                                                    placeholder="+0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-damage-${action.id}`}>Damage Formula</Label>
                                                <Input
                                                    id={`edit-damage-${action.id}`}
                                                    value={formState.damageFormula || ""}
                                                    onChange={(e) => setFormState({ ...formState, damageFormula: e.target.value })}
                                                    placeholder="e.g. 2d6+3"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-range-${action.id}`}>Range (meters)</Label>
                                                <Input
                                                    id={`edit-range-${action.id}`}
                                                    value={formState.range || ""}
                                                    onChange={(e) => setFormState({ ...formState, range: e.target.value })}
                                                    placeholder="e.g. 9"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`edit-uses-${action.id}`}>Uses Per Round</Label>
                                                <Input
                                                    id={`edit-uses-${action.id}`}
                                                    type="number"
                                                    min="1"
                                                    value={formState.usesPerRound || 1}
                                                    onChange={(e) =>
                                                        setFormState({
                                                            ...formState,
                                                            usesPerRound: Number.parseInt(e.target.value),
                                                        })
                                                    }
                                                    placeholder="1"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={handleCancelEdit}>
                                                <X className="mr-2 h-4 w-4" />
                                                Cancel
                                            </Button>
                                            <Button onClick={() => handleUpdateAction(action.id)}>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {editingId === "new" ? (
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <h3 className="font-medium">New {actionTypeLabel}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-name">Name</Label>
                                <Input
                                    id="new-name"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    placeholder={`${actionTypeLabel} name`}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-type">Type</Label>
                                <Select
                                    value={formState.actionType as string}
                                    onValueChange={(value) => setFormState({ ...formState, actionType: value as ActionType })}
                                >
                                    <SelectTrigger id="new-type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="attack">Attack</SelectItem>
                                        <SelectItem value="spell">Spell</SelectItem>
                                        <SelectItem value="ability">Ability</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-desc">Description</Label>
                            <Textarea
                                id="new-desc"
                                value={formState.description}
                                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                                placeholder={`Describe what this ${actionType} does`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-attack">Attack Bonus</Label>
                                <Input
                                    id="new-attack"
                                    type="number"
                                    value={formState.attackBonus === undefined ? "" : formState.attackBonus}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            attackBonus: e.target.value === "" ? undefined : Number.parseInt(e.target.value),
                                        })
                                    }
                                    placeholder="+0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-damage">Damage Formula</Label>
                                <Input
                                    id="new-damage"
                                    value={formState.damageFormula || ""}
                                    onChange={(e) => setFormState({ ...formState, damageFormula: e.target.value })}
                                    placeholder="e.g. 2d6+3"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-range">Range (meters)</Label>
                                <Input
                                    id="new-range"
                                    value={formState.range || ""}
                                    onChange={(e) => setFormState({ ...formState, range: e.target.value })}
                                    placeholder="e.g. 9"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-uses">Uses Per Round</Label>
                                <Input
                                    id="new-uses"
                                    type="number"
                                    min="1"
                                    value={formState.usesPerRound}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            usesPerRound: Number.parseInt(e.target.value),
                                        })
                                    }
                                    placeholder="1"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={handleCancelEdit}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleAddAction}>
                                <Save className="mr-2 h-4 w-4" />
                                Add {actionTypeLabel}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        setEditingId("new")
                        setFormState({
                            name: "",
                            description: "",
                            actionType: "ability",
                            timing: actionType,
                            usesPerRound: 1,
                            currentUses: 0,
                        })
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add {actionTypeLabel}
                </Button>
            )}
        </div>
    )
}

