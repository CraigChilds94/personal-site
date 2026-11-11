---
# Published. The TODO notes below are comments for adding your own part to each story; they
# don't appear on the page.
#
# Sources: your own notes on the role, data/resume.yaml, and analogrepublic.com/projects (client
# descriptions and screenshots), deep.pearljam.com and building-2.com. The Red Bulls photo competition
# isn't on any of those, so it only says what your notes say. Chapters follow the journey in your notes rather than
# exact dates. To put a project on the overview bar, give it a `date` (see archetypes/experience.md for every field).
title: "Senior Full-Stack Developer at Analog Republic"
description: "More than five years at Analog Republic, growing from mid-level to senior engineer and modernising the team's tooling, across work for bands, sports teams, research studies and luxury brands."
draft: false
theme: analog-republic
font: "Inter+Tight:wght@400;500;600;700"

company: Analog Republic
website: https://analogrepublic.com/
role: Senior Full-Stack Developer
location: Remote
started: 2015-05-01
ended: 2021-12-31

headline: From mid-level engineer to senior
accent: senior

stats:
  - {value: "5+", label: years at Analog Republic}

chapters:
  - marker: "2015"
    label: The start
    title: Learning the ropes
    accent: ropes
    moments:
      - when: May 2015
        title: Joining as a mid-level engineer
        body: |
          I joined Analog Republic after a year at Tann Westlake, where I'd been building client websites in WordPress. I arrived as a mid-level engineer with a working knowledge of CSS, JavaScript and PHP.

          My first work was on smaller projects: UI changes and simple backend updates.
        # TODO: what was your first project, or the moment it clicked?

      - kicker: Remote
        title: Working across time zones
        body: |
          From early on I worked remotely across time zones with the US West Coast.
        tags: [Remote, Cross-time-zone]

  - marker: Growth
    label: Taking the lead
    title: Leading the work
    accent: work
    intro: Over time I moved from picking up tasks to owning projects.
    moments:
      - kicker: Project leadership
        title: Leading projects end to end
        body: |
          I led projects from planning through development and deployment, and made updates to our internal frameworks and tooling.

      - kicker: Quality
        title: A high bar for high-profile clients
        body: |
          I held a high bar of engineering on our higher-profile client work.
        # TODO: an example of what that bar looked like in practice would make this one.

  - marker: Music
    label: Artists and their fans
    title: Building for bands and their fans
    accent: fans
    intro: Part of my work was building subscription fan clubs for popular music artists, including migrating their existing subscribers across.
    moments:
      - kicker: Custom Shopify integration
        key: true
        title: Eric Church
        body: |
          One of country music's biggest artists needed a membership platform, covering member benefits, early access to tickets, meet-and-greet sign-ups and limited-edition merch runs.

          I worked on the custom Shopify integration behind it. Fans got a single sign-on, and the store knew who was a paid member so it could offer them member-only merchandise.
        # TODO: what was hardest about it?
        image:
          src: /media/timelines/analog-republic/eric-church.webp
          alt: Eric Church's website open on a laptop, with the mobile site on a phone resting against the keyboard
          caption: "Image: Analog Republic"
          ratio: 16/9
        tags: [Memberships, Shopify, Single sign-on]

      - kicker: Live music player
        key: true
        title: Pearl Jam's DEEP
        body: |
          [DEEP](https://deep.pearljam.com/) is Pearl Jam's player for their live shows, with integrations to Apple Music and Spotify.

          Fans can search and filter the archive of shows by year, country and city, save shows to their own collection, build playlists, listen to featured playlists and use a setlist generator.
        # TODO: what was your part, and what was hardest about the Apple Music and Spotify integrations?
        image:
          src: /media/timelines/analog-republic/deep.webp
          alt: DEEP's featured playlists above a searchable list of Pearl Jam shows
          caption: "Image: deep.pearljam.com"
          ratio: 16/10
        tags: [Apple Music, Spotify, Playlists]

  - marker: Sport
    label: Fans on the terraces
    title: Putting fans in the design seat
    accent: design
    intro: For the New York Red Bulls, the brief was to get supporters making things, not just watching.
    moments:
      - kicker: Fan design contest
        key: true
        title: New York Red Bulls
        body: |
          The team wanted fans to design a scarf that would be produced and handed out at the New York Red Bulls Supporters Game.

          We built an online scarf designer for desktop and mobile, letting fans choose colour schemes, patterns, logos and text, or upload their own design from Photoshop templates. Every entry went into a fan gallery, and judges picked the winner through a fully moderated admin system. You can [see the scarf builder in action](https://www.youtube.com/watch?v=nvac-kuTERU).

          I also worked on a fan photo competition and designer for the club.
        # TODO: add your part in each, and anything about the response from fans.
        image:
          src: /media/timelines/analog-republic/red-bulls.webp
          alt: The scarf contest's gallery of fan-designed scarves, open on a laptop
          caption: "Image: Analog Republic"
          ratio: 4/3
        tags: [Design tool, Fan gallery, Moderation]

  - marker: Beyond
    label: Other worlds
    title: Far beyond the music
    accent: music
    intro: Agency life meant moving between very different industries, each with its own problems to solve.
    moments:
      - kicker: Luxury yacht web platform
        key: true
        title: Sunseeker
        body: |
          With a main brand website and over 30 dealership sites, Sunseeker needed a clean way to deliver content across multiple domains from one place.

          We built a custom CMS that gave the marketing team a single source for every site, letting them manage content centrally, translate it and allocate specific content to specific sites.
        # TODO: add your part here.
        image:
          src: /media/timelines/analog-republic/sunseeker.webp
          alt: Sunseeker's dealer locator, a world map marked with dealerships, open on a laptop
          caption: "Image: Analog Republic"
          ratio: 16/9
        stats:
          - {value: "30+", label: sites from a single CMS}
          - {value: "9", label: languages}
        tags: [Custom CMS, Multi-site, Localisation]

      - kicker: University health study
        title: The PRIDE Study
        body: |
          The UCSF PRIDE Study is the first population-level longitudinal study of LGBTQ health, aiming to understand the community's priority health issues and disparities.

          Analog Republic built the study's free iPhone app on Apple's ResearchKit, enabling real-time consent, enrolment and participation, and letting participants raise the health concerns that mattered to them.
        # TODO: add your part here. Was the GraphQL and Next.js research platform below part of this?
        image:
          src: /media/timelines/analog-republic/pride-study.webp
          alt: The PRIDE Study app's welcome screen on an iPhone
          caption: "Image: Analog Republic"
          ratio: 4/5
        flip: true
        tags: [Health research, iOS, ResearchKit]

      - kicker: Residential property
        title: Fairfield
        body: |
          Fairfield needed a site that attracted new residents and also gave investors a clear message about its property portfolios.

          We built a custom CMS that merged data from multiple third-party platforms into up-to-the-minute availability and property data, with search by location, region or zip code across the US.
        # TODO: add your part here.
        image:
          src: /media/timelines/analog-republic/fairfield.webp
          alt: Fairfield's home page open on a laptop against a blue background
          caption: "Image: Analog Republic"
          ratio: 4/3
        tags: [Custom CMS, Third-party integrations, Search]

  - marker: Craft
    label: Behind the client list
    title: The work under the hood
    accent: hood
    intro: Alongside client sites, I took on some of the more technically involved work the agency did.
    moments:
      # This joins your notes on Sneek with the in-house WebRTC product from your resumé, because
      # building-2's features match it. Split them if they were different products.
      - kicker: In-house product
        title: Sneek.io, now building-2
        body: |
          An in-house SaaS product, now [building-2](https://www.building-2.com/): a virtual office for remote and hybrid teams that shows who's around in real time and starts a video call in one click.

          It was built on WebRTC and WebSockets, and I developed an Electron app for the desktop client.
        # TODO: what else was your part?
        tags: [WebRTC, WebSockets, Electron, SaaS]

      - kicker: Research platform
        title: Test-driven GraphQL APIs
        body: |
          Test-driven GraphQL APIs and a Next.js front end in TypeScript for a research platform that was due to be open-sourced.
        tags: [GraphQL, Next.js, TypeScript, Testing]

      - kicker: Music industry data
        title: A home for music credits
        body: |
          A platform built around a new industry-standard format for storing music project and credit data, with a GraphQL API for web and mobile integrations.
        tags: [GraphQL]

      - kicker: Infrastructure
        title: Running services on Kubernetes
        body: |
          Deploying and maintaining a service-oriented application running on a Kubernetes cluster.
        tags: [Kubernetes]

      - kicker: Open source
        title: Filling the gap in Plaid's SDKs
        body: |
          One project needed to integrate with the Plaid API and there wasn't a PHP SDK available, so I wrapped the functionality we needed into [a small package](https://github.com/CraigChilds94/plaid-php).
        tags: [PHP, Open source]

  - marker: Senior
    label: Raising the bar
    title: Bringing the team into the modern day
    accent: modern
    intro: By the time I left, I was helping set how the team worked, not just what it built.
    moments:
      - kicker: Engineering practice
        key: true
        title: Modernising how we built software
        body: |
          I was a pivotal force in bringing the engineering team up to date with new tooling, frameworks and ways of coding.

          I introduced CI/CD and automated testing, Docker, Laravel and React, and worked to level up the team on them, including migrating our work to Laravel, a well-established PHP framework.
        # TODO: what changed for the team once these were in place?
        stats:
          - {value: "4", label: "tools and practices introduced: CI/CD, Docker, Laravel, React"}

      - kicker: People
        title: Mentoring and guiding
        body: |
          I mentored and guided newer hires and overseas contractors so that they were proficient with the latest tooling and able to work independently on tasks.
        tags: [Mentoring]

outro:
  eyebrow: What came next
  title: On to Shopify
  accent: Shopify
  next: shopify
  text: I finished at Analog Republic in 2021 and moved on to Shopify, where I spent more than five years working on the Shop app, making it one of the world's best shopping and tracking destinations.
---
