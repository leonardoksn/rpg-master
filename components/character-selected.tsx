"use client"

import type React from "react"

import { updateCharacter } from "@/actions/characters/update-character"
import { ActionManager } from "@/components/action-manager"
import { PassiveAbilityManager } from "@/components/passive-ability-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { characterSizes } from "@/lib/data"
import { attributes, saves, skills } from "@/lib/expertise"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CharacterSelected({ character, id }: { character: ICharacterData, id: string }) {
    const [characterType, setCharacterType] = useState<CharacterType>(character.type)
    const [characterSize, setCharacterSize] = useState<CharacterSize>(character.size)
    const [attributesSaves, setAttributesSaves] = useState<{
        attributes: ICharacterData["attributes"]
        saves: ICharacterData["saves"]
        others: ICharacterData["otherStats"]
    }>({
        attributes: character.attributes,
        saves: character.saves,
        others: character.otherStats
    })

    const router = useRouter();
    // State for actions, bonus actions, reactions, and passives
    const [actions, setActions] = useState<Action[]>(character.actions)

    const [bonusActions, setBonusActions] = useState<Action[]>(character.bonusActions)

    const [reactions, setReactions] = useState<Action[]>(character.reactions)

    const [passives, setPassives] = useState<PassiveAbility[]>(character.passives)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const skillsData: ICharacterData["skills"] = {};
        skills.forEach((skill) => {
            skillsData[skill.value] = {
                label: skill.label,
                modifier: parseInt(formData.get(`skill-${skill.value.toLowerCase()}-mod`) as string) || 0,
                name: skill.label,
                hasAdvantage: formData.get(`skill-adv-${skill.value.toLowerCase()}`) === "on",
            };
        });
        // Basic character data
        const data: ICharacterData = {
            name: formData.get("name") as string,
            type: characterType,
            integrity: parseInt(formData.get("integrity") as string) || 0,
            class: formData.get("class") as string,
            level: parseInt(formData.get("level") as string) || 1,
            maxHp: parseInt(formData.get("maxHp") as string),
            maxEp: parseInt(formData.get("maxEp") as string) || 0,
            ac: parseInt(formData.get("ac") as string),
            size: characterSize,
            movement: parseInt(formData.get("movement") as string) || 9,
            actionsPerTurn: parseInt(formData.get("actionsPerTurn") as string) || 1,
            notes: formData.get("notes") as string,
            skills: skillsData,
            actions: actions,
            bonusActions: bonusActions,
            reactions: reactions,
            passives: passives,
            attributes: attributesSaves.attributes,
            saves: attributesSaves.saves,
            otherStats: attributesSaves.others
        };
        // Collect other stats

        try {
            // Call the createCharacter action with the collected data
            await updateCharacter(id, data);
            router.push("/characters");
        } catch (error) {
            console.error("Error creating character:", error);
            // Here you could add error handling, like showing a toast notification
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                    <Link href="/characters">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Voltar</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">{character.name}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações básicas</CardTitle>
                            <CardDescription>Verifique os detalhes básicos do personagem</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome do personagem</Label>
                                    <Input id="name" name="name" defaultValue={character.name} placeholder="Digite o nome do personagem" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo de personagem</Label>
                                    <Select
                                        defaultValue={characterType}
                                        onValueChange={(value) => setCharacterType(value as CharacterType)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PC">Personagem do jogador</SelectItem>
                                            <SelectItem value="NPC">Personagem não jogável</SelectItem>
                                            <SelectItem value="Creature">Criatura</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Classe</Label>
                                    <Input defaultValue={character.class} id="class" name="class" placeholder="Digite a classe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level" defaultValue={character.level}>Nível</Label>
                                    <Input id="level" type="number" name="level" min="1" max="20" placeholder="1" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxHp" >HP máximo</Label>
                                    <Input id="maxHp" defaultValue={character.maxHp} name="maxHp" type="number" min="1" placeholder="Insira HP máximo" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="integrity">Integridade na alma</Label>
                                    <Input id="integrity" name="integrity" type="number" defaultValue={character.integrity} min="1" placeholder="Insira a integridade" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxEp" >PE máximo</Label>
                                    <Input id="maxEp" defaultValue={character.maxEp} name="maxEp" type="number" min="0" placeholder="Insira o PE máximo" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ac">Classe de Armadura</Label>
                                    <Input defaultValue={character.ac} id="ac" type="number" name="ac" min="1" placeholder="Insira a CA" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="size">Tamanho</Label>
                                    <Select value={characterSize} onValueChange={(e) => setCharacterSize(e as CharacterSize)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tamanho" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {characterSizes.map((size) => (
                                                <SelectItem key={size} value={size}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="movement">Movimento (metros/turno)</Label>
                                    <Input id="movement" defaultValue={character.movement} type="number" min="0" placeholder="9" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="actionsPerTurn">Ações por turno</Label>
                                    <Input id="actionsPerTurn" name="actionsPerTurn" defaultValue={character.actionsPerTurn} type="number" min="1" placeholder="1" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas</Label>
                                <Textarea id="notes" defaultValue={character.notes} placeholder="Enter any additional notes about this character" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Atributos e Salvamentos</CardTitle>
                            <CardDescription>Defina os atributos e testes de resistência do personagem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="attributes">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="attributes">Atributos</TabsTrigger>
                                    <TabsTrigger value="saves">Testes de resistência</TabsTrigger>
                                    <TabsTrigger value="other">Outras estatísticas</TabsTrigger>
                                </TabsList>
                                <TabsContent value="attributes">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        {attributes.map((stat) => (<div key={stat.value} className="space-y-2">
                                            <Label htmlFor={stat.value.toLowerCase()}>{stat.label}</Label>
                                            <Input name={stat.value}
                                                value={attributesSaves.attributes[stat.value]}
                                                onChange={(e) => {
                                                    setAttributesSaves({
                                                        ...attributesSaves,
                                                        attributes: {
                                                            ...attributesSaves.attributes,
                                                            [stat.value]: Number(e.currentTarget.value)
                                                        }
                                                    })
                                                }} id={stat.value.toLowerCase()} type="number" min="1" max="30" placeholder="10" required />
                                        </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="saves">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {saves.map((save) => (
                                            <div key={save.value} className="space-y-2">
                                                <Label htmlFor={`save-${save.value.toLowerCase()}`}>{save.label}</Label>
                                                <Input

                                                    value={attributesSaves.saves[save.value]}
                                                    onChange={(e) => {
                                                        setAttributesSaves({
                                                            ...attributesSaves,
                                                            saves: {
                                                                ...attributesSaves.saves,
                                                                [save.value]: Number(e.currentTarget.value)
                                                            }
                                                        })
                                                    }}
                                                    name={`save-${save.value.toLowerCase()}`} id={`save-${save.value.toLowerCase()}`} type="number" placeholder="0" />
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="other">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="initiative">Iniciativa</Label>
                                            <Input
                                                value={attributesSaves.others.initiative}
                                                onChange={(e) => {
                                                    setAttributesSaves({
                                                        ...attributesSaves,
                                                        others: {
                                                            ...attributesSaves.others,
                                                            initiative: Number(e.currentTarget.value)
                                                        }
                                                    })
                                                }}
                                                name="initiative" id="initiative" type="number" placeholder="0" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="attention">Atenção</Label>
                                            <Input
                                                value={attributesSaves.others.attention}
                                                onChange={(e) => {
                                                    setAttributesSaves({
                                                        ...attributesSaves,
                                                        others: {
                                                            ...attributesSaves.others,
                                                            attention: Number(e.currentTarget.value)
                                                        }
                                                    })
                                                }}
                                                name="attention" id="attention" type="number" placeholder="10" />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Habilidades</CardTitle>
                            <CardDescription>Adicione as habilidades e proficiências do personagem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {skills
                                    .map((skill) => (
                                        <div key={skill.value} className="flex items-center space-x-2 border p-3 rounded-md">
                                            <div className="flex-1">
                                                <Label htmlFor={`skill-${skill.value.toLowerCase()}-mod`}>{skill.label}</Label>
                                            </div>
                                            <Input defaultValue={character?.skills?.[skill?.value]?.modifier || 0} id={`skill-${skill.value.toLowerCase()}-mod`} name={`skill-${skill.value.toLowerCase()}-mod`} type="number" className="w-20" placeholder="0" />
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={character?.skills?.[skill?.value]?.hasAdvantage}
                                                    id={`skill-adv-${skill.value.toLowerCase()}`}
                                                    name={`skill-adv-${skill.value.toLowerCase()}`}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                                <Label htmlFor={`skill-adv-${skill.value.toLowerCase()}`} className="text-sm">
                                                    Vantagem
                                                </Label>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>


                    <Card>
                        <CardHeader>
                            <CardTitle>Ações e Habilidades</CardTitle>
                            <CardDescription>Adicione as ações e habilidades do personagem</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Tabs defaultValue="actions">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="actions">Ações</TabsTrigger>
                                    <TabsTrigger value="bonus-actions">Ações Bônus</TabsTrigger>
                                    <TabsTrigger value="reactions">Reações</TabsTrigger>
                                    <TabsTrigger value="passives">Habilidades Passivas</TabsTrigger>
                                </TabsList>
                                <TabsContent value="actions">
                                    <ActionManager actions={actions} actionType="action" onChange={setActions} />
                                </TabsContent>

                                <TabsContent value="bonus-actions">
                                    <ActionManager actions={bonusActions} actionType="bonus" onChange={setBonusActions} />
                                </TabsContent>

                                <TabsContent value="reactions">
                                    <ActionManager actions={reactions} actionType="reaction" onChange={setReactions} />
                                </TabsContent>

                                <TabsContent value="passives">
                                    <PassiveAbilityManager passives={passives} onChange={setPassives} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" asChild>
                        <Link href="/characters">Cancelar</Link>
                    </Button>
                    <Button type="submit">Editar personagem</Button>
                </div>
            </form>
        </div>
    )
}

