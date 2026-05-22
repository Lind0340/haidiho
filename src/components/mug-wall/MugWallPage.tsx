import { MugWallBoard } from '@/components/mug-wall/MugWallBoard'
import { MugWallIntro } from '@/components/mug-wall/MugWallIntro'
import { MugSubmissionForm } from '@/components/forms/MugSubmissionForm'
import type { MugWallEntry } from '@/lib/mug-wall-data'

type Props = {
  mugs: MugWallEntry[]
  featuredId: string | null
}

export function MugWallPage({ mugs, featuredId }: Props) {
  return (
    <div className="px-3 pb-10 pt-3 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1024px]">
        <div className="grid items-start gap-3 lg:grid-cols-[298px_1fr] lg:gap-[10px]">
          <div>
            <MugWallIntro />
            <MugSubmissionForm />
          </div>
          <MugWallBoard mugs={mugs} featuredId={featuredId} />
        </div>
      </div>
    </div>
  )
}
