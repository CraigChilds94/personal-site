---
# The role that hasn't happened yet: dashed placeholders for the company, plus what I'd bring to it.
# Everything under "What I'd bring" comes from data/resume.yaml and the Shopify and Analog Republic
# timelines, so keep it in step with those. See archetypes/experience.md for every field.
title: "Your company here"
description: "The next chapter of my journey doesn't have a company name yet. Here's what I'd bring to it, from more than 12 years building for the web, including 5+ years at Shopify and the past 3 years working with AI agents."
draft: false
placeholder: true

company: Your company
role: Senior Full-Stack Developer, looking for my next challenge
period: Next
location: Brighton, UK

headline: Your next chapter could start here
accent: here

stats:
  - {value: "12+", label: years in the industry}
  - {value: "5+", label: years at Shopify}
  - {value: "100M+", label: "product reviews on Shop, scaled from zero"}
  - {value: "3", label: years building with AI agents}

actions:
  - {label: Read my resumé, url: /resume/}
  - {label: Get in touch, url: "mailto:hi@craigchilds.me"}

chapters:
  - marker: Day one
    label: Getting started
    title: Learning your world
    accent: world
    moments:
      - placeholder: true
        when: Day one
        title: Your team, your product
        body: |
          This space is for my first day with your team: meeting everyone, learning how your product works and finding where I can help first.
        image:
          placeholder: Your product here

      - kicker: What I'd bring
        title: At home in new domains
        body: |
          More than five years at an agency taught me to get to grips with new industries and tech stacks, from fan clubs for music artists to a multi-site CMS for luxury yachts and a university health study.
        tags: [Agency, Many industries]

  - marker: Build
    label: Building
    title: Products that scale
    accent: scale
    intro: I've built features from an empty table, and kept them working as they grew.
    moments:
      - kicker: From my time at Shopify
        key: true
        title: Built from zero, scaled to hundreds of millions
        body: |
          As part of the team, I helped build the Shop app's reviews functionality from the ground up, and then scale it from nothing to hundreds of millions of product reviews.
        stats:
          - {value: "0", label: reviews when we started}
          - {value: "100M+", label: product reviews}

      - kicker: What I'd bring
        title: Across the whole stack
        body: |
          I've worked from the database to the front end and the infrastructure underneath, including GraphQL APIs, React and TypeScript front ends, Laravel applications and services on Kubernetes.
        tags: [PHP, Laravel, React, TypeScript, GraphQL, Go, Docker, Kubernetes, AWS]

      - placeholder: true
        key: true
        kicker: Coming soon
        title: Your next big launch
        body: |
          The feature your customers are waiting for. This one is yours to write.
        image:
          placeholder: Your launch here

  - marker: AI
    label: Building with AI
    title: Fluent in working with AI
    accent: AI
    intro: AI has been part of what I build, and how I build it, for the past three years.
    moments:
      # The terminals are illustrations of the kind of work, not real sessions or Shopify code
      - kicker: What I'd bring
        key: true
        decode: true
        stream: true
        title: Three years with AI agents and tooling
        body: |
          For the past three years I've worked extensively with AI agents and AI development tooling, both in the products I build and in the way I build them.
        terminal:
          title: agent — ~/your-product
          caption: An illustration of working alongside a coding agent.
          lines:
            - prompt: Add tests for the checkout flow and fix anything that fails
            - think: Thinking
            - tool: read src/checkout/flow.ts
            - tool: write src/checkout/flow.test.ts
            - tool: run pnpm test
            - out: "1 failing: totals ignore the discount when shipping is free"
            - tool: edit src/checkout/totals.ts
            - tool: run pnpm test
            - ok: All tests passing, ready for review
        stats:
          - {value: "3", label: years working with AI agents}
        tags: [AI agents, AI development tooling]

      - kicker: From my time at Shopify
        decode: true
        title: Agentic pipelines
        body: |
          At Shopify I built agentic pipelines to generate content and organise products within the Shop app.
        terminal:
          title: pipeline.yml
          caption: An illustration of an agentic pipeline, not Shopify's code.
          lines:
            - code: "# each step is an agent with one job"
            - code: "pipeline: organise-products"
            - code: "steps:"
            - code: "  - agent: classify"
            - code: "    input: \"new products\""
            - code: "    output: categories"
            - code: "  - agent: write"
            - code: "    input: categories"
            - code: "    output: \"collection copy\""
            - code: "  - check: review"
            - code: "    on_fail: retry"
            - ok: Products organised
        tags: [Agents, AI, Catalogue]

  - marker: Lead
    label: Leading
    title: Raising the bar for the team
    accent: team
    intro: Alongside the code, I've helped teams work better together.
    moments:
      - kicker: What I'd bring
        title: Leading projects and technical designs
        body: |
          At Shopify I oversaw and took the lead on multiple projects and technical designs across all of the teams I worked on.

      - kicker: What I'd bring
        title: Modernising how a team works
        body: |
          At Analog Republic I introduced CI/CD and automated testing, Docker, Laravel and React, and worked to level up the team on them.
        tags: [CI/CD, Testing, Docker]

      - kicker: What I'd bring
        title: Keeping things running
        body: |
          I've worked on resiliency and monitoring, and kept up on-call and deployment captain responsibilities.
        tags: [Resiliency, Monitoring, On-call]

      - kicker: What I'd bring
        title: Growing the people around me
        body: |
          I've mentored and onboarded new team members, taken part in interview processes, and guided newer hires and contractors until they could work independently.
        tags: [Mentoring, Onboarding, Interviewing]

outro:
  eyebrow: Let's talk
  title: Let's write this chapter together
  accent: together
  text: If you're hiring and this sounds like what your team needs, I'd love to hear from you. My resumé has the full details.
  actions:
    - {label: Get in touch, url: "mailto:hi@craigchilds.me"}
    - {label: Read my resumé, url: /resume/}
    - {label: Connect on LinkedIn, url: "https://www.linkedin.com/in/craigchilds-94/"}
---
