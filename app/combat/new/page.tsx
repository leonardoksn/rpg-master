"use server"


import { findall } from "@/actions/characters/consult-characters";
import CreationCombat from "@/components/creation-combat";

export default async function NewCombatPage() {
  const characters = await findall();

  return (<CreationCombat characters={characters} />)
}

