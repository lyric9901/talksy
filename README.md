# Talksy

# AI Conversation Coach + Instagram Profile Analyzer

**Product Type:** AI-powered communication & conversation coaching SaaS
**Platform:** Web / PWA, mobile-responsive
**Primary Stack:** Next.js/React, TypeScript, Tailwind/shadcn, Supabase, AI API, Vercel
**Status:** Product Requirements Document
**Version:** 1.0

---

## 1. Product Overview

Build an AI-powered **conversation coach** that helps users understand conversations, generate natural replies, practice communication, and improve their communication skills.

The product should also include an **Instagram Profile Analyzer** that analyzes publicly accessible profile information or user-provided screenshots/content and identifies conversation topics, interests, profile themes, and natural conversation opportunities.

The product should feel like a **personal communication coach**, not merely an AI "rizz generator."

### Core Product Loop

```text
User receives a conversation
        ↓
Analyze conversation
        ↓
Understand context
        ↓
Generate possible responses
        ↓
Explain why each response works
        ↓
User sends response
        ↓
User returns with outcome
        ↓
AI learns communication patterns
        ↓
User improves over time
```

---

# 2. Product Goals

## Primary Goals

1. Help users understand conversations.
2. Generate natural responses matching the user's communication style.
3. Teach users *why* a response works.
4. Allow users to practice conversations with AI.
5. Analyze public Instagram profiles for conversation-relevant information.
6. Identify useful conversation topics from publicly available content.
7. Track communication improvement over time.
8. Create a personalized AI communication coach.

## Secondary Goals

* Provide a simple, fast interface.
* Support screenshot-based analysis.
* Provide personalized response styles.
* Maintain strong privacy controls.
* Create a freemium monetization model.

---

# 3. Target Users

## Primary User

People who:

* Overthink messages.
* Don't know what to reply.
* Struggle to start conversations.
* Want to become better conversationalists.
* Want feedback on their communication.
* Want help understanding conversation dynamics.
* Want to practice difficult conversations.

## Secondary Users

* Students.
* Young professionals.
* Social-media users.
* People improving communication skills.
* Users practicing confidence and social interaction.

The product should **not** be designed around helping minors access adult dating platforms or sexual interactions.

---

# 4. Core Features

## 4.1 AI Chat Analyzer

Users can upload a screenshot or provide conversation text.

### Input

Supported:

* Screenshot
* Multiple screenshots
* Copied conversation text
* Pasted messages

### AI Processing

The system should identify:

* Message order.
* Speaker separation.
* Conversation topic.
* Tone.
* Recent context.
* Questions asked.
* Questions answered.
* Topic changes.
* Conversation momentum.
* Potential misunderstandings.
* Whether the conversation appears balanced.
* Areas where the user could improve.

### Output

```text
Conversation Overview

Topic:
Current tone:
Conversation momentum:
Question balance:
Topic diversity:
Potential awkwardness:
Suggested next action:
```

### Important

The system must not claim certainty about another person's feelings, intentions, attraction, or future behavior.

Instead use language such as:

* "Possible interpretation"
* "This may suggest"
* "One reasonable reading is"

---

# 5. AI Reply Generator

Generate multiple possible responses based on the conversation.

### Response Categories

* Natural
* Friendly
* Funny
* Confident
* Casual
* Short
* Thoughtful
* Topic-changing
* Follow-up question

### Each response should include

```text
Suggested Reply

[Generated response]

Why:
[Short explanation]

Conversation goal:
[Goal]

Risk:
Low / Medium / High
```

### Actions

* Copy
* Regenerate
* Make shorter
* Make longer
* Make more casual
* Make more like me
* Explain
* Generate alternatives

---

# 6. Personal Writing Style

The system should learn the user's communication style from user-provided messages.

Analyze:

* Average message length.
* Vocabulary.
* Emoji usage.
* Punctuation.
* Slang.
* Formality.
* Humor style.
* Question frequency.
* Typical sentence structure.

### Style Profile

```text
Message Length: Short
Formality: Casual
Emoji Usage: Medium
Humor: High
Questions: Medium
Vocabulary: Casual
```

The AI should use this style when generating replies.

### User Controls

* Use my style
* Neutral AI style
* Reset my style
* Edit style preferences

---

# 7. Conversation Coach

The coach should explain communication principles instead of only generating messages.

### Example

```text
Observation

You answered their question but didn't give them
anything easy to respond to.

Suggestion

Add a short follow-up question or related detail.

Skill:
Conversation continuation
```

### Coaching Areas

* Asking better questions.
* Following up.
* Listening.
* Topic transitions.
* Avoiding repetitive questions.
* Avoiding overly long messages.
* Giving useful context.
* Keeping conversations balanced.
* Handling awkward moments.
* Ending conversations naturally.
* Starting conversations.
* Handling misunderstandings.

---

# 8. Conversation Simulator

Users can practice conversations with AI.

### Scenarios

* New conversation
* New friend
* Group conversation
* Difficult conversation
* Awkward conversation
* Apology
* Asking for help
* Making plans
* Introducing yourself
* Keeping a conversation going
* Changing topic
* Ending a conversation politely

### AI Behavior

The AI should dynamically respond based on:

* User's message.
* Scenario.
* Difficulty.
* Conversation history.

### Difficulty

```text
Easy
Normal
Hard
Expert
```

### Post-Practice Analysis

After the simulation:

```text
Communication Score

Conversation Flow      82
Follow-up Questions    71
Naturalness            88
Topic Development     76
Clarity                91
```

Then provide:

* Strengths.
* Weaknesses.
* Specific examples.
* One improvement challenge.

---

# 9. Conversation Intelligence

Analyze an entire conversation and produce a structured report.

### Metrics

* Conversation flow.
* Reciprocity.
* Topic diversity.
* Response consistency.
* Question balance.
* Average message length.
* Conversation momentum.
* Potential misunderstandings.
* User communication patterns.

### Example

```text
Conversation Health

Flow                 8.1/10
Reciprocity          7.4/10
Topic Variety        6.8/10
Clarity              8.8/10
Follow-ups           6.9/10
```

These scores represent **conversation characteristics**, not predictions about another person's emotions or intentions.

---

# 10. Conversation Context Memory

Users should be able to create separate conversation profiles.

Example:

```text
Conversation

Name:
Alex

Context:
Met through school

Known Topics:
Gaming
Football
Movies

Previous Topics:
School
Games
Weekend plans
```

The AI can use saved context in future analyses.

### User Controls

* Create conversation.
* Rename conversation.
* Delete conversation.
* Clear memory.
* Export data.
* Disable memory.

---

# 11. Instagram Profile Analyzer

## Purpose

Analyze **publicly accessible Instagram information** or user-provided screenshots/content to identify useful conversation topics.

This feature should not bypass private accounts, authentication barriers, rate limits, or platform restrictions.

---

## Input

Users can provide:

### Option A

Public Instagram profile URL.

Example:

```text
https://instagram.com/example
```

### Option B

Instagram username.

```text
@example
```

### Option C

Upload screenshots.

### Option D

Paste public profile information/captions.

---

# 12. Instagram Data Pipeline

```text
User Input
    ↓
Validate URL / Username
    ↓
Determine Available Data
    ↓
Retrieve Only Permitted Public Information
    ↓
Normalize Data
    ↓
AI Analysis
    ↓
Generate Structured Profile Report
```

The application must comply with Instagram/Meta's current developer policies and permitted API access.

Do not build unauthorized scraping or private-account access mechanisms.

---

# 13. Instagram Profile Analysis

Analyze only information that is publicly accessible or explicitly provided by the user.

### Profile

* Username.
* Display name.
* Public bio.
* Public profile information where permitted.

### Public Content

Where permitted:

* Captions.
* Public posts.
* Publicly visible content themes.
* Repeated topics.
* Publicly visible interests.

### AI Analysis

```text
Profile Summary

Main Interests:
Technology
Gaming
Travel

Content Themes:
Gaming
Friends
Travel

Possible Conversation Topics:
1. Gaming
2. Recent travel content
3. Technology
```

The AI must clearly distinguish:

**Observed information**

from

**AI interpretation**

---

# 14. Profile Conversation Opportunities

Generate conversation topics based on observable content.

Example:

```text
Conversation Opportunities

🔥 Strong
Gaming appears repeatedly in public content.

🟢 Good
Several posts appear related to travel.

🟡 Possible
Technology appears occasionally.
```

Do not claim:

> "This person definitely likes gaming."

Use:

> "Gaming appears repeatedly in the publicly available content."

---

# 15. Profile-Based Conversation Starters

Generate natural conversation starters based on public information.

### Categories

* Casual.
* Curious.
* Friendly.
* Topic-specific.
* Short.
* Question-based.

Each suggestion should include:

```text
Conversation Starter

[Generated text]

Based on:
[Observable public information]

Why:
[Short explanation]
```

Avoid manipulative tactics, deceptive impersonation, or pretending to know private information.

---

# 16. Profile Analyzer Dashboard

```text
Profile Analyzer

┌──────────────────────────┐
│ Profile Overview         │
├──────────────────────────┤
│ Main Topics              │
│ Content Themes           │
│ Public Interests         │
│ Conversation Ideas       │
│ Suggested Starters       │
└──────────────────────────┘
```

### Actions

* Analyze again.
* Generate more topics.
* Generate starter.
* Save profile.
* Delete analysis.
* Start conversation analysis.

---

# 17. "Make It Sound Like Me"

Every generated response should optionally be rewritten according to the user's personal style.

Example:

```text
AI Version
"That sounds really interesting. How did you get into it?"

Your Style
"wait how did u even get into that 😂"
```

The second response should only be generated when it genuinely reflects the user's established style.

---

# 18. AI Explain Mode

Every important AI recommendation should have an optional explanation.

### Example

```text
Why this works

It references something already discussed,
so it doesn't feel like you're randomly changing
the subject.

It also gives the other person an easy way
to respond.
```

This reinforces the coaching aspect.

---

# 19. Progress System

Track communication improvement over time.

### Dashboard

```text
Your Progress

Conversation Flow       ↑ 12%
Follow-ups              ↑ 18%
Clarity                 ↑ 8%
Topic Development       ↑ 14%
```

### Weekly Report

```text
This Week

Strongest Skill:
Clarity

Needs Improvement:
Follow-up questions

Completed:
7 conversations
3 practice sessions

Next Challenge:
Ask one relevant follow-up before
changing topics.
```

Avoid turning scores into judgments about popularity, attractiveness, or social worth.

---

# 20. Daily Coaching

Optional daily coaching system.

### Daily Challenge Examples

* Ask a follow-up question.
* Give a more detailed answer.
* Avoid changing topics too quickly.
* Practice ending a conversation naturally.
* Practice introducing a new topic.

### Goal

Turn the product into a learning system rather than a one-time AI generator.

---

# 21. Home Dashboard

```text
┌─────────────────────────────────────┐
│ Good evening 👋                     │
│                                     │
│ What are you working on?            │
│                                     │
│ [📸 Analyze Chat]                   │
│ [✍️ Generate Reply]                 │
│ [🔍 Analyze Profile]                │
│ [🎭 Practice]                       │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ 🧠 Today's Coaching                 │
│ Improve your follow-up questions.  │
│                                     │
│ 📊 Your Progress                    │
│ Conversation: 82                    │
│ Clarity: 88                         │
└─────────────────────────────────────┘
```

---

# 22. Navigation

### Desktop

```text
Dashboard
Chats
Profile Analyzer
Practice
Coach
Progress
History
Settings
```

### Mobile

Bottom navigation:

```text
Home | Analyze | Practice | Coach | Profile
```

---

# 23. History

Store previous analyses where the user chooses to save them.

### History Types

* Chat analysis.
* Generated replies.
* Profile analyses.
* Practice sessions.
* Coaching reports.

### Actions

* Open.
* Rename.
* Delete.
* Search.
* Filter.

---

# 24. Authentication

Use Supabase Auth.

### Supported

* Email/password.
* Google OAuth.
* Optional guest mode for basic analysis.

### Guest Users

Guest users can:

* Try limited analyses.
* Generate limited replies.
* Experience the product before registering.

---

# 25. Database

Use Supabase PostgreSQL.

### Tables

```text
users
profiles
conversations
conversation_messages
conversation_analyses
generated_replies
profile_analyses
practice_sessions
coaching_reports
user_style_profiles
usage_records
subscriptions
user_settings
```

---

# 26. Suggested Database Relationships

```text
User
 │
 ├── Conversations
 │    ├── Messages
 │    ├── Analyses
 │    └── Replies
 │
 ├── Profile Analyses
 │
 ├── Practice Sessions
 │
 ├── Coaching Reports
 │
 └── Style Profile
```

---

# 27. AI Architecture

Use a server-side AI layer.

```text
Frontend
   ↓
Backend API
   ↓
Input Validation
   ↓
Context Builder
   ↓
AI Model
   ↓
Structured JSON
   ↓
Validation
   ↓
Frontend
```

Never expose AI API keys in the browser.

---

# 28. AI Output Schema

The backend should request structured output similar to:

```json
{
  "summary": "",
  "tone": "",
  "conversation_state": "",
  "observations": [],
  "suggestions": [
    {
      "text": "",
      "style": "",
      "reason": "",
      "risk": ""
    }
  ],
  "coaching": {
    "strength": "",
    "improvement": ""
  }
}
```

The frontend should render the structured result rather than parsing random AI prose.

---

# 29. Privacy & Security

Privacy is a core product requirement because users may upload private conversations.

### Requirements

* Encrypt data in transit.
* Use secure authentication.
* Never expose API keys client-side.
* Use Row Level Security in Supabase.
* Users can delete their data.
* Users can delete individual conversations.
* Users can clear AI memory.
* Clearly explain data retention.
* Do not use private conversations for model training by default.
* Minimize stored conversation content where possible.
* Do not collect unnecessary personal information.

### Sensitive Information

The system should avoid inferring or labeling sensitive personal characteristics from profile content.

---

# 30. Instagram Safety & Compliance

The system must:

* Analyze only permitted data.
* Respect Instagram/Meta API restrictions.
* Never bypass private profiles.
* Never request Instagram passwords.
* Never attempt authentication-token theft.
* Never bypass rate limits.
* Never scrape restricted/private information.
* Clearly identify the source of analyzed information.

If a username cannot be legally/technically analyzed:

```text
We couldn't access enough public information
to analyze this profile.

Try uploading screenshots of the public profile
instead.
```

---

# 31. Monetization

## Free Tier

Example:

* 5 chat analyses/month.
* 10 generated replies/month.
* 2 profile analyses/month.
* 1 practice session/day.
* Basic coaching.

## Pro Tier

Unlimited or substantially higher limits:

* Advanced chat analysis.
* Profile analysis.
* Personal writing style.
* Conversation memory.
* Advanced practice.
* Progress tracking.
* Detailed coaching.
* History.

## Credit System

AI-heavy operations can consume credits.

Example:

```text
Basic Analysis       1 credit
Deep Analysis        3 credits
Profile Analysis     3 credits
Practice Session     2 credits
```

Exact pricing should be determined after measuring actual AI/API costs.

---

# 32. Onboarding

### Screen 1

```text
Become better at conversations.
Not better at copying AI messages.
```

### Screen 2

Choose goals:

* Start conversations.
* Keep conversations going.
* Become more confident.
* Improve communication.
* Practice difficult conversations.

### Screen 3

Optional style setup:

User provides sample messages.

AI creates a style profile.

### Screen 4

First free analysis.

---

# 33. UX Principles

The interface should be:

* Fast.
* Minimal.
* Modern.
* Mobile-first.
* Dark-mode friendly.
* Easy to understand.
* Low cognitive load.

Avoid cluttering the UI with dozens of AI controls.

### Visual Style

* Premium SaaS aesthetic.
* Rounded cards.
* Strong typography.
* Subtle animations.
* Clear hierarchy.
* Minimal gradients.
* High-quality empty states.
* Streaming AI responses where useful.

---

# 34. Error Handling

### Invalid Instagram URL

```text
That doesn't look like a valid Instagram profile.
```

### Profile unavailable

```text
We couldn't access this profile.
Try a public profile or upload screenshots.
```

### AI failure

```text
Analysis failed.

Your content wasn't lost.
Try again.
```

### Rate limit

```text
You've reached your current analysis limit.
```

### Unsupported content

```text
We don't have enough information to make
a reliable analysis.
```

---

# 35. Analytics

Track product usage without storing unnecessary private content.

### Events

```text
signup
onboarding_complete
chat_analysis_started
chat_analysis_completed
reply_generated
reply_copied
profile_analysis_started
profile_analysis_completed
practice_started
practice_completed
subscription_started
subscription_cancelled
analysis_failed
```

### Key Metrics

* Activation rate.
* First analysis completion.
* Reply copy rate.
* Daily active users.
* Weekly active users.
* Retention.
* Free → Pro conversion.
* Average analyses/user.
* AI cost/user.
* Profile-analysis usage.
* Practice-session completion.

---

# 36. MVP Scope

The first version should **not** attempt to build everything.

## MVP

### Must Have

* Authentication.
* Dashboard.
* Screenshot upload.
* Chat analysis.
* Reply generation.
* Multiple reply styles.
* Basic coaching.
* Profile URL/username input.
* Permitted public profile analysis.
* Screenshot fallback for profile analysis.
* Basic history.
* Usage limits.
* AI API integration.
* Supabase database.
* Privacy controls.

### V2

* Personal writing style.
* Conversation memory.
* Conversation simulator.
* Progress tracking.
* Daily challenges.
* Advanced profile analysis.
* Subscription system.
* Advanced analytics.

### V3

* Voice conversation practice.
* Advanced personalized coaching.
* More communication scenarios.
* Deeper behavioral feedback.
* Additional social-platform integrations where permitted.

---

# 37. Recommended MVP User Flow

```text
Landing Page
      ↓
Sign Up / Try Free
      ↓
Dashboard
      ↓
Analyze Chat
      ↓
Upload Screenshot
      ↓
AI understands conversation
      ↓
Conversation Summary
      ↓
3 Reply Suggestions
      ↓
User selects reply
      ↓
"Make it sound like me"
      ↓
Copy
      ↓
Coach explains communication principle
      ↓
User improves
```

### Profile Flow

```text
Dashboard
      ↓
Profile Analyzer
      ↓
Paste public Instagram URL
      ↓
Validate access
      ↓
Retrieve permitted public data
      ↓
Analyze
      ↓
Profile Overview
      ↓
Interests / Content Themes
      ↓
Conversation Topics
      ↓
Natural Conversation Starters
```

---

# 38. Competitive Differentiation

Do **not** position the product as:

> "AI that gives you rizz."

Position it as:

> **"An AI communication coach that helps you understand conversations, respond naturally, and actually get better at talking to people."**

### Competitive moat

```text
Generic AI
     ↓
Generates message

Your Product
     ↓
Understands conversation
     ↓
Understands user's style
     ↓
Suggests response
     ↓
Explains response
     ↓
Tracks communication patterns
     ↓
Coaches improvement
```

The long-term advantage is **personalization + coaching data + communication history**, not simply access to an LLM.

---

# 39. Success Criteria

The MVP is successful if users repeatedly return because the product helps them communicate better.

### Initial targets

* 60%+ onboarding completion.
* 50%+ first-analysis completion.
* 30%+ users return for another analysis.
* 20%+ generated replies copied.
* 15%+ users try coaching/practice.
* <5% analysis failure rate.
* Low AI cost relative to subscription revenue.

These are initial product targets, not guaranteed benchmarks.

---

# 40. Final Product Definition

The product is a **personal AI communication coach** with four major pillars:

```text
             AI COMMUNICATION COACH
                       │
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
   ANALYZE          RESPOND          PRACTICE
       │               │               │
   Understand       Generate         Simulate
   conversations    naturally        conversations
       │               │               │
       └───────────────┼───────────────┘
                       ↓
                    IMPROVE
                       │
                Coaching + Progress
                       │
                       ↓
             PROFILE ANALYZER
                       │
             Public profile data
                       ↓
              Topics + Interests
                       ↓
             Conversation ideas
```

The product should optimize for **better communication**, not manipulation or fake certainty about other people's feelings. The AI is the coach, not an omniscient relationship fortune teller wearing a hoodie.



for that open router key use Gemma 4 26B A4B free model (primary) and gemini-2.5-flash-lite (secondary) . keep in mind im making this app completely for free and make the app mobile friendly and later ill be using google ads sense for monetization but it should not affect the user experience

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9426170f-ae09-4f3b-9b90-62f251bf3784).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
