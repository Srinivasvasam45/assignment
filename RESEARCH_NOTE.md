# Research Note

## The learner problem

Practicing Low-Level Design is easy to start but hard to evaluate. A
learner can design a Parking Lot or Elevator system and still not know
whether their class responsibilities, coupling, and abstractions are
actually good — because unlike DSA problems, LLD rarely has one "correct"
answer to check against.

## Approaches researched

- **LowLevelDesignMastery** (indie product) — an in-browser LLD playground
  with AI-powered feedback and class-diagram visualization across multiple
  languages, plus spaced-repetition flashcards for revision.
- **AlgoMaster.io / community GitHub LLD repositories** — large curated
  banks of LLD problems with reference solutions and progress tracking,
  but no submission or personalized feedback loop — the learner reads a
  model answer rather than getting evaluated on their own.
- **Grokking-style courses (Design Gurus, etc.)** — structured curriculum
  content covering OOP principles and patterns, but course-based rather
  than a practice-submit-feedback loop.

## Gaps identified

1. Most tools are either a static problem bank (no feedback on *your*
   solution) or a feedback tool that reduces the result to a single score
   without pointing to specific evidence in the submission.
2. None of the researched tools track *attempt history* in a way that
   surfaces a learner's recurring weaknesses across multiple problems.
3. Existing AI-feedback tools don't clearly separate what's deterministic
   (structure, completeness) from what genuinely needs judgment (design
   quality) — this matters because unconstrained "rate this design" prompts
   produce inconsistent, unhelpful scores.

## Product direction

Build a narrow practice loop — problem → attempt → submission → rubric-based
AI feedback → history → retry — where feedback is always tied to specific
evidence in the learner's own submission, scored against a fixed set of
LLD-relevant dimensions rather than a single opaque number. Keep the
domain design itself extensible (pluggable submission formats and
evaluators) since the biggest gap in existing tools was rigidity, not lack
of features.
