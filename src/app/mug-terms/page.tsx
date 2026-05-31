import type { Metadata } from 'next'
import { LegalPageLayout, LegalSection, formatLegalDate } from '@/components/legal/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Mug Submission Terms',
  description:
    'Terms for submitting mug photos to Haidiho — mug wall, newsletter, and possible use in strips.',
}

export default function MugTermsPage() {
  const lastUpdated = formatLegalDate()

  return (
    <div className="min-h-[60vh] bg-diho-cream">
      <LegalPageLayout
        title="Mug Submission Terms"
        character="hai"
        characterNote="Your mug matters. Read this before you submit — we may feature it on the wall, in the newsletter, or someday in a strip. You keep your photo. We get permission to celebrate it. ❤️"
        lastUpdated={lastUpdated}
      >
        <LegalSection title="The Short Version">
          <p>
            You share a photo of your mug. We display it on the Mug Wall and may feature it in the
            newsletter. Your mug (or a cartoon version inspired by it) might appear in a future
            Haidiho strip. You keep ownership of your photo. You get credit. The strip artwork, if
            we make one, belongs to Haidiho.
          </p>
        </LegalSection>

        <LegalSection title="1. What You're Submitting">
          <p>
            A photo of a real mug you own, plus optional details (your name, what&apos;s on the
            mug, a short story). Community sharing only — not a product listing or merch order.
          </p>
        </LegalSection>

        <LegalSection title="2. What You Keep">
          <p>
            Your photograph is yours. You can use it anywhere else. Submitting to Haidiho does not
            transfer ownership of your photo to us.
          </p>
        </LegalSection>

        <LegalSection title="3. What You're Granting">
          <p>
            By submitting a mug photo you confirm you own the rights to that image (or have
            permission from the rights holder) and grant Haidiho an irrevocable, royalty-free,
            worldwide license to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Display your photo on the Mug Wall and elsewhere on haidiho.com</li>
            <li>Feature your mug in the weekly newsletter (e.g. Mug of the Week)</li>
            <li>
              Use your mug, its appearance, text, or story as inspiration for Hai and DiHo cartoon
              strips and related Haidiho creative works
            </li>
            <li>
              Create derivative works including cartoon depictions of your mug, characters holding
              similar mugs, and other formats tied to the Haidiho brand
            </li>
          </ul>
          <p>
            Any cartoon strip or artwork created from your mug submission is owned entirely by
            Haidiho, including all characters, dialogue, and creative elements in that work — the
            same as other Haidiho original strips.
          </p>
        </LegalSection>

        <LegalSection title="4. Credit">
          <p>
            When we feature your mug we use the name and details you provide unless you ask to stay
            anonymous. If your mug inspires a strip, we credit you by your chosen name when
            possible. Credit is our standard practice but does not constitute financial
            compensation.
          </p>
        </LegalSection>

        <LegalSection title="5. What You're Confirming">
          <p>By submitting you confirm that:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>The photo is yours to share, or you have permission to share it</li>
            <li>The image does not violate anyone else&apos;s privacy or rights</li>
            <li>It does not show confidential or proprietary information you are not allowed to publish</li>
            <li>You are at least 18 or have permission from a parent or guardian</li>
          </ul>
        </LegalSection>

        <LegalSection title="6. No Compensation">
          <p>
            Mug submissions are not paid. Being on the wall, in the newsletter, or inspiring a strip
            is the exchange. If that ever changes we will say so clearly to the community.
          </p>
        </LegalSection>

        <LegalSection title="7. Moderation">
          <p>
            We review submissions before they go live. We may decline or remove a mug for any
            reason. Submitting does not guarantee approval or future strip use.
          </p>
        </LegalSection>

        <LegalSection title="8. General Terms">
          <p>
            Your use of Haidiho is also governed by our{' '}
            <a href="/terms" className="font-bold text-hai-blue hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="font-bold text-hai-blue hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="9. Questions">
          <p>
            <a href="mailto:hello@haidiho.com" className="font-bold text-hai-blue hover:underline">
              hello@haidiho.com
            </a>
          </p>
        </LegalSection>

        <p className="rounded-lg border border-[#ead8c2] bg-[#fff6e8] p-4 text-sm leading-relaxed text-soft-charcoal/75">
          These terms cover permission to use your mug image and possible strip inspiration.
          Professional legal review is recommended before Haidiho relies heavily on
          community-submitted visuals in commercial products.
        </p>
      </LegalPageLayout>
    </div>
  )
}
