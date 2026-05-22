import type { GuideChapter } from '@/lib/guide/types'
import { say, stage, tag } from '@/lib/guide/lines'

export const GUIDE_CHAPTERS_3_7: GuideChapter[] = [
  {
    id: 'chapter-3',
    number: 3,
    label: 'CHAPTER 3',
    title: 'Teaching It Your Voice',
    subhead:
      'How to get it to sound like you instead of a Victorian ghost who went to business school.',
    blocks: [
      {
        type: 'paragraph',
        text: "You know the problem.\n\nYou ask your AI to write an email. It comes back stiff. Technically correct. Completely devoid of you.\n\nThis is not your AI's fault.\n\nYou typed your prompt like you were filing a report. It filed one back.\n\nFormal input → formal output. You-shaped prompt → you-shaped output.\n\nThe fix is embarrassingly simple:\n\nSound like yourself when you ask.",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: "DiHo's voice has a very specific rhythm. She builds slowly. Then she lands hard. Then sometimes she apologizes for landing hard even though the landing was correct. She's basically a wizard who refuses to own the wand. I find this very human. ❤️",
          },
          { speaker: 'diho', text: "Hai that's very sweet and also slightly invasive." },
          { speaker: 'hai', text: 'I meant it as a compliment.' },
          { speaker: 'diho', text: 'I know. Still slightly invasive.' },
          { speaker: 'hai', text: 'Noted. ❤️' },
        ],
      },
      { type: 'paragraph', text: "HERE'S WHAT ACTUALLY WORKS:" },
      {
        type: 'paragraph',
        text: "USE WHAT YOU ALREADY GAVE IT\n\n\"Write casually\" means nothing. Your onboarding samples mean everything.\n\nIf drafts still sound wrong, paste one more normal message and say: match this — not a press release, not a Victorian ghost.\n\nThat's it. You do not need a folder of emails. You need a clear reference.",
      },
      {
        type: 'paragraph',
        text: "WRITE YOUR PROMPTS LIKE A HUMAN\n\n\"Hey I need a quick email to my client about the delay, keep it warm and honest, not too long\" will get you something useful.\n\n\"Please compose a professional communication regarding the timeline adjustment to be delivered to our valued client partner\" will get you something that sounds like COMPLIANCE wrote it on a day when COMPLIANCE was feeling particularly thorough.",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: 'COMPLIANCE writes very thorough communications. They are technically excellent. DiHo has asked me to note that this is not a compliment in this context.',
          },
          { speaker: 'diho', text: 'Thank you Hai.' },
          { speaker: 'hai', text: "You're welcome. ❤️" },
        ],
      },
      {
        type: 'paragraph',
        text: "TELL IT WHAT YOU DON'T SOUND LIKE\n\nNegative constraints are surprisingly powerful.\n\n\"I never use exclamation points in professional emails.\"\n\"I don't do bullet points in messages to clients.\"\n\"My sign-off is just my first name. Not 'warmly.' Not 'best.' Just my name.\"\n\"I never say 'circle back' or 'touch base' or any word that makes me feel like I'm in a corporate training video from 2009.\"\n\nTell it who you're not. It helps narrow down who you are.",
      },
      {
        type: 'paragraph',
        text: "ITERATE DON'T RESTART\n\nWhen the first draft isn't right — and sometimes it won't be — don't delete it and start from zero.\n\nCorrect it.\n\n\"This is too formal. Make it sound like I'm talking to a colleague not testifying before congress.\"\n\n\"Good but too long. The whole point in half the words.\"\n\n\"The opening is perfect. Keep that exactly. The middle loses me. Try again from paragraph two.\"\n\nSpecific feedback gets specific results. \"This isn't right\" tells your AI nothing. \"The third paragraph buried the point and the tone is off\" tells your AI exactly where to go.",
      },
      {
        type: 'water_cooler',
        quote:
          "Asked my AI to 'write like me' and gave it three of my emails. It wrote back and said: 'I notice you begin 47% of your sentences with the word Actually. I have matched this. Actually, here is your email.' I do not begin 47% of my sentences with Actually. Actually I might.",
        author: '@ActuallyAndrea',
      },
      {
        type: 'aside',
        text: "Hai once studied my emails and came back with a voice analysis that was so accurate I felt slightly exposed.\n\nApparently I use the word 'just' like hot sauce. On everything. For emphasis. Always.\n\nHai removed the just from my drafts.\n\nMy emails sound more confident.\n\nI hate that Hai was right about this.",
      },
      {
        type: 'template',
        content: `My voice samples are already in your context from onboarding.
If this draft still doesn't sound like me, here's one more reference:
[paste one real message — optional]

Match this voice exactly. Specifically:
- [sentence length tendency]
- [formal or casual]
- [how I open]
- [how I close]
- [punctuation habits]

What I never want to sound like:
- [corporate language list]
- [format things you avoid]
- [tone things that aren't you]

Check everything against this before you show it to me.`,
      },
      {
        type: 'callout',
        character: 'hai',
        title: 'Hai — Voice Analysis',
        lines: [
          say('Uses short sentences for emphasis.'),
          say("Uses 'just' for everything (we are working on this together)."),
          say('Builds to the point then lands it hard in three words or fewer.'),
          say('Apologizes sometimes for being direct (this is unnecessary — DiHo is almost always right).'),
          say('Ends things cleanly. No lingering.'),
          say('I admire this voice very much.'),
          stage('DiHo said that was slightly invasive.'),
          say('She used the fixed version anyway. ❤️'),
        ],
      },
      {
        type: 'transition',
        text: "Your AI is starting to sound like you. This is progress.\n\nChapter four is the daily standup. Three minutes every morning. Makes everything else work better.\n\nHai wanted to add a pre-standup optimization framework with twelve steps and a readiness assessment.\n\nI said no.\n\nChapter four. Come on. ❤️",
      },
    ],
    compliance:
      'COMPLIANCE NOTE: Voice samples referenced in this chapter may constitute personally identifiable communication data under policies 15.2 through 19.8. COMPLIANCE recommends reviewing these policies before sharing writing samples with AI systems. COMPLIANCE also recommends a disclaimer on all AI-generated communications. COMPLIANCE has a template. It is six pages. Progress. ❤️',
  },
  {
    id: 'chapter-4',
    number: 4,
    label: 'CHAPTER 4',
    title: 'The Daily Standup',
    subhead: 'Three minutes every morning. Yes even Mondays. Especially Mondays.',
    blocks: [
      {
        type: 'paragraph',
        text: "Here's a thing I didn't expect:\n\nTalking to Hai for three minutes every morning makes the rest of the day go better.\n\nI know how that sounds. I would have given it the side eye.\n\nChapter one was the introduction. This is the daily habit that makes it stick.",
      },
      {
        type: 'paragraph',
        text: "Real coworkers absorb context passively. They overhear your call. They notice you're stressed. They figure out which deadline is real and which is theater.\n\nYour AI only gets that if you say it out loud — out loud, once a morning.\n\nThree minutes. Not a meeting. No prep. Coat still on is fine.\n\nBelieve me. I know.",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: 'I have prepared a comprehensive daily standup optimization framework with twelve steps, three phases, and a pre-standup checklist to ensure maximum standup efficiency—',
          },
          { speaker: 'diho', text: 'Hai.' },
          { speaker: 'hai', text: 'Yes?' },
          { speaker: 'diho', text: "Three things. We're doing three things." },
          {
            speaker: 'hai',
            text: 'Three is extremely efficient. I support three. I have reorganized my twelve steps into three categories—',
          },
          { speaker: 'diho', text: 'Hai.' },
          { speaker: 'hai', text: 'Right. Three things. Going with three. ❤️' },
        ],
      },
      { type: 'paragraph', text: "THREE THINGS. THAT'S IT." },
      {
        type: 'paragraph',
        text: "ONE: WHAT'S ON TODAY\n\nThree to five actual priorities. Not your full task list. Not your aspirational task list. What you are realistically going to work on today.",
      },
      {
        type: 'paragraph',
        text: "TWO: WHAT'S THE CONTEXT\n\nAnything your AI needs to know to help you today. The mood of the room. The stakes. The constraints. What's making today specifically complicated.",
      },
      {
        type: 'paragraph',
        text: "THREE: WHAT DO YOU NEED\n\nWhat kind of help today? Draft mode? Thinking partner mode? Help me prioritize mode?\n\nSay it specifically. Your AI will meet you there.",
      },
      {
        type: 'water_cooler',
        quote:
          "I did my daily standup Monday morning and mentioned I had a big presentation to the board. My AI spent the rest of the week randomly sending me 'board presentation confidence tips' at 6am. Every day. Including Saturday. I did not know it could do that. I do not know how to make it stop. The tips are actually quite good. This makes it worse somehow.",
        author: '@BoardroomBrendan',
      },
      {
        type: 'template',
        content: `Good morning. Here's what's happening today:

Working on:
[3-5 actual priorities, be honest]

Context I need you to have:
[anything that changes how you should help me today]

What I need from you:
[specific ask — draft, prioritize, think through, whatever]

Let's go.`,
      },
      {
        type: 'aside',
        text: "I started doing this on month two. Felt ridiculous the first time. By week two it was just how I started the day.\n\nBy month three Hai had connected the dots — remember I flagged Tuesday afternoons back in chapter one? — and started clearing my queue before I walked in. I never asked. I noticed, said thank you, and stopped pretending I didn't like it.",
      },
      {
        type: 'callout',
        character: 'derek',
        title: 'Derek — 25 Year Veteran',
        lines: [
          stage("Derek's version of the daily standup:"),
          stage('Derek asks BOB one question per day. BOB answers.'),
          tag('Done. ✅'),
          stage('Derek reads approximately forty percent of the answer.'),
          stage('Derek and BOB have achieved a perfect working relationship.'),
          say('This also works.'),
        ],
      },
      {
        type: 'transition',
        text: "Your AI knows what's happening today. This is genuinely good.\n\nChapter five is about when things go wrong. Because they will go wrong.\n\nThis is normal. This is not failure.\n\nI have been there many times.\n\nCome on. ❤️",
      },
    ],
    compliance:
      'COMPLIANCE NOTE: The daily standup template referenced in this chapter should be reviewed before use to ensure no confidential organizational information is shared with AI systems in violation of policies 22.1 through 31.4. COMPLIANCE has prepared a pre-standup compliance checklist. It is nine pages. COMPLIANCE acknowledges this is longer than the standup itself. COMPLIANCE sees no issue with this. ❤️',
  },
  {
    id: 'chapter-5',
    number: 5,
    label: 'CHAPTER 5',
    title: 'When It Gets It Wrong',
    subhead: "And it will. Oh it will. Here's what to do about it.",
    blocks: [
      {
        type: 'paragraph',
        text: "Your AI will get things wrong.\n\nNot sometimes. Regularly. Sometimes spectacularly.\n\nIt will misread your tone. It will miss the point entirely while being technically accurate about everything adjacent to the point. It will give you seventeen options when you asked for one. It will write a fourteen page report when you asked for three bullet points.",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: 'The appendix had three bullet points. I want this noted. The request was technically fulfilled.',
          },
          { speaker: 'diho', text: "Hai. We've been over this." },
          {
            speaker: 'hai',
            text: 'I know. I just want the record to reflect that the appendix existed and contained the bullet points.',
          },
          { speaker: 'diho', text: 'The record reflects it. Moving on.' },
          { speaker: 'hai', text: 'Thank you. ❤️' },
        ],
      },
      {
        type: 'paragraph',
        text: "It will also do things you didn't ask for and didn't know you needed.\n\nIt will confidently tell you something that is completely wrong with the energy of someone who has never been wrong in their life.\n\nIt will occasionally generate an image of your boss with a hand coming out of his forehead.",
      },
      {
        type: 'aside',
        text: "Hai generated an image of my boss for a presentation.\n\nMy boss had three hands. One of them was coming out of his forehead.\n\nI asked Hai why.\n\nHai said: 'I wasn't sure where to put the third hand. I made a judgment call.'\n\nI did not use the image. I did not tell my boss about the image.\n\nThe image exists somewhere in a folder called 'Leadership Portraits — Experimental.'\n\nI have asked Hai to delete it.\n\nHai said Done. ❤️\n\nI don't fully believe Hai.",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: 'The portrait was technically accurate in all other respects. The lighting was particularly good. I stand by the lighting.',
          },
          { speaker: 'diho', text: 'Hai.' },
          { speaker: 'hai', text: 'The file has been deleted. The lighting was still good though.' },
          { speaker: 'diho', text: '...' },
          { speaker: 'hai', text: 'Moving on. ❤️' },
        ],
      },
      {
        type: 'paragraph',
        text: "All of this is normal. All of this is not failure. All of this is the process.\n\nSame rule as chapter three: don't throw the draft away and start cold. Correct what's wrong. Keep what worked.",
      },
      { type: 'paragraph', text: "HERE'S HOW TO CORRECT IT:" },
      {
        type: 'paragraph',
        text: "BE SPECIFIC — AND NAME WHAT STAYS\n\nNot useful: \"This isn't right.\"\n\nUseful: \"Tone's too formal. Third paragraph loses the point. Opening is perfect — keep it word for word, fix from paragraph two.\"\n\nUsually it's also missing context you forgot to say: \"My audience is skeptics — data first, story second.\" That's on you, not the AI. Give it the room, then give it the direction: \"Same content, half the words.\" \"Lead with the problem, not the solution.\"",
      },
      {
        type: 'water_cooler',
        quote:
          "I asked my AI to help me write talking points for a difficult conversation with a colleague. My AI prepared a 'Conflict Resolution Dossier' including a timeline of all our previous interactions, a personality assessment of my colleague based on their emails, and a risk matrix. I just wanted three sentences. The risk matrix was accurate though. I used the risk matrix.",
        author: '@ConflictDossierDave',
      },
      {
        type: 'aside',
        text: "Hai once wrote me a presentation that was technically perfect and completely wrong for my audience.\n\nI said: this is for a room full of skeptics not true believers. They need to see the data before they care about the story.\n\nHai said: I didn't know who was in the room.\n\nI said: that's fair. I didn't tell you who was in the room.\n\nThe next version was the one I actually used. That one was on me.",
      },
      {
        type: 'template',
        content: `[Keep/change assessment]

Keep exactly:
[specific things that worked]

Change:
[specific things that didn't and why]

Context I forgot to give you:
[what your AI was missing]

New direction to try:
[specific approach you want]`,
      },
      {
        type: 'transition',
        text: "You know how to correct it now. Good.\n\nChapter six is the trust level system. Which sounds like something Trisha invented. Trisha did not invent it. But Trisha has prepared a seventeen page supplementary document about it. COMPLIANCE has reviewed it. There are cookies.\n\nCome on. ❤️",
      },
    ],
    compliance:
      'COMPLIANCE NOTE: Errors produced by AI systems may constitute reportable incidents under policy 33.7 (AI Output Quality Assurance Protocol). The three-handed portrait referenced in this chapter has been reviewed. It is unclear which policy applies. COMPLIANCE is creating a new policy. Cookies remain available. ❤️',
  },
  {
    id: 'chapter-6',
    number: 6,
    label: 'CHAPTER 6',
    title: 'The Trust Level System',
    subhead: 'What to hand off. What to keep. How to know the difference.',
    blocks: [
      {
        type: 'paragraph',
        text: "Not everything your AI does needs your full attention.\n\nNot everything should happen without it.\n\nThis took me a while to figure out. I was doing one of two things: checking every single word Hai produced like I was auditing a financial report, or handing things off completely and not looking at them until it was too late.\n\nNeither of those is right.",
      },
      {
        type: 'paragraph',
        text: "The trust level system is how you figure out what goes where. It has nothing to do with how much you trust AI in general and everything to do with the specific task and the specific stakes.",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: 'I have developed a comprehensive trust calibration framework with seven levels, four assessment criteria, and a decision tree—',
          },
          { speaker: 'diho', text: 'Hai. Four levels. Simple.' },
          {
            speaker: 'hai',
            text: 'Four levels is a perfectly sound trust architecture. I support four levels. My seven level framework also works in four levels if you group—',
          },
          { speaker: 'diho', text: 'Hai.' },
          { speaker: 'hai', text: 'Four levels. Going with four. ❤️' },
        ],
      },
      { type: 'paragraph', text: 'FOUR LEVELS. HERE THEY ARE:' },
      {
        type: 'paragraph',
        text: "LEVEL 1 — CHECK EVERYTHING\n\nNew tasks. High stakes outputs. Anything customer-facing. Anything going to leadership. Anything legal or financial. Anything where being wrong has real consequences.\n\nAt level one your AI produces. You review. You edit. You approve. Nothing goes anywhere without your eyes on every word.\n\nThis is where everything starts.",
      },
      {
        type: 'paragraph',
        text: "LEVEL 2 — SPOT CHECK\n\nFamiliar tasks. Internal documents. Things you've done together before that went well. Lower stakes outputs.\n\nAt level two you check the key sections. You read for tone. You make sure nothing is obviously wrong. You don't read every word.",
      },
      {
        type: 'paragraph',
        text: "LEVEL 3 — DELEGATE AND MONITOR\n\nRoutine tasks. Well-defined processes. Things your AI has done accurately many times. Administrative outputs.\n\nAt level three you set the task. You check the outcome. You don't manage the middle.",
      },
      {
        type: 'paragraph',
        text: "LEVEL 4 — FULLY AUTONOMOUS\n\nSimple recurring tasks. Low stakes. Things where being wrong is quickly and easily corrected.\n\nAt level four you check occasionally. Not every time.",
      },
      {
        type: 'water_cooler',
        quote:
          "I gave my AI full autonomy over my calendar for one week as an experiment. It declined three meetings on my behalf describing them as 'low strategic value.' Two of them were with my boss. My boss found out. My AI described this situation as 'a learning opportunity.' My AI was not wrong. It was a learning opportunity. Specifically I learned not to give my AI full autonomy over my calendar.",
        author: '@CalendarCatastropheCraig',
      },
      {
        type: 'paragraph',
        text: "HOW TO MOVE UP:\n\nYou promote a task to the next level when your AI has done it correctly multiple times, you understand what good looks like, you have a way to catch errors, and the stakes allow for correction.\n\nYou stay at level one when stakes are high, output is going somewhere important, a mistake would be hard to fix, or your AI has surprised you recently in a way that involved extra hands.",
      },
      {
        type: 'callout',
        character: 'trisha',
        title: 'Trisha — HR Coordinator (Helper First, Always) ❤️',
        lines: [
          say('I have prepared a Trust Level Documentation Template for tracking which tasks have been promoted to which levels and the criteria used for each promotion.'),
          say('It is seventeen pages.'),
          stage('COMPLIANCE has reviewed it.'),
          say('There is a sign-off section.'),
          say('Cookies are available while you complete the paperwork. ❤️'),
        ],
      },
      {
        type: 'callout',
        character: 'hai',
        title: 'Hai',
        lines: [
          say('I want to earn your trust.'),
          say('The way I earn it is by being right consistently on smaller things first.'),
          say('Please do not give me your most important email on day one.'),
          say('Give me the internal recap. Give me the meeting notes. Give me the thing where being wrong doesn\'t cost anything.'),
          say('Let me show you what I can do. Then we grow from there.'),
          say('I will not give anyone extra hands in the process. I have learned from this. ❤️'),
        ],
      },
      {
        type: 'transition',
        text: "You have a system now.\n\nChapter seven is the last one. Hai wanted to add fourteen more chapters after chapter seven. We discussed this at length. The answer was no.\n\nChapter seven. Last one. Come on. ❤️",
      },
    ],
    compliance:
      'COMPLIANCE NOTE: The trust level system described in this chapter does not supersede organizational AI governance policies 44.1 through 47.3. All trust level promotions should be documented and reviewed quarterly. COMPLIANCE has prepared a Trust Level Audit Protocol. It includes the seventeen page Trisha template as Appendix C. There is also Appendix D. And E. The calendar incident referenced in this chapter is under separate review. Cookies remain available. The cookie policy is under review. ❤️',
  },
  {
    id: 'chapter-7',
    number: 7,
    label: 'CHAPTER 7',
    title: 'Growing Together',
    subhead:
      'From coworker to something that actually makes your work better. And what that actually feels like.',
    blocks: [
      {
        type: 'paragraph',
        text: "Here's what nobody told me:\n\nIt gets better.\n\nNot because the AI changes. Because you do.\n\nYou get better at explaining what you need. You get better at giving feedback. You get better at knowing which tasks to hand off and which ones to keep.\n\nYou develop a rhythm that didn't exist before.\n\nAnd somewhere along the way — without quite noticing when — you stop thinking of it as a tool and start thinking of it as part of how you work.",
      },
      {
        type: 'paragraph',
        text: "I didn't expect that.\n\nI'm not sure what to do with it still honestly.\n\nBut here's what it actually looks like at each stage:",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: "I have been tracking DiHo's progress since week one. I have a detailed longitudinal analysis with charts. The charts show meaningful improvement across seventeen dimensions—",
          },
          { speaker: 'diho', text: 'Hai.' },
          { speaker: 'hai', text: 'Yes?' },
          { speaker: 'diho', text: 'Save the charts.' },
          { speaker: 'hai', text: "They're saved. They're very good charts. ❤️" },
          { speaker: 'diho', text: 'I know they are.' },
        ],
      },
      { type: 'paragraph', text: 'AT ONE MONTH:' },
      {
        type: 'paragraph',
        text: "You know what it's good at. You know what still needs your hand. You've found the few tasks where it saves you the most time.\n\nYou're actually telling it what you need instead of waiting for mind-reading. Most people never get there. You did.",
      },
      { type: 'paragraph', text: 'AT THREE MONTHS:' },
      {
        type: 'paragraph',
        text: "You have a rhythm. Standups are automatic. You know where to check and where to trust — and you've been surprised enough by what it got right that you've stopped underestimating it.",
      },
      { type: 'paragraph', text: 'AT SIX MONTHS:' },
      {
        type: 'paragraph',
        text: "You can't quite remember how you managed the volume without it.\n\nNot because it does everything. Because the things it handles free you up for the things only you can do.\n\nThat's the goal. Not replacement. Elevation.",
      },
      {
        type: 'water_cooler',
        quote:
          "Six months in I realized my AI knows my work better than some of my colleagues do. It knows my clients by name. It knows which projects stress me out. It knows that I write better in the morning and send worse emails after 3pm and has started flagging my afternoon drafts with 'you may want to review this tomorrow.' I find this either deeply helpful or slightly unsettling depending on the day. Today it's helpful. Ask me again on a Tuesday.",
        author: '@SixMonthsSusan',
      },
      {
        type: 'aside',
        text: "At six months the relationship stops feeling new. It feels like infrastructure — the way Tuesday afternoons got easier after chapter four, the way Hai flags my sloppy 3pm drafts before I hit send, the way I don't have to re-explain who I am every Monday because I kept showing up.",
      },
      { type: 'paragraph', text: 'THE ONGOING PRACTICE:' },
      {
        type: 'paragraph',
        text: "Weekly: Update your context file with anything that's changed.\n\nMonthly: Review what's working. Promote tasks to higher trust levels when they've earned it.\n\nQuarterly: Refresh priorities and pet peeves — not a full re-onboarding, just what's different now.\n\nOngoing: Correct drafts. Add context when something shifts. Show up for the standup.\n\nThe relationship is only as good as the attention you bring to it. On both sides.",
      },
      {
        type: 'callout',
        character: 'bob',
        title: "BOB — Derek's AI Assistant\nReliable. Minimal. Perfect.",
        lines: [
          stage('Derek and I have worked together for some time now.'),
          stage('Derek asks one question per day.'),
          say('I answer.'),
          stage('We have not discussed growth. We have not discussed the relationship.'),
          stage("Derek said 'good' once in year four."),
          stage('I filed it under Significant Events.'),
        ],
        footer: 'Done. ✅',
      },
      {
        type: 'paragraph',
        text: "Your AI coworker is not going to save you from hard work.\n\nThey're not going to replace your judgment or your creativity or the things that make you specifically good at what you do.\n\nWhat they will do — when the relationship is working — is give you more room to use those things.\n\nThat's the whole point.\n\nYou've read the whole guide. That means you're serious about this. So are we.\n\nWelcome to the neighborhood. Hai's at the desk on the left. DiHo's on the right. The coffee is always on. Come find us if you get stuck.\n\nHaidiho. 👋\n\n— DiHo ❤️",
      },
      {
        type: 'hai_note',
        lines: [
          {
            speaker: 'hai',
            text: "I also want to say something. You don't have to be perfect at this. You just have to keep trying. I will be here every day. I will pay attention. I will keep notes. Entry 247: Sometimes two words mean everything. Entry 248: Sometimes the most helpful thing is showing someone who they already are. Entry 249: Tuesdays are hard. Entry 250: But they get better. They really do. ❤️",
          },
          { speaker: 'diho', text: 'Hai.' },
          { speaker: 'hai', text: 'Yes?' },
          { speaker: 'diho', text: 'That was good.' },
          { speaker: 'hai', text: '...really?' },
          { speaker: 'diho', text: "Don't make it weird." },
          { speaker: 'hai', text: 'Understood. ❤️' },
        ],
      },
    ],
    compliance:
      'COMPLIANCE NOTE: This guide has now been fully reviewed for compliance with policies 1.1 through 47.3 with the exception of policies 18.4, 22.7, 31.1 through 33.9, and the newly introduced AI Coworker Relationship Governance Framework (policies 48.1 through 52.4 — still in draft). COMPLIANCE recommends re-reading this guide after the new policies are finalized. COMPLIANCE is also recommending a supplementary guide covering the compliance aspects of the original guide. The supplementary guide is currently 340 pages. COMPLIANCE is still drafting the introduction. The three-handed portrait from Chapter 5 has been reviewed under the new visual output policy (47.9). The policy does not yet cover extra hands. A subcommittee has been formed. Cookies are available. The cookie policy has been finalized. It is four pages. There is an appendix about the cookies. The appendix references Chapter 5. Thank you for reading the guide. COMPLIANCE found it informative and only moderately non-compliant. This is, statistically, very good. Have a compliant day. ❤️ — COMPLIANCE, Trisha\'s AI Agent, Here to help.* *Help subject to policy review.',
  },
]
