import { NextResponse } from 'next/server'

/** Stripe webhook — wire payment confirmations when merch launches. */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  // TODO: verify signature with stripe SDK and update orders table
  await request.text()
  return NextResponse.json({ received: true })
}
