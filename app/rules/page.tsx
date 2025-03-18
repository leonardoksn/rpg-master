import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function RulesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Referência de regras</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search rules..." className="w-full pl-8" />
        </div>
      </div>

      <Tabs defaultValue="combat">
        <TabsList className="mb-6">
          <TabsTrigger value="combat">Combate</TabsTrigger>
          <TabsTrigger value="spells">Feitiços</TabsTrigger>
          <TabsTrigger value="conditions">Condições</TabsTrigger>
          <TabsTrigger value="equipment">Equipamento</TabsTrigger>
        </TabsList>

        <TabsContent value="combat">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sequência de Combate</CardTitle>
                <CardDescription>How combat works in Sorcerers & Curses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1. Determine Surprise</h3>
                  <p className="text-muted-foreground">
                    The GM determines if anyone involved in the combat encounter is surprised. If you're surprised, you
                    can't move or take an action on your first turn of the combat, and you can't take a reaction until
                    that turn ends.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">2. Establish Positions</h3>
                  <p className="text-muted-foreground">
                    The GM decides where all the characters and monsters are located. Given the adventurers' marching
                    order or their stated positions in the room or other location, the GM figures out where the
                    adversaries are.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3. Roll Initiative</h3>
                  <p className="text-muted-foreground">
                    Everyone involved in the combat encounter rolls initiative, determining the order of combatants'
                    turns. Roll a d20 and add your initiative modifier (Dexterity modifier).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">4. Take Turns</h3>
                  <p className="text-muted-foreground">
                    Each participant in the battle takes a turn in initiative order. On your turn, you can move a
                    distance up to your speed and take one action. You decide whether to move first or take your action
                    first.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">5. Begin the Next Round</h3>
                  <p className="text-muted-foreground">
                    When everyone involved in the combat has had a turn, the round ends. Repeat step 4 until the
                    fighting stops.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions in Combat</CardTitle>
                <CardDescription>What you can do on your turn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Attack</h3>
                    <p className="text-muted-foreground">
                      Make a melee or ranged attack against a target. Roll a d20 and add your attack bonus. If the total
                      equals or exceeds the target's AC, the attack hits.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Cast a Spell</h3>
                    <p className="text-muted-foreground">
                      Spellcasters can cast a spell with a casting time of 1 action. Some spells require a spell attack
                      roll, while others force the target to make a saving throw.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Dash</h3>
                    <p className="text-muted-foreground">
                      When you take the Dash action, you gain extra movement for the current turn equal to your speed.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Disengage</h3>
                    <p className="text-muted-foreground">
                      If you take the Disengage action, your movement doesn't provoke opportunity attacks for the rest
                      of the turn.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Dodge</h3>
                    <p className="text-muted-foreground">
                      When you take the Dodge action, you focus entirely on avoiding attacks. Until the start of your
                      next turn, any attack roll made against you has disadvantage.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Help</h3>
                    <p className="text-muted-foreground">
                      You can lend your aid to another creature in the completion of a task, giving them advantage on
                      the next ability check they make.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Making an Attack</CardTitle>
                <CardDescription>How to resolve attack actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1. Choose a target</h3>
                  <p className="text-muted-foreground">
                    Pick a target within your attack's range: a creature, an object, or a location.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">2. Determine modifiers</h3>
                  <p className="text-muted-foreground">
                    The GM determines whether the target has cover and whether you have advantage or disadvantage
                    against the target.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3. Resolve the attack</h3>
                  <p className="text-muted-foreground">
                    You make the attack roll. On a hit, you roll damage, unless the particular attack has rules that
                    specify otherwise.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Attack Rolls</h4>
                  <p className="text-sm text-muted-foreground">
                    Roll a d20 and add the appropriate modifiers. If the total equals or exceeds the target's Armor
                    Class (AC), the attack hits. Natural 20 is a critical hit, which means you roll the damage dice
                    twice.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Damage and Healing</CardTitle>
                <CardDescription>Rules for taking damage and recovering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Hit Points</h3>
                  <p className="text-muted-foreground">
                    Hit points represent a combination of physical and mental durability, the will to live, and luck.
                    When you take damage, you lose hit points. If you drop to 0 hit points, you are unconscious and must
                    make death saving throws.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Damage Types</h3>
                  <p className="text-muted-foreground">
                    Different attacks, damaging spells, and other harmful effects deal different types of damage: acid,
                    bludgeoning, cold, fire, force, lightning, necrotic, piercing, poison, psychic, radiant, slashing,
                    and thunder.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Resistance and Vulnerability</h3>
                  <p className="text-muted-foreground">
                    Some creatures and objects are exceedingly difficult or unusually easy to hurt with certain types of
                    damage.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    <li>Resistance: Take half damage from that type</li>
                    <li>Vulnerability: Take double damage from that type</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Healing</h3>
                  <p className="text-muted-foreground">
                    Healing allows you to regain hit points. You can never regain more hit points than your hit point
                    maximum.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spells">
          <Card>
            <CardHeader>
              <CardTitle>Spellcasting</CardTitle>
              <CardDescription>Rules for casting spells</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Magic permeates the worlds of Sorcerers & Curses and most often appears in the form of a spell. This
                section provides the rules for casting spells.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">Casting a Spell</h3>
                  <p className="text-muted-foreground">
                    When a character casts any spell, the same basic rules are followed, regardless of the character's
                    class or the spell's effects.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Casting Time: Most spells require a single action</li>
                    <li>Range: The target must be within the spell's range</li>
                    <li>Components: Verbal (V), Somatic (S), Material (M)</li>
                    <li>Duration: How long the spell effect lasts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Spell Level</h3>
                  <p className="text-muted-foreground">
                    Every spell has a level from 0 to 9. A spell's level is a general indicator of how powerful it is,
                    with the lowly (but still impressive) magic missile at 1st level and the earth-shaking wish at 9th
                    level. Cantrips—simple but powerful spells that characters can cast almost by rote—are level 0.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Spell Slots</h3>
                  <p className="text-muted-foreground">
                    Regardless of how many spells a caster knows or prepares, they can cast only a limited number of
                    spells before resting. Manipulating the fabric of magic and channeling its energy into even a simple
                    spell is physically and mentally taxing, and higher-level spells are even more so.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Saving Throws</h3>
                  <p className="text-muted-foreground">
                    Many spells specify that a target can make a saving throw to avoid some or all of a spell's effects.
                    The spell specifies the ability that the target uses for the save and what happens on a success or
                    failure.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    The DC to resist your spells = 8 + your spellcasting ability modifier + your proficiency bonus
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <CardTitle>Conditions</CardTitle>
              <CardDescription>Status effects that alter a creature's capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Blinded</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>A blinded creature can't see and automatically fails any ability check that requires sight.</li>
                    <li>
                      Attack rolls against the creature have advantage, and the creature's attack rolls have
                      disadvantage.
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Charmed</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>
                      A charmed creature can't attack the charmer or target the charmer with harmful abilities or
                      magical effects.
                    </li>
                    <li>The charmer has advantage on any ability check to interact socially with the creature.</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Frightened</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>
                      A frightened creature has disadvantage on ability checks and attack rolls while the source of its
                      fear is within line of sight.
                    </li>
                    <li>The creature can't willingly move closer to the source of its fear.</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Paralyzed</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>A paralyzed creature is incapacitated and can't move or speak.</li>
                    <li>The creature automatically fails Strength and Dexterity saving throws.</li>
                    <li>Attack rolls against the creature have advantage.</li>
                    <li>
                      Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the
                      creature.
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Poisoned</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>A poisoned creature has disadvantage on attack rolls and ability checks.</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Stunned</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>A stunned creature is incapacitated, can't move, and can speak only falteringly.</li>
                    <li>The creature automatically fails Strength and Dexterity saving throws.</li>
                    <li>Attack rolls against the creature have advantage.</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Unconscious</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>
                      An unconscious creature is incapacitated, can't move or speak, and is unaware of its surroundings.
                    </li>
                    <li>The creature drops whatever it's holding and falls prone.</li>
                    <li>The creature automatically fails Strength and Dexterity saving throws.</li>
                    <li>Attack rolls against the creature have advantage.</li>
                    <li>
                      Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the
                      creature.
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Exhaustion</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Exhaustion is measured in six levels. An effect can give a creature one or more levels of
                    exhaustion.
                  </p>

                  <table className="w-full text-sm mt-2">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Level</th>
                        <th className="text-left py-1">Effect</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1">1</td>
                        <td className="py-1">Disadvantage on ability checks</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">2</td>
                        <td className="py-1">Speed halved</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">3</td>
                        <td className="py-1">Disadvantage on attack rolls and saving throws</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">4</td>
                        <td className="py-1">Hit point maximum halved</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">5</td>
                        <td className="py-1">Speed reduced to 0</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">6</td>
                        <td className="py-1">Death</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Weapons & Armor</CardTitle>
              <CardDescription>Equipment rules and tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Weapons</h3>
                  <p className="text-muted-foreground mb-4">
                    Your class grants proficiency in certain weapons, reflecting both the class's focus and the tools
                    you are most likely to use. Whether you favor a longsword or a longbow, your weapon and your ability
                    to wield it effectively can mean the difference between life and death while adventuring.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Weapon</th>
                          <th className="text-left py-2">Damage</th>
                          <th className="text-left py-2">Properties</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Dagger</td>
                          <td className="py-2">1d4 piercing</td>
                          <td className="py-2">Finesse, light, thrown (20/60 ft.)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Longsword</td>
                          <td className="py-2">1d8 slashing</td>
                          <td className="py-2">Versatile (1d10)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Shortbow</td>
                          <td className="py-2">1d6 piercing</td>
                          <td className="py-2">Ammunition, two-handed, range (80/320 ft.)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Staff</td>
                          <td className="py-2">1d6 bludgeoning</td>
                          <td className="py-2">Versatile (1d8)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Greataxe</td>
                          <td className="py-2">1d12 slashing</td>
                          <td className="py-2">Heavy, two-handed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Armor</h3>
                  <p className="text-muted-foreground mb-4">
                    Sorcerers & Curses divides armor into three categories: light, medium, and heavy. Many warriors
                    supplement their armor with a shield.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Armor</th>
                          <th className="text-left py-2">AC</th>
                          <th className="text-left py-2">Strength</th>
                          <th className="text-left py-2">Stealth</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Leather</td>
                          <td className="py-2">11 + Dex modifier</td>
                          <td className="py-2">—</td>
                          <td className="py-2">—</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Chain shirt</td>
                          <td className="py-2">13 + Dex modifier (max 2)</td>
                          <td className="py-2">—</td>
                          <td className="py-2">—</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Breastplate</td>
                          <td className="py-2">14 + Dex modifier (max 2)</td>
                          <td className="py-2">—</td>
                          <td className="py-2">—</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Chain mail</td>
                          <td className="py-2">16</td>
                          <td className="py-2">Str 13</td>
                          <td className="py-2">Disadvantage</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Plate</td>
                          <td className="py-2">18</td>
                          <td className="py-2">Str 15</td>
                          <td className="py-2">Disadvantage</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Shield</td>
                          <td className="py-2">+2</td>
                          <td className="py-2">—</td>
                          <td className="py-2">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Weapon Properties</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium mb-1">Finesse</h4>
                      <p className="text-sm text-muted-foreground">
                        When making an attack with a finesse weapon, you use your choice of your Strength or Dexterity
                        modifier for the attack and damage rolls.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium mb-1">Heavy</h4>
                      <p className="text-sm text-muted-foreground">
                        Small creatures have disadvantage on attack rolls with heavy weapons.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium mb-1">Light</h4>
                      <p className="text-sm text-muted-foreground">
                        A light weapon is small and easy to handle, making it ideal for use when fighting with two
                        weapons.
                      </p>
                    </div>

                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium mb-1">Versatile</h4>
                      <p className="text-sm text-muted-foreground">
                        This weapon can be used with one or two hands. A damage value in parentheses appears with the
                        property—the damage when the weapon is used with two hands.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

