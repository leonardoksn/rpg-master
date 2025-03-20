"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { attributes } from "@/lib/expertise"
import { ArrowLeft, Calendar, Download, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CombatHistoryDetail({ combatSession, id }: { combatSession: CombatSession; id: string }) {
  // In a real app, we would fetch the combat session by ID

  const [activeTab, setActiveTab] = useState("summary")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/combat-history">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{combatSession.name}</h1>
          <div className="flex items-center mt-1">
            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{new Date(combatSession.createdAt).toLocaleDateString()}</span>
            <Badge variant={combatSession.status === "active" ? "default" : "secondary"} className="ml-2">
              {combatSession.status === "active" ? "Active" : "Completed"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="summary" onValueChange={setActiveTab} value={activeTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="log">Combat Log</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Combat Summary</CardTitle>
                <CardDescription>Overview of the combat encounter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div className="p-4 bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground">Rodadas</div>
                    <div className="text-2xl font-bold">{combatSession.round}</div>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground">Participantes</div>
                    <div className="text-2xl font-bold">{combatSession.characters.length}</div>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground">Ações</div>
                    <div className="text-2xl font-bold">{combatSession.logs.length}</div>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground">Duração</div>
                    <div className="text-2xl font-bold">--:--</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Most Active Characters</h3>
                    <div className="space-y-2">
                      {combatSession.characters.slice(0, 3).map((character) => (
                        <div key={character.id} className="flex justify-between items-center p-2 border rounded-md">
                          <div>
                            <span className="font-medium">{character.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">({character.type})</span>
                          </div>
                          <div className="text-sm">
                            {combatSession.logs.filter((log) => log.characterId === character.id).length} actions
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Combat Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md">
                        <h4 className="text-sm font-medium mb-2">Hit Rate</h4>
                        <div className="flex items-end space-x-2">
                          <div className="text-2xl font-bold">
                            {Math.round(
                              (combatSession.logs.filter((log) => log.result === "hit").length /
                                Math.max(
                                  1,
                                  combatSession.logs.filter((log) => ["hit", "miss"].includes(log.result)).length,
                                )) *
                              100,
                            )}
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ({combatSession.logs.filter((log) => log.result === "hit").length} hits /
                            {combatSession.logs.filter((log) => ["hit", "miss"].includes(log.result)).length} attacks)
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h4 className="text-sm font-medium mb-2">Total Damage</h4>
                        <div className="flex items-end space-x-2">
                          <div className="text-2xl font-bold">
                            {combatSession.logs.reduce((sum, log) => sum + (log.damage || 0), 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">damage dealt</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log">
            <Card>
              <CardHeader>
                <CardTitle>Combat Log</CardTitle>
                <CardDescription>Detailed record of all combat actions</CardDescription>
              </CardHeader>
              <CardContent>
                {combatSession.logs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No actions recorded</p>
                ) : (
                  <div className="space-y-4">
                    {combatSession.logs.map((log) => (
                      <div key={log.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium">
                              Round {log.round}, Turn {log.turn}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <Badge variant={log.result === "hit" ? "default" : "secondary"}>{log.result}</Badge>
                        </div>
                        <p>
                          <span className="font-medium">{log.characterName}</span> used{" "}
                          <span className="italic">{log.action}</span> on{" "}
                          <span className="font-medium">{log.target?.name}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                        {log.damage && <p className="text-sm font-medium text-red-500 mt-1">Damage: {log.damage}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Combat Participants</CardTitle>
                <CardDescription>Characters involved in this encounter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {combatSession.characters.map((character) => (
                    <div key={character.id} className="p-4 border rounded-md">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium">{character.name}</h3>
                          <div className="flex items-center">
                            <Badge
                              variant={
                                character.type === "PC"
                                  ? "default"
                                  : character.type === "NPC"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="mr-2"
                            >
                              {character.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Initiative: {character.initiativeRoll}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center space-x-4">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">HP</span>
                            <span className="font-bold">
                              {character.health.current}/{character.health.max}
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">CA</span>
                            <span className="font-bold">{character.ac}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Ações</h4>
                          <ul className="text-sm text-muted-foreground">
                            {character.actions.map((action) => (
                              <li key={action.id}>{action.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Atributos</h4>
                          <div className="grid grid-cols-3 gap-1">
                            {attributes.map((value) => (
                              <div key={value.value} className="text-xs">
                                <span className="uppercase">{value.label}</span>: {character.attributes[value.value]}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Combat Activity</h4>
                          <div className="text-sm text-muted-foreground">
                            <div>
                              Actions: {combatSession.logs.filter((log) => log.characterId === character.id).length}
                            </div>
                            <div>
                              Damage Dealt:{" "}
                              {combatSession.logs
                                .filter((log) => log.characterId === character.id && log.damage)
                                .reduce((sum, log) => sum + (log.damage || 0), 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end">
        {combatSession.status === "active" ? (
          <Button asChild>
            <Link href={`/combat/${combatSession.id}`}>Continuar Combate</Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/combat/new">Iniciar novo combate</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

