interface ICharacterData {
  name: string
  type: CharacterType
  class: string
  level: number
  maxHp: number
  maxEp: number
  ac: number
  size: CharacterSize;
  movement: number
  actionsPerTurn: number
  notes: string
  attributes: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  saves: {
    fortitude: number
    cunning: number
    reflexes: number
    willpower: number
  };
  otherStats: {
    initiative: number
    attention: number
  }
  skills: Record<string, Skill>
  actions: Action[]
  bonusActions: Action[]
  reactions: Action[]
  passives: PassiveAbility[]
}