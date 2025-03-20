"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Edit, Plus, Save, Trash2, X } from "lucide-react"
import { useState } from "react"

interface PassiveAbilityManagerProps {
  passives: PassiveAbility[]
  onChange: (passives: PassiveAbility[]) => void
}

export function PassiveAbilityManager({ passives, onChange }: PassiveAbilityManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Form state for editing or creating a new passive ability
  const [formState, setFormState] = useState<Partial<PassiveAbility>>({
    name: "",
    description: "",
    usesPerDay: undefined,
    currentUses: 0,
  })

  // Create a new passive ability
  const handleAddPassive = () => {
    const newPassive: PassiveAbility = {
      id: `passive-${Date.now()}`,
      name: formState.name || "New Passive Ability",
      description: formState.description || "",
      usesPerDay: formState.usesPerDay,
      currentUses: 0,
    }

    onChange([...passives, newPassive])

    // Reset form
    setFormState({
      name: "",
      description: "",
      usesPerDay: undefined,
      currentUses: 0,
    })

    setEditingId(null)
  }

  // Update an existing passive ability
  const handleUpdatePassive = (id: string) => {
    const updatedPassives = passives.map((passive) => {
      if (passive.id === id) {
        return {
          ...passive,
          name: formState.name || passive.name,
          description: formState.description || passive.description,
          usesPerDay: formState.usesPerDay,
        }
      }
      return passive
    })

    onChange(updatedPassives)
    setEditingId(null)
  }

  // Delete a passive ability
  const handleDeletePassive = (id: string) => {
    onChange(passives.filter((passive) => passive.id !== id))
  }

  // Start editing a passive ability
  const handleEditPassive = (passive: PassiveAbility) => {
    setFormState({
      name: passive.name,
      description: passive.description,
      usesPerDay: passive.usesPerDay,
    })
    setEditingId(passive.id)
    setExpandedId(passive.id)
  }

  // Toggle expanded view for a passive ability
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setFormState({
      name: "",
      description: "",
      usesPerDay: undefined,
      currentUses: 0,
    })
  }

  return (
    <div className="space-y-4">
      {passives.length === 0 ? (
        <div className="text-center p-4 border rounded-md text-muted-foreground">Nenhuma habilidade passiva adicionada ainda</div>
      ) : (
        <div className="space-y-2">
          {passives.map((passive) => (
            <Card key={passive.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className={`p-3 border-b flex justify-between items-center cursor-pointer ${expandedId === passive.id ? "bg-accent/50" : ""
                    }`}
                  onClick={() => toggleExpand(passive.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedId === passive.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{passive.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passive.usesPerDay !== undefined && (
                      <Badge variant="secondary">Uses: {passive.usesPerDay}/day</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditPassive(passive)
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
                        handleDeletePassive(passive.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>

                {expandedId === passive.id && editingId !== passive.id && (
                  <div className="p-3">
                    <p className="text-sm text-muted-foreground">{passive.description}</p>
                  </div>
                )}

                {editingId === passive.id && (
                  <div className="p-3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edit-name-${passive.id}`}>Name</Label>
                        <Input
                          id={`edit-name-${passive.id}`}
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="Passive ability name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-uses-${passive.id}`}>Uses Per Day</Label>
                        <Input
                          id={`edit-uses-${passive.id}`}
                          type="number"
                          min="0"
                          value={formState.usesPerDay === undefined ? "" : formState.usesPerDay}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              usesPerDay: e.target.value === "" ? undefined : Number.parseInt(e.target.value),
                            })
                          }
                          placeholder="Leave empty for unlimited"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`edit-desc-${passive.id}`}>Description</Label>
                      <Textarea
                        id={`edit-desc-${passive.id}`}
                        value={formState.description}
                        onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                        placeholder="Describe what this passive ability does"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={() => handleUpdatePassive(passive.id)}>
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
            <h3 className="font-medium">Nova habilidade passiva</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-passive-name">Nome</Label>
                <Input
                  id="new-passive-name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Nome da habilidade passiva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-passive-uses">Usos por dia</Label>
                <Input
                  id="new-passive-uses"
                  type="number"
                  min="0"
                  value={formState.usesPerDay === undefined ? "" : formState.usesPerDay}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      usesPerDay: e.target.value === "" ? undefined : Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="Deixe em branco para ilimitado"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-passive-desc">Descrição</Label>
              <Textarea
                id="new-passive-desc"
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                placeholder="Descreva o que essa habilidade passiva faz"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleAddPassive}>
                <Save className="mr-2 h-4 w-4" />
                Adicionar habilidade passiva
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
              usesPerDay: undefined,
              currentUses: 0,
            })
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar habilidade passiva
        </Button>
      )}
    </div>
  )
}

