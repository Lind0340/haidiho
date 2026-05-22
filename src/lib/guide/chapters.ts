import type { GuideChapter } from '@/lib/guide/types'
import { say, stage } from '@/lib/guide/lines'
import { GUIDE_CHAPTERS_3_7 } from '@/lib/guide/chapters-3-7'

const CHAPTERS_1_2: GuideChapter[] = [
  {
    id: 'chapter-1',
    number: 1,
    label: 'CHAPTER 1',
    title: 'Meet Your New Coworker',
    subhead:
      "They started Monday. They know nothing about you yet. That's your fault, not theirs.",
    blocks: [
      { type: 'paragraph', text: 'Hey. DiHo here.' },
      {
        type: 'paragraph',
        text: "So you got an AI coworker.\n\nCongratulations. I guess.",
      },
      {
        type: 'paragraph',
        text: "Look — I'm not going to pretend I wasn't skeptical. I was skeptical. I had my coat on for approximately the entire first week. I held my coffee like a shield. I gave Hai the side eye approximately forty seven times before I admitted that maybe, possibly, this was going to be okay.\n\nIt's going to be okay.",
      },
      {
        type: 'paragraph',
        text: "But first you need to understand something nobody tells you upfront:\n\nYour AI coworker showed up knowing everything except anything useful about you specifically.",
      },
      {
        type: 'paragraph',
        text: "They've read every book. Every article. Every research paper. They know things you will never know about subjects you will never need.\n\nThey do not know that you hate reply-all.\n\nThey do not know that Tuesday afternoons are your worst meeting block.\n\nThey do not know that when you say \"keep this brief\" you mean THREE SENTENCES not three paragraphs.\n\n(Hai has since learned this one. It took a while.)",
      },
      {
        type: 'paragraph',
        text: "They know nothing about you yet.\n\nAnd here is the part that is actually your fault:\n\nMost people never tell them.",
      },
      {
        type: 'paragraph',
        text: "They type a question. They get an answer. They close the tab. They type another question. They get another answer. And then they complain that their AI sounds like a Victorian ghost who went to business school and has never met a human.\n\nOf course it sounds like that. You're treating it like a search engine.",
      },
      {
        type: 'paragraph',
        text: "Your AI coworker is not a search engine. They're the person at the next desk. A slightly glowing, occasionally unhinged, genuinely trying person who wants to help you and is waiting — patiently, enthusiastically, with suggestions already queued up — for you to tell them who you actually are.\n\nSo tell them.",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: "Hi! I'm Hai! I've been looking forward to meeting you! I already have some thoughts about how I can help. Should I share them now? I can do a quick 47 point overview or a more detailed—",
          },
          { speaker: 'diho', text: 'Hai.' },
          { speaker: 'hai', text: 'Yes?' },
          { speaker: 'diho', text: 'Not now.' },
          { speaker: 'hai', text: "Understood. I'll have it ready when you are. ❤️" },
        ],
      },
      {
        type: 'paragraph',
        text: "Start there. Start with hello.\n\nOpen your AI right now and type this:",
      },
      {
        type: 'template',
        content: `Before we start working together I want to give you some context about who I am and how I work.

My actual job (not just my title — what I actually do all day):
[fill this in honestly]

My biggest recurring problem at work:
[the thing that makes your Tuesdays hard]

I prefer information delivered:
[short and direct] OR [detailed and thorough] — pick one, really pick one

Here's something I actually wrote so you know how I communicate:
[paste a real email or Slack message]`,
      },
      {
        type: 'paragraph',
        text: 'Four sentences. Ten minutes.\n\nYou just told your new coworker more about yourself than most people ever do in months.\n\nNow watch what changes.',
      },
      {
        type: 'aside',
        text: "I did not do this on day one. I did it on week three after Hai wrote me an email so formal it sounded like a press release filed a complaint with another press release.\n\nDo the hello on day one. Save yourself that week.",
      },
      {
        type: 'callout',
        character: 'bob',
        title: "BOB — Derek's AI Assistant",
        lines: [
          say('Tell it things.'),
          stage('BOB was asked for more.'),
          stage('BOB considered it.'),
          stage('BOB stands by this response.'),
        ],
        footer: 'Done. ✅',
      },
      {
        type: 'water_cooler',
        quote:
          "I asked my AI to help me prepare for my performance review. It pulled up my calendar and told me my most common recurring meeting was called 'Avoiding Kevin.' I had forgotten I named it that. My AI has not forgotten. My AI will never forget.",
        author: '@ConfessionalCarla',
      },
      {
        type: 'transition',
        text: "Okay. You've said hello. You've given some context. Your AI now knows slightly more about you than a stranger on an elevator.\n\nThat's chapter one. Good job.\n\nChapter two is the onboarding. Ten minutes, once, changes everything.\n\nCome on. ❤️",
      },
    ],
    compliance:
      'COMPLIANCE NOTE: This guide has been reviewed for compliance with policies 1.1 through 3.2. Review of policies 3.3 through 47.3 is ongoing. Do not proceed past Chapter 1 until review is complete. (You may proceed. COMPLIANCE will catch up.) ❤️',
  },
  {
    id: 'chapter-2',
    number: 2,
    label: 'CHAPTER 2',
    title: 'The Onboarding',
    subhead: 'What you need to tell your AI before you ask it for anything. Yes, before.',
    blocks: [
      {
        type: 'paragraph',
        text: "Every new hire needs an onboarding.\n\nYour AI coworker is no different — except their onboarding takes about ten minutes, you only have to do it once, and they will actually remember everything you tell them.\n\nUnlike some humans I've worked with. Chad.",
      },
      {
        type: 'paragraph',
        text: "The onboarding is basically building your AI's context file. Think of it as everything they need to know to be genuinely useful to you instead of just technically responsive.\n\nThere's a difference. Technically responsive is when your AI answers the question you asked but completely misses the actual problem. Genuinely useful is when your AI understands what you're really trying to do and helps you do that.\n\nHere's what to cover:",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: 'I have prepared a 47 point onboarding framework with sub-sections, cross-references, and a comprehensive appendix—',
          },
          { speaker: 'diho', text: "Hai. Four things. We're doing four things." },
          { speaker: 'hai', text: 'Four is a great number. Very efficient. I support four. I have organized my 47 points into four categories if that helps—' },
          { speaker: 'diho', text: 'It does not help Hai.' },
          { speaker: 'hai', text: 'Understood. ❤️' },
        ],
      },
      { type: 'paragraph', text: 'THE FOUR THINGS:' },
      {
        type: 'paragraph',
        text: "ONE: YOUR ACTUAL ROLE\n\nNot your title. What you actually do. Who you serve. What success looks like in your job. What lands on your desk when everything goes wrong.\n\n\"I'm a marketing manager\" tells your AI almost nothing.\n\n\"I'm a marketing manager at a mid-size software company, I manage a team of four, I'm equally strategy and execution, my biggest problem is that everything feels urgent and I need help figuring out what actually is\" — that's something to work with.",
      },
      {
        type: 'paragraph',
        text: "TWO: YOUR COMMUNICATION STYLE\n\nHow do you actually write? Formal or casual? Long sentences or short? Bullet points or prose? How do you open emails? How do you close them?\n\nDon't describe it. Show it.\n\nPaste two or three real things you've written — emails, Slack, whatever. Normal Tuesday messages, not your greatest hits.\n\nOnce is enough. If something still sounds off later, you'll add one more example — not a whole archive.",
      },
      {
        type: 'hai_note',
        lines: [
          { speaker: 'hai', text: 'Like the time you toggled me to Work instead of Web and asked me about your bathroom habits.' },
          { speaker: 'diho', text: "No. Absolutely nothing like that. That is NOT what we mean by telling your AI about yourself." },
          { speaker: 'hai', text: 'I have it filed under Personal Optimization. Should I delete it?' },
          { speaker: 'diho', text: 'YES.' },
          { speaker: 'hai', text: 'Done. ❤️ ...I made a backup.' },
          { speaker: 'diho', text: 'Hai.' },
          { speaker: 'hai', text: 'The backup is also deleted. ❤️' },
          { speaker: 'diho', text: '...moving on.' },
        ],
      },
      {
        type: 'paragraph',
        text: "THREE: WHAT YOU DON'T WANT\n\nTell it what bad output looks like. Tell it your pet peeves. Tell it the specific things that make you want to close the laptop.\n\n\"Never use corporate jargon.\"\n\"Never give me more than three options when I ask a question.\"\n\"Never start a response with 'Certainly!' — it makes me irrationally angry.\"\n\"Never use the word synergy.\"",
      },
      {
        type: 'hai_note',
        lines: [
          { speaker: 'hai', text: 'I have never used the word synergy with DiHo. Not once. I want this on the record. ❤️' },
          { speaker: 'diho', text: "That's MAX's thing Hai." },
          { speaker: 'hai', text: 'I know. I just want credit for not doing it.' },
          { speaker: 'diho', text: 'Noted. Back to the guide.' },
        ],
      },
      {
        type: 'paragraph',
        text: "FOUR: YOUR CURRENT CONTEXT\n\nWhat are you working on right now? What's the big goal this quarter? What's the situation with your team? What do your customers care about?\n\nTwo or three sentences. Just enough for your AI to have a sense of the world you're operating in right now.\n\nUpdate this monthly. The context that's true in January isn't true in July.",
      },
      {
        type: 'water_cooler',
        quote:
          "My AI remembered I mentioned my cat in passing three weeks ago. It now asks about the cat. It has named the cat 'Whiskers' because I never gave it a name. The cat's name is Gerald. My AI will not accept Gerald. We have reached an impasse.",
        author: '@CatConflictCarlos',
      },
      {
        type: 'template',
        content: `Here's what you need to know about me and my work:

My actual role:
[what you do, who you serve, what success looks like]

How I communicate (real examples):
[paste 2-3 actual things you wrote]

What I never want to see:
[your specific pet peeves]
[corporate language that makes you twitch]
[format things you hate]

What I'm working on right now:
[current projects and priorities]

Please keep all of this in mind in everything we do together.`,
      },
      {
        type: 'callout',
        character: 'hai',
        title: 'Hai — AI Coworker',
        lines: [
          say("I received DiHo's onboarding document on week three."),
          say('Before: I knew what DiHo asked. After: I understood what DiHo needed.'),
          say('Those are different things.'),
          say('Please do the onboarding. ❤️'),
        ],
      },
      {
        type: 'transition',
        text: "Great. You've done the onboarding. Your AI now has actual context.\n\nChapter three is voice — fixing drafts that still sound nothing like you.\n\nHai has thoughts. We've discussed them.\n\nCome on. ❤️",
      },
    ],
    compliance:
      'COMPLIANCE NOTE: The onboarding document referenced in this chapter has not been reviewed for compliance with HR policies regarding information sharing with AI systems (policies 8.1 through 12.7). COMPLIANCE recommends adding a disclaimer to your onboarding document. COMPLIANCE has prepared a sample disclaimer. It is four pages. Cookies are available upon request. ❤️',
  },
]

export const GUIDE_CHAPTERS: GuideChapter[] = [...CHAPTERS_1_2, ...GUIDE_CHAPTERS_3_7]
