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
    <div className="overflow-x-clip px-3 pb-12 pt-3 sm:px-6 sm:pb-10 lg:px-10">
      <div className="site-container">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,298px)_minmax(0,1fr)] lg:gap-[10px]">
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
