import type { Metadata } from 'next'
import { LegalPageLayout, LegalSection, formatLegalDate } from '@/components/legal/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Haidiho.com — community, content, and newsletter guidelines.',
}

export default function TermsPage() {
  const lastUpdated = formatLegalDate()

  return (
    <div className="min-h-[60vh] bg-diho-cream">
      <LegalPageLayout
        title="Terms of Service"
        character="diho"
        characterNote="The legal stuff. We tried to make it readable. Hai wanted to add 47 clarifying footnotes. I said no."
        lastUpdated={lastUpdated}
      >
        <LegalSection title="1. Acceptance of Terms">
          <p>
            By accessing or using Haidiho.com you agree to these terms. If you don&apos;t agree,
            don&apos;t use the site. Simple.
          </p>
        </LegalSection>

        <LegalSection title="2. What Haidiho Is">
          <p>
            Haidiho is a community platform featuring original cartoon characters, educational
            content, and community submissions related to working with AI. Owned and operated by
            Wade Lindgren.
          </p>
        </LegalSection>

        <LegalSection title="3. Community Conduct">
          <p>By posting in The Neighborhood, submitting mugs, or submitting stories you agree to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Not post harmful, harassing, defamatory, or illegal content</li>
            <li>Not impersonate other people or characters</li>
            <li>Not post content you don&apos;t have the right to share</li>
            <li>Treat other community members with respect</li>
          </ul>
          <p>
            We reserve the right to remove content and suspend accounts that violate these standards.
          </p>
        </LegalSection>

        <LegalSection title="4. Content You Submit">
          <p>
            <strong>Community Posts and Comments:</strong> You retain ownership of content you post
            in The Neighborhood. By posting you grant Haidiho a non-exclusive license to display
            that content on the site.
          </p>
          <p>
            <strong>Story Submissions:</strong> Subject to separate{' '}
            <a href="/story-terms" className="font-bold text-hai-blue hover:underline">
              Story Submission Terms
            </a>
            . Read those before submitting.
          </p>
          <p>
            <strong>Mug Submissions:</strong> Subject to separate{' '}
            <a href="/mug-terms" className="font-bold text-hai-blue hover:underline">
              Mug Submission Terms
            </a>
            . Read those before submitting — including possible use in future strips.
          </p>
        </LegalSection>

        <LegalSection title="5. Haidiho Original Content">
          <p>
            All Haidiho original content including but not limited to the Hai and DiHo characters,
            the full cast of characters, the cartoon strips, the World Bible, the guide, the AI Back
            Channel format, the MAX Daydream format, and all associated creative elements is owned
            exclusively by Wade Lindgren / Haidiho. All rights reserved.
          </p>
          <p>
            You may share Haidiho content with attribution. You may not reproduce, sell, or create
            derivative works from Haidiho original content without written permission.
          </p>
        </LegalSection>

        <LegalSection title="6. Newsletter">
          <p>
            By subscribing you agree to receive weekly emails. You can unsubscribe at any time using
            the link in every email. We will never sell your email address.
          </p>
        </LegalSection>

        <LegalSection title="7. Merchandise">
          <p>
            All merchandise purchases are subject to standard e-commerce terms. Print on demand
            products are fulfilled by Printful. Digital downloads are delivered via secure link.
            Refund requests are handled case by case.
          </p>
        </LegalSection>

        <LegalSection title="8. Disclaimers">
          <p>
            Haidiho is for entertainment and educational purposes. Nothing on this site constitutes
            professional advice of any kind. The characters are fictional. Your AI coworker is real.
            We are not responsible for what your AI coworker does.
          </p>
        </LegalSection>

        <LegalSection title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Haidiho is not liable for any indirect,
            incidental, or consequential damages arising from your use of the site.
          </p>
        </LegalSection>

        <LegalSection title="10. Changes to Terms">
          <p>
            We may update these terms occasionally. Continued use after changes constitutes
            acceptance. The updated date is noted at the top of this page.
          </p>
        </LegalSection>

        <LegalSection title="11. Contact">
          <p>
            Questions:{' '}
            <a href="mailto:hello@haidiho.com" className="font-bold text-hai-blue hover:underline">
              hello@haidiho.com
            </a>
          </p>
        </LegalSection>
      </LegalPageLayout>
    </div>
  )
}
