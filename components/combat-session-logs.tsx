import { CONDITIONS } from "@/lib/constants";
import { Undo } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export function CombatSessionLogs({ logs, undoLastAction }: { logs: CombatLog[]; undoLastAction: () => void }) {
  return <Card>
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
                  <span className="font-medium">{log.characterName}</span> usado{" "}
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
                {log.healing && <p className="text-sm font-medium text-green-500">Cura: {log.healing}</p>}
                {log.temporaryHP && (
                  <p className="text-sm font-medium text-blue-500">HP temporário: {log.temporaryHP}</p>
                )}
                {log.armorClassChange && (
                  <p className="text-sm font-medium text-purple-500">
                    CA: {log.armorClassChange.oldValue} → {log.armorClassChange.newValue}
                  </p>
                )}
                {log.integrityChange && (
                  <p className="text-sm font-medium text-amber-500">
                    Integridade: {log.integrityChange.oldValue} → {log.integrityChange.newValue}
                  </p>
                )}
                {log.conditionChange?.added && (
                  <p className="text-sm font-medium text-orange-500">
                    Condições adicionadas:{" "}
                    {log.conditionChange.added
                      .map((c) => CONDITIONS[c])
                      .join(", ")}
                  </p>
                )}
                {log.conditionChange?.removed && (
                  <p className="text-sm font-medium text-teal-500">
                    Condições removidas:{" "}
                    {log.conditionChange.removed
                      .map((c) => CONDITIONS[c])
                      .join(", ")}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
    </CardContent>
    <CardFooter>
      <Button variant="outline" size="sm" disabled={logs.length === 0} onClick={undoLastAction}>
        <Undo className="mr-2 h-4 w-4" />Desfazer última ação
      </Button>
    </CardFooter>
  </Card>
}