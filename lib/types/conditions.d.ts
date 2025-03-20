type ConditionType =
    | "shaken"
    | "grappled"
    | "frightened"
    | "stunned"
    | "prone"
    | "blinded"
    | "doomed"
    | "confused"
    | "dazed"
    | "flat-footed"
    | "charmed"
    | "sickened"
    | "entangled"
    | "poisoned"
    | "exposed"
    | "weakened"
    | "immobile"
    | "incapacitated"
    | "unconscious"
    | "invisible"
    | "slowed"
    | "paralyzed"
    | "bleeding"
    | "deafened";

    

interface Condition {
    type: ConditionType;
    duration?: number // in rounds, undefined means indefinite
    source?: string // what caused the condition
    notes?: string
}