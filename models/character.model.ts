import { Schema, model, models } from "mongoose";

const CharacterSchema = new Schema({
    name: String,
    type: String,
    class: String,
    integrity: Number,
    level: Number,
    maxHp: Number,
    maxEp: Number,
    ac: Number,
    size: String,
    movement: Number,
    actionsPerTurn: Number,
    notes: String,
    attributes: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number,
    },
    saves: {
        fortitude: Number,
        cunning: Number,
        reflexes: Number,
        willpower: Number,
    },
    otherStats: {
        initiative: Number,
        attention: Number,
    },
    skills: Schema.Types.Mixed,
    actions: [Schema.Types.Mixed],
    bonusActions: [Schema.Types.Mixed],
    reactions: [Schema.Types.Mixed],
    passives: [Schema.Types.Mixed],
}, {
    timestamps: true,
});

const CharacterModel = models.Character || model("Character", CharacterSchema);
export default CharacterModel;
