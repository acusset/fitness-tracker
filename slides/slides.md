---
theme: seriph
title: Fitness Tracker
description: An overview of the Fitness Tracker application
background: https://cover.sli.dev
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Fitness Tracker

Track your workouts, monitor your progress, and reach your goals.

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space to continue <carbon:arrow-right class="inline"/>
  </span>
</div>

---
transition: fade-out
---

# What is Fitness Tracker?

A modern, full-stack web application that helps you stay on top of your fitness journey.

- 📊 **Dashboard** – at-a-glance view of your activity and progress
- 🏋️ **Workout Logging** – record exercises, sets, reps, and weights
- 📈 **Progress Charts** – visualise trends over time with Recharts
- 🔐 **Authentication** – secure login via Supabase Auth
- 🌗 **Dark / Light Mode** – theme switching powered by next-themes

<br>

> Built with **Next.js 15**, **Supabase**, **Tailwind CSS**, and **shadcn/ui**

---
layout: image-right
image: https://cover.sli.dev
---

# Tech Stack

### Frontend
- Next.js 15 (App Router + Turbopack)
- React 19
- Tailwind CSS v3
- shadcn/ui (Radix UI primitives)
- Recharts for data visualisation

### Backend / Data
- Supabase (PostgreSQL + Auth)
- NextAuth v5 (beta)

---

# Architecture Overview

```
fitness-tracker/
├── src/
│   ├── app/          # Next.js App Router pages & layouts
│   ├── components/   # Reusable UI components
│   └── lib/          # Utilities, Supabase client, auth helpers
├── pages/            # Legacy / API routes
├── public/           # Static assets
└── slides/           # This presentation (Slidev)
```

<br>

The app follows a **feature-based** folder structure inside `src/`, keeping concerns neatly separated.

---
layout: two-cols
---

# Key Features

## Workout Logging
- Add custom exercises
- Track sets, reps & weight
- Log cardio sessions with distance/duration

::right::

## Progress Tracking
- Weekly & monthly summaries
- Personal records (PRs)
- Body weight & measurements history

---

# Roadmap

| Feature | Status |
|---------|--------|
| Core workout logging | ✅ Done |
| Progress charts | ✅ Done |
| Dark / light mode | ✅ Done |
| Social / sharing | 🚧 Planned |
| Mobile app (React Native) | 🚧 Planned |
| AI-powered recommendations | 💡 Idea |

---
layout: center
class: text-center
---

# Get Started

Clone the repo and run locally in seconds.

```bash
git clone https://github.com/acusset/fitness-tracker.git
cd fitness-tracker
npm install
npm run dev
```

<br>

Open [http://localhost:3000](http://localhost:3000) in your browser 🚀

---
layout: end
---

# Thanks!

Questions? Contributions welcome 🙌

[GitHub](https://github.com/acusset/fitness-tracker) · [Open an Issue](https://github.com/acusset/fitness-tracker/issues)
