import { CharacterResponsePanel } from '@/components/admin/CharacterResponsePanel'

export default function AdminNeighborhoodPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-hand)] text-4xl font-bold text-soft-charcoal">
        Neighborhood
      </h1>
      <p className="mt-2 text-sm font-semibold text-soft-charcoal/75">
        Surprise character replies — manual, occasional, never more than once per day.
      </p>
      <div className="mt-6">
        <CharacterResponsePanel />
      </div>
    </div>
  )
}
