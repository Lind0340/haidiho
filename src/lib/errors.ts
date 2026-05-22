export const HaidihoErrors = {
  generic: 'Hai is thinking very hard about this. Try again in a moment.',
  auth: 'DiHo needs you to sign in first. ❤️',
  authToPost:
    'Create a free account (or sign in) to post in the neighborhood. Reading is open to everyone. ❤️',
  emptyRoom: 'Nothing here yet. Be the first. DiHo dares you.',
  storySuccess:
    "Your story is live in the neighborhood! It might still become a strip. ❤️ — Hai",
  storyRejected:
    "Hai couldn't post that one — keep it about AI-at-work and skip anything mean or off-topic. Try again? ❤️",
  postSuccess: "Posted! Hai gave it a quick look and it's live. ❤️",
  commentSuccess: "Reply is live. Thanks for keeping it human. ❤️",
  notFound: "This doesn't seem to exist. Even COMPLIANCE couldn't find it.",
  rateLimit: 'Slow down! Even Hai needs a moment. ❤️',
  validation: 'Something in that form needs a little love. Check and try again.',
  duplicate: "You're already on the list — we see you. ❤️",
  upload: "That image didn't make it up. Try a smaller JPG or PNG?",
} as const

function messageFrom(err: unknown): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message)
  }
  return ''
}

export function friendlyError(err: unknown, fallback: string = HaidihoErrors.generic): string {
  const msg = messageFrom(err).toLowerCase()
  if (!msg) return fallback
  if (msg.includes('auth') || msg.includes('jwt') || msg.includes('session')) {
    return HaidihoErrors.auth
  }
  if (msg.includes('rate') || msg.includes('429')) return HaidihoErrors.rateLimit
  if (msg.includes('not found') || msg.includes('404')) return HaidihoErrors.notFound
  if (msg.includes('duplicate') || msg.includes('unique')) return HaidihoErrors.duplicate
  if (msg.includes('row-level security') || msg.includes('permission denied')) {
    return 'DiHo could not save that story — check Supabase keys and story_submissions policies. ❤️'
  }
  if (process.env.NODE_ENV === 'development') {
    return messageFrom(err) || fallback
  }
  return fallback
}
