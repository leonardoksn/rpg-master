type CharacterType = "PC" | "NPC" | "Creature"
type ActionType = "attack" | "spell" | "ability" | "other"
type ActionTiming = "action" | "bonus" | "reaction"
type CharacterSize = "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan"




interface Skill {
  name: string
  modifier: number
  hasAdvantage?: boolean;
  label: string;
}

interface Action {
  id: string
  name: string
  description: string
  actionType: ActionType
  timing?: ActionTiming
  attackBonus?: number
  damageFormula?: string
  range?: string
  usesPerRound?: number
  currentUses?: number
  savingThrow?: {
    attribute: "fortitude" | "cunning" | "reflexes" | "willpower"
    dc: number
  };
  cost?: number;
  actions?: number;
}


interface PassiveAbility {
  id: string
  name: string
  description: string
  usesPerDay?: number
  currentUses?: number
}


