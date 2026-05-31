import { ModerationPanel } from '@/components/admin/ModerationPanel'

export default function AdminModerationPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-hand)] text-3xl font-bold text-soft-charcoal">
        Moderation queue
      </h1>
      <p className="mt-1 text-sm text-soft-charcoal/70">
        AI pre-screens every story and post. Nothing goes on the board until you approve it.
      </p>
      <div className="mt-6">
        <ModerationPanel />
      </div>
    </div>
  )
}
