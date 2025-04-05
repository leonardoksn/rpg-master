import connectToDatabase  from "@/lib/db/mongodb";
import CharacterModel from "@/models/character.model";

export default class Character {
  async create(data: ICharacterData) {
    await connectToDatabase();
    const character = await CharacterModel.create(data);
    return character._id.toString();
  }

  async findAll() {
    await connectToDatabase();
    const characters = await CharacterModel.find();
    return characters;
  }

  async findOne(id: string) {
    await connectToDatabase();
    const character = await CharacterModel.findById(id);
    return character;
  }

  async update(id: string, data: ICharacterData) {
    await connectToDatabase();
    await CharacterModel.findByIdAndUpdate(id, data);
    return id;
  }

  async delete(id: string) {
    await connectToDatabase();
    await CharacterModel.findByIdAndDelete(id);
    return id;
  }
}
