interface Character {
  id: string
  name: string
  type: CharacterType

  // Class information
  class?: string;
  level?: number

  // Essential attributes
  health: {
    temporary?: number;
    current: number
    max: number
  }
  energy?: {
    current: number
    max: number
  }
  ac: number

  // Movement and size
  size?: CharacterSize
  movement?: number // meters per turn

  // Core attributes
  attributes: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }

  // Saving throws
  saves: {
    fortitude: number
    cunning: number
    reflexes: number
    willpower: number
  }

  // Other characteristics
  otherStats: {
    initiative: number
    attention: number
  };

  // Actions and abilities
  actionsPerTurn?: number
  skills: Record<string, Skill>
  actions: Action[]
  bonusActions: Action[]
  reactions: Action[]
  passives: PassiveAbility[]

  conditions: string[]
  notes: string
}

interface CombatCharacter extends Character {
  initiative: number
  initiativeRoll: number
  actionsUsed?: number
  bonusActionsUsed?: number
  reactionsUsed?: number
}


interface CombatSession {
  id: string
  name: string
  characters: CombatCharacter[]
  round: number
  activeCharacterIndex: number
  logs: CombatLog[]
  status: "active" | "completed"
  createdAt: string
}


interface CombatLog {
  id: string
  round: number
  turn: number
  characterId: string
  characterName: string
  action: string
  actionTiming?: ActionTiming
  target?: {
    id: string
    name: string
  }
  details: string
  result: "hit" | "miss" | "save" | "fail" | "other"
  damage?: number
  timestamp: string
}

interface DiceRoll {
  formula: string
  result: number
  rolls: number[]
  modifier: number
}


type CombatSessionRequest = Omit<CombatSession, "id" | "createdAt" | "status" | "logs">;
