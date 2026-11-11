---
# A timeline page for one role. Start a new one with:
#   npx hugo new -s site experience/<company>.md
# then link it from data/experiences.yaml with `timeline: <company>`. It stays a draft (visible only
# with `pnpm preview`) until you set draft: false. analog-republic.md and shopify.md are full examples.
#
# Page fields:
#   company, role, location, description
#   started, ended  YYYY-MM-DD; both optional. Without them the page has no overview line.
#   period          text shown under the company instead of the years, such as "Next"
#   logo            image shown beside the company name
#   placeholder     true shows a dashed "Logo" slot instead, for a role that hasn't happened yet
#   headline        the big title; `accent` names the word to colour
#   stats           a list of {value, label}; digits in the value roll like the home page stats
#   actions         a list of {label, url} buttons under the hero; the first is the primary one
#   theme           applies src/css/themes/<theme>.css; an optional _partials/timeline/art-<theme>.html
#                   replaces the hero artwork
#   font            a Google Fonts family spec to load, such as "Inter+Tight:wght@400;600"
#
# Chapter fields: label, title, accent, intro, moments, and either
#   year     a number; pins it in the gutter and marks it on the overview bar
#   marker   a word to pin in the gutter instead, for chapters grouped by theme
#
# Moment fields (all optional except title; they can be combined freely):
#   date         YYYY-MM-DD, placed on the overview bar and shown as "Mar 2022"
#   when         free text instead of a date, such as "2021", when the exact date isn't known
#   kicker       a small label above the title, such as the type of project
#   key          true makes it a highlighted, full-width key moment listed in the hero
#   placeholder  true draws it as a dashed outline, for a moment that hasn't happened yet
#   body         markdown; several paragraphs and sub-headings are fine
#   image        {src, alt, caption, ratio}; ratio defaults to 3/2 (21/9 on key moments).
#                {placeholder: "Label"} in place of src and alt draws an empty frame with that label
#   images       a list of the same, shown as a staggered gallery
#   flip         true puts the image on the left of the text
#   quote        {text, by}
#   stats        a list of {value, label}
#   tags         a list of short labels
#   terminal     {title, caption, lines}: a terminal that plays back an agent session when scrolled
#                to. Each line is one of {prompt|think|tool|code|out|ok: "text"}; see
#                _partials/timeline/terminal.html
#   stream       true streams the body in word by word, like a model's reply
#   decode       true scrambles the title through code characters before it settles
#
# Outro fields: eyebrow, title, accent, text, lessons (a list of {title, text}), and
#   next     the file name of the role that came after; links the title to it once that page is live
#   actions  a list of {label, url} buttons, replacing the default ones
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: ""
draft: true

company: ""
role: ""
started: {{ now.Format "2006-01-02" }}
ended: {{ now.Format "2006-01-02" }}

headline: ""
accent: ""

chapters:
  - marker: Start
    label: The start
    title: ""
    moments:
      - title: ""
        body: |

outro:
  eyebrow: What came next
  title: ""
---
