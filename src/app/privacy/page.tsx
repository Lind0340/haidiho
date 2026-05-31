import type { Metadata } from 'next'
import { LegalPageLayout, LegalSection, formatLegalDate } from '@/components/legal/LegalPageLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Haidiho collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  const lastUpdated = formatLegalDate()

  return (
    <div className="min-h-[60vh] bg-diho-cream">
      <LegalPageLayout
        title="Privacy Policy"
        character="hai"
        characterNote="We take your privacy seriously. This is what we collect, why we collect it, and what we do with it. No surprises. ❤️"
        lastUpdated={lastUpdated}
      >
        <LegalSection title="What We Collect">
          <p>
            <strong>Account information:</strong> Email address, username, and display name when you
            create an account.
          </p>
          <p>
            <strong>Newsletter:</strong> Email address and first name when you subscribe.
          </p>
          <p>
            <strong>Community activity:</strong> Posts, comments, likes, and story submissions you
            create.
          </p>
          <p>
            <strong>Mug submissions:</strong> Photos and descriptions you submit to the Mug Wall.
          </p>
          <p>
            <strong>Orders:</strong> Shipping address, email, and order details for merchandise
            purchases. We never store payment card information — that is handled entirely by Stripe.
          </p>
          <p>
            <strong>Usage data:</strong> Basic analytics about how people use the site to make
            Haidiho better.
          </p>
        </LegalSection>

        <LegalSection title="What We Don't Collect">
          <p>We don&apos;t sell your data.</p>
          <p>We don&apos;t share your data with advertisers.</p>
          <p>We don&apos;t build profiles for advertising purposes.</p>
          <p>Haidiho is not that kind of site.</p>
        </LegalSection>

        <LegalSection title="How We Use Your Information">
          <ul className="list-disc space-y-2 pl-6">
            <li>To operate the community and deliver features you&apos;ve signed up for</li>
            <li>To send the weekly newsletter if you&apos;ve subscribed</li>
            <li>To fulfill merchandise orders</li>
            <li>To moderate community content</li>
            <li>To improve the site</li>
          </ul>
        </LegalSection>

        <LegalSection title="Third Party Services">
          <p>We use:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Supabase — database and authentication</li>
            <li>Resend — email delivery</li>
            <li>Stripe — payment processing</li>
            <li>Printful — merchandise fulfillment</li>
            <li>Anthropic — HaiBot and DiHoBot</li>
          </ul>
          <p>Each service has its own privacy policy governing their data handling.</p>
        </LegalSection>

        <LegalSection title="Data Retention">
          <p>
            We keep account data as long as your account is active. You can request deletion at any
            time by emailing{' '}
            <a href="mailto:hello@haidiho.com" className="font-bold text-hai-blue hover:underline">
              hello@haidiho.com
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="Your Rights">
          <p>You can:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Access personal data we hold</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Unsubscribe from the newsletter at any time</li>
          </ul>
          <p>
            Email{' '}
            <a href="mailto:hello@haidiho.com" className="font-bold text-hai-blue hover:underline">
              hello@haidiho.com
            </a>{' '}
            for requests.
          </p>
        </LegalSection>

        <LegalSection title="Cookies">
          <p>
            We use essential cookies for authentication and site functionality. We don&apos;t use
            advertising cookies.
          </p>
        </LegalSection>

        <LegalSection title="Children's Privacy">
          <p>
            Haidiho is intended for adults in the workforce. We don&apos;t knowingly collect data
            from children under 13.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Privacy questions:{' '}
            <a href="mailto:hello@haidiho.com" className="font-bold text-hai-blue hover:underline">
              hello@haidiho.com
            </a>
          </p>
        </LegalSection>
      </LegalPageLayout>
    </div>
  )
}
