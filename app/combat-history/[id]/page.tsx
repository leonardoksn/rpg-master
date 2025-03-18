import { consultCombat } from "@/actions/combat/consult-combat";
import CombatHistoryDetail from "@/components/combat-history";

export default async function CombatHistoryDetailPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the combat session by ID
  const id = await params.id
  const { data: combatSession } = await consultCombat(id);

  if (!combatSession) {
    return null
  }

  return <CombatHistoryDetail combatSession={combatSession} id={id} />
}

