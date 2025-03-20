export const skills = [
  { label: "Acrobacia", value: "acrobatics" },
  { label: "Atletismo", value: "athletics" },
  { label: "Enganação", value: "deception" },
  { label: "Feitiçaria", value: "sorcery" },
  { label: "Furtividade", value: "stealth" },
  { label: "História", value: "history" },
  { label: "Integridade", value: "insight" },
  { label: "Intimidação", value: "intimidation" },
  { label: "Intuição", value: "intuition" },
  { label: "Investigação", value: "investigation" },
  { label: "Luta", value: "fighting" },
  { label: "Medicina", value: "medicine" },
  { label: "Ocultismo", value: "occultism" },
  { label: "Percepção", value: "perception" },
  { label: "Performance", value: "performance" },
  { label: "Persuasão", value: "persuasion" },
  { label: "Pontaria", value: "marksmanship" },
  { label: "Mão leves", value: "sleightOfHand" },
  { label: "Religião", value: "religion" },
  { label: "Tecnologia", value: "technology" }
];

export enum AttributesEnum {
  strength = "strength",
  dexterity = "dexterity",
  constitution = "constitution",
  intelligence = "intelligence",
  wisdom = "wisdom",
  charisma = "charisma",
}

export enum SavesEnum {
  fortitude = "fortitude",
  reflexes = "reflexes",
  willpower = "willpower",
  cunning = "cunning",
}

export const attributes: Array<{ label: string, value: AttributesEnum }> = [
  { label: "Força", value: AttributesEnum.strength },
  { label: "Destreza", value: AttributesEnum.dexterity },
  { label: "Constituição", value: AttributesEnum.constitution },
  { label: "Inteligência", value: AttributesEnum.intelligence },
  { label: "Sabedoria", value: AttributesEnum.wisdom },
  { label: "Carisma", value: AttributesEnum.charisma },
];

export const saves: Array<{ label: string; value: SavesEnum }> = [
  { label: "Astúcia", value: SavesEnum.cunning },
  { label: "Fortitude", value: SavesEnum.fortitude },
  { label: "Reflexos", value: SavesEnum.reflexes },
  { label: "Vontade", value: SavesEnum.willpower },
]