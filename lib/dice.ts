export function rollDice(formula: string): {
  result: number
  rolls: number[]
  modifier: number
} {
  // Parse the dice formula (e.g., "2d6+3")
  const match = formula.match(/(\d+)d(\d+)(?:([+-])(\d+))?/)

  if (!match) {
    throw new Error(`Invalid dice formula: ${formula}`)
  }

  const [_, numDice, dieSize, sign, modifierStr] = match
  const diceCount = Number.parseInt(numDice)
  const diceSides = Number.parseInt(dieSize)
  const modifier =
    sign && modifierStr ? (sign === "+" ? Number.parseInt(modifierStr) : -Number.parseInt(modifierStr)) : 0

  // Roll the dice
  const rolls: number[] = []
  for (let i = 0; i < diceCount; i++) {
    rolls.push(Math.floor(Math.random() * diceSides) + 1)
  }

  // Calculate the total
  const diceSum = rolls.reduce((sum, roll) => sum + roll, 0)
  const result = diceSum + modifier

  return {
    result,
    rolls,
    modifier,
  }
}

export function rollAttribute(attributeValue: number): {
  roll: number
  modifier: number
  total: number
} {
  const modifier = Math.floor((attributeValue - 10) / 2)
  const roll = Math.floor(Math.random() * 20) + 1

  return {
    roll,
    modifier,
    total: roll + modifier,
  }
}

export function rollSkill(skillModifier: number): {
  roll: number
  modifier: number
  total: number
} {
  const roll = Math.floor(Math.random() * 20) + 1

  return {
    roll,
    modifier: skillModifier,
    total: roll + skillModifier,
  }
}

