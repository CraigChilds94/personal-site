---
# DRAFT: keep draft: true until the TODO notes below are done. While it's a draft, the Shopify
# card stays live on the home page without its timeline link. See it with `pnpm preview`.
#
# Everything here comes from data/resume.yaml, plus what's publicly visible at shop.com/gift-shop.
# Chapters are grouped by theme because exact dates aren't known; Gift Shop is last because it's the
# most recent. The Gift Shop screenshots are my own; the other illustrations are original artwork drawn for this page. See archetypes/experience.md for every field.
title: "Senior Software Engineer at Shopify"
description: "More than five years at Shopify working on Shop, from building product reviews from the ground up to the Gift Shop on Shop.com."
draft: true
theme: shop
font: "Instrument+Sans:wght@400;500;600;700"

company: Shopify
website: https://www.shopify.com/
role: Senior Software Engineer, working on Shop
started: 2021-01-01
ended: 2026-12-31

headline: From zero reviews to hundreds of millions
accent: millions

stats:
  - {value: "5+", label: years on Shop}
  - {value: "100M+", label: "product reviews, up from zero"}

chapters:
  - marker: "2021"
    label: The start
    title: Joining the Shop team
    accent: Shop
    moments:
      - when: "2021"
        title: From many clients to one product
        body: |
          After six years of agency work across a huge range of clients, I joined Shopify in 2021 to work on Shop, Shopify's leading marketplace app.

          I got to work with incredible teams there for more than five years.
        # TODO: what was your first project, and what surprised you about the scale?

  - marker: Reviews
    label: Built from nothing
    title: Reviews from the ground up
    accent: up
    intro: Some of the most satisfying work is starting with an empty table and watching it fill.
    moments:
      - kicker: Product reviews
        key: true
        title: Zero to hundreds of millions of reviews
        body: |
          As part of the team, I helped build the reviews functionality into the Shop app from the ground up, and then scale it from nothing to hundreds of millions of product reviews.
        # TODO: this is the headline of the page, so it deserves your story: the hardest scaling
        # problem, a decision you're proud of, the moment it took off.
        image:
          src: /media/timelines/shopify/reviews.svg
          alt: Illustration of review cards with five purple stars, stacked higher and higher from left to right
          ratio: 21/9
        stats:
          - {value: "0", label: reviews when we started}
          - {value: "100M+", label: product reviews}

  - marker: Shopping
    label: Across the app
    title: The moments around a purchase
    accent: purchase
    intro: Shop follows people from finding something they love to it arriving at the door.
    moments:
      - kicker: After the purchase
        title: Tracking
        body: |
          I worked on the Tracking features within the app, the part of Shop people open when they're waiting for something to arrive.
        # TODO: what did you build here?
        image:
          src: /media/timelines/shopify/tracking.svg
          alt: Illustration of a parcel travelling along a dotted route towards a location pin
        tags: [Tracking, Mobile]

      - kicker: Growth
        title: Cart and checkout experiments
        body: |
          Growth and general marketplace features, including experiments on cart and checkout.
        # TODO: an experiment that surprised you would make this one.
        image:
          src: /media/timelines/shopify/checkout.svg
          alt: Illustration of two versions of a checkout screen side by side, one highlighted
        flip: true
        tags: [Growth, Experiments, Checkout]

  - marker: Craft
    label: Keeping it running
    title: Holding it all together
    accent: together
    intro: Alongside the features came the work of leading, supporting and keeping things up.
    moments:
      - kicker: Leadership
        title: Leading projects and technical designs
        body: |
          I oversaw and took the lead on multiple projects and technical designs across all of the teams I worked on.

      - kicker: Reliability
        title: Resiliency and monitoring
        body: |
          I worked on resiliency and monitoring for the teams I was part of, and kept up on-call and deployment captain responsibilities.
        tags: [Resiliency, Monitoring, On-call]

      - kicker: People
        title: Mentoring and hiring
        body: |
          I mentored and onboarded new team members, and took part in interview processes.
        tags: [Mentoring, Interviewing]

  - marker: Latest
    label: Most recently
    title: Agents and gifts
    accent: gifts
    intro: My last stretch at Shopify ran from the systems behind the catalogue to something you can play with.
    moments:
      - when: "2024"
        key: true
        title: Adopting AI and agentic workflows
        body: |
          In 2024 I adopted AI and agentic workflows, working with models from OpenAI and Anthropic.
        # TODO: what changed in how you and the team worked, and what did it make possible?
        tags: [AI, Agents, OpenAI, Anthropic]

      - kicker: AI
        title: Agentic pipelines
        body: |
          Building agentic pipelines to generate content and organise products within the app.
        # TODO: what did the pipelines do, and how did you keep their output good?
        image:
          src: /media/timelines/shopify/agents.svg
          alt: Illustration of scattered product tiles passing through a pipeline and coming out sorted into neat rows
        tags: [Agents, AI, Catalogue]

      - kicker: Shop.com
        key: true
        title: Gift Shop
        body: |
          The most recent thing I worked on was [Gift Shop](https://shop.com/gift-shop) on Shop.com, a gift guide you explore like a map.

          Rather than a list, it's a canvas of gift guides you can drag around and zoom into, filtered by recipient, holiday, interests, price and brand, with shareable gift lists and a Surprise me button for when you're stuck.
        # TODO: add your part here.
        images:
          - src: /media/timelines/shopify/gift-shop-wall.webp
            alt: Gift Shop's canvas of gift guides, such as Cool, stylish caps and Festive but chic Fair Isle knitwear, under a row of filters for recipients, holidays, interests, price and brand
            caption: A canvas of gift guides you can drag around and zoom into
            ratio: 1855/1014
          - src: /media/timelines/shopify/gift-shop-globe.webp
            alt: Gift Shop's gifts shown on the surface of a glass snow globe, in a snowy pink landscape
            caption: Gift Shop's snow globe view
            ratio: 1856/1011
        tags: [Shop.com]

outro:
  eyebrow: What's next
  title: Looking for the next challenge
  accent: challenge
  next: your-company
  actions:
    - {label: "See what I'd bring", url: /experience/your-company/}
    - {label: Read my resumé, url: /resume/}
    - {label: Get in touch, url: "mailto:hi@craigchilds.me"}
  text: I'm passionate about helping others, learning as much as I can along the way and finding the best solution to the problem. If you've got something interesting to build, I'd love to hear about it.
---
