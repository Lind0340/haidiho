import type { Metadata } from 'next'
import { LegalPageLayout, LegalSection, formatLegalDate } from '@/components/legal/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Story Submission Terms',
  description: 'Terms for submitting stories to Haidiho — credit, IP, and what you agree to.',
}

export default function StoryTermsPage() {
  const lastUpdated = formatLegalDate()

  return (
    <div className="min-h-[60vh] bg-diho-cream">
      <LegalPageLayout
        title="Story Submission Terms"
        character="diho"
        characterNote="Read this before you submit a story. Short version: your story stays yours, the strip belongs to us, you get credited and celebrated. ❤️"
        lastUpdated={lastUpdated}
      >
        <LegalSection title="The Short Version">
          <p>
            You share your story. We might turn it into a strip. If we do, the strip belongs to
            Haidiho. You get credited and celebrated. Nobody makes money off your story without your
            name being attached to it.
          </p>
        </LegalSection>

        <LegalSection title="1. What You're Submitting">
          <p>
            A story about your real experience working with AI. Something funny, instructive,
            relatable, or all three.
          </p>
        </LegalSection>

        <LegalSection title="2. What You Keep">
          <p>
            Your story is yours. You can tell it anywhere, post it anywhere, do anything you want
            with it. Submitting to Haidiho doesn&apos;t take that away from you.
          </p>
        </LegalSection>

        <LegalSection title="3. What You're Granting">
          <p>By submitting a story you grant Haidiho an irrevocable, royalty-free, worldwide license to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Use your story as inspiration for Hai and DiHo cartoon strips</li>
            <li>Publish adapted versions of your story in strips, newsletters, and on the site</li>
            <li>
              Create derivative works based on your story including but not limited to cartoon strips,
              animations, merchandise, and other creative formats
            </li>
          </ul>
          <p>
            Any strip created from your story is owned entirely by Haidiho including all characters,
            artwork, dialogue, and creative elements in that strip.
          </p>
        </LegalSection>

        <LegalSection title="4. Credit">
          <p>
            If your story inspires a strip we will credit you by your chosen username or name unless
            you request anonymity. Credit is our standard practice but does not constitute
            compensation.
          </p>
        </LegalSection>

        <LegalSection title="5. What You're Confirming">
          <p>By submitting you confirm that:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>This story is your own original experience</li>
            <li>You have the right to share it</li>
            <li>It doesn&apos;t violate anyone else&apos;s privacy or confidentiality</li>
            <li>
              It doesn&apos;t contain confidential company information you&apos;re not permitted to
              share
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="6. No Compensation">
          <p>
            Story submissions are not compensated financially. The credit, community recognition, and
            being part of the Haidiho world is the exchange.
          </p>
          <p>
            If this changes in the future we&apos;ll communicate clearly with the community.
          </p>
        </LegalSection>

        <LegalSection title="7. Moderation">
          <p>
            We review all submissions before publishing or using them. We may decline submissions for
            any reason. Submitting does not guarantee use.
          </p>
        </LegalSection>

        <LegalSection title="8. Questions">
          <p>
            <a href="mailto:hello@haidiho.com" className="font-bold text-hai-blue hover:underline">
              hello@haidiho.com
            </a>
          </p>
        </LegalSection>

        <p className="rounded-lg border border-[#ead8c2] bg-[#fff6e8] p-4 text-sm leading-relaxed text-soft-charcoal/75">
          These terms deal with intellectual property assignment. Professional legal review is
          recommended before Haidiho generates significant revenue from community-inspired content.
        </p>
      </LegalPageLayout>
    </div>
  )
}
