"use server";
import CombatSession from "@/components/combat-session";
import db from "@/lib/db/db";

export default async function CombatPage({ params }: { params: { id?: string } }) {
  const { id } = await params

  if (!id) {
    return <div>Invalid combat ID</div>;
  }

  try {
    const data = await db.combats.findById(id)

    if (!data) {
      return <div>Failed to load combat</div>;
    }

    return <CombatSession combatSession={data} />;
  } catch (error) {
    console.error("Error fetching combat session:", error);
    return <div>Something went wrong loading the combat session.</div>;
  }
}
