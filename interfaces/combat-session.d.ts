
interface CombatSessionCharacterCardProps {
    character: CombatCharacter;
    selectedCharacterId: string | null;
    index: number;
    activeIndex: number;
    setSelectedCharacterId: (value: SetStateAction<string | null>) => void;
    adjustHealth: (characterId: string, amount: number, isTemp?: boolean) => void;
    handleChange: (characterId: string, amount: number) => void;
    adjustEnergy: (characterId: string, amount: number) => Promise<void>;
    updateArmorClass: (characterId: string, newAC: number) => void;
    addCondition: (characterId: string, condition: Condition) => void;
    removeCondition: (characterId: string, conditionType: ConditionType) => void;
    addTemporaryHP: (characterId: string, amount: number) => void;
    adjustIntegrity: (characterId: string, amount: number) => void;
    removeCharacterFromCombat: (characterId: string) => void;
}