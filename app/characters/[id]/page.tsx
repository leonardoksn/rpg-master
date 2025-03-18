import { getCharacter } from "@/actions/characters/consult-character";
import CharacterSelected from "@/components/character-selected";

export default async function CharacterPage({ params }: { params: { id?: string } }) {

    const { id } = await params;
    if (!id) {
        return null;
    }

    const character = await getCharacter(id);

    if (!character) {
        return null;
    }
    return <CharacterSelected character={character} id={id} />
}

