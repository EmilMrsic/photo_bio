# Neuralight Pro - Multi-Agent Development Setup

## 🧱 Overview

This repository uses a multi-branch setup to support parallel AI agent development. Each branch represents a different AI agent's workspace, allowing isolated testing while preserving a clean production-grade main branch.

## 📁 Branch Structure

```
branches:
├── main        ← Production/stable
├── claude      ← Claude agent experiments
├── codex       ← Codex agent experiments
├── warp        ← Warp agent experiments (current)
```

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EmilMrsic/photo_bio.git
   cd photo_bio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API keys
   ```

## 🧪 Local Development with Port Isolation

Each agent branch runs on its own port to allow parallel development:

- **Main branch:** `npm run dev:main` (port 3000)
- **Claude branch:** `npm run dev:claude` (port 4000)
- **Codex branch:** `npm run dev:codex` (port 5000)
- **Warp branch:** `npm run dev:warp` (port 6000)

### Switching Between Branches

```bash
# Switch to Claude branch
git checkout claude
npm install  # In case dependencies differ
npm run dev:claude

# Switch to Codex branch
git checkout codex
npm install
npm run dev:codex
```

## 🔁 Workflow Rules

1. **Never push directly to main** - All changes must go through a pull request
2. **Test thoroughly on agent branches** before creating PRs
3. **Keep main stable** - It represents the production-ready code
4. **Document significant changes** in your commits and PRs

## 📋 Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY` - Memberstack public key
- `MEMBERSTACK_SECRET_KEY` - Memberstack secret key
- `NEXT_PUBLIC_XANO_API_URL` - Xano API endpoint
- `OPENAI_API_KEY` - OpenAI API key for PDF analysis

## 🛠 Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Authentication:** Memberstack
- **Backend:** Xano
- **AI Integration:** OpenAI API
- **File Storage:** Xano file uploads

## 📝 Current Features

- Provider authentication and onboarding
- Client management system
- PDF upload and analysis
- Protocol extraction from brain maps
- Blog generation with AI
- Client document sharing

---

# Neuralight Pro - Project Specification

## Overview
**Neuralight Pro** is a photobiomodulation protocol assignment platform designed for providers using the Neuronix light therapy helmet. The system translates brain map outputs or subjective symptom input into structured photobiomodulation (PBM) protocols.

This is a standalone system with no Neuronix API integration. The provider manually enters protocol parameters into the Neuronix app.

---

## Objective
Create a lightweight web-based platform that:
- Accepts QEEG brain map uploads or CEC questionnaire responses
- Maps neurofeedback protocols (1–24) to PBM protocols (1–12)
- Returns time, pulse rate, and intensity settings for Neuronix helmet usage
- Allows providers to manage patients and access protocol guidance
- Hosts a product shop (helmets, accessories, subscriptions)
- Includes a CMS-driven blog for SEO and authority-building

---

## Stack Overview
- **Frontend**: Tailwind CSS, HTML/JS, hosted on Replit
- **Auth & Subscriptions**: Memberstack
- **Backend / DB**: Xano
- **Source Control**: GitHub
- **Design Inspiration**: Basecamp, Hey Email, 37signals aesthetic
- **Style**: Clean, practical, timeless — no fluff, maximum clarity
- **Dark mode**: Supported from the start

---

## Key Entities
- **User/Provider**: Clinical provider with a Neuralight Pro subscription
- **Client/Patient**: End recipient of protocol
- **Neurofeedback Protocol (NFB)**: 1–24, from brain map or internal logic
- **Photobiomodulation Protocol (PBM)**: 1–12, structured in three stages (Initial, Intermediate, Advanced)

---

## Inputs & Data Sources
1. **Condition Dropdown**
   - List: Sleep, Memory, Focus, Anxiety, Depression, Head Injury, Peak Performance, OCD, Chronic Pain, Spectrum Disorders, Headache, Stroke Recovery, Chronic Fatigue, Addictions

2. **Map Upload** (PDF)
   - Read neurofeedback protocol # manually selected by user for now

3. **CEC Questionnaire** (if no map)
   - Symptom-based form returning a suggested neurofeedback protocol

4. **Protocol Key Sheet**
   - Maps each NFB protocol (1–24) to PBM protocol (1–12) by condition

---

## Output
**PBM Protocol Assignment**
- Pulse Rate (Hz)
- Time (min)
- Intensity (%)
- 3 Stages:
  - Initial (Weeks 1–2)
  - Intermediate (Weeks 3–4)
  - Advanced (Week 5+)

Example:
> Protocol 10 (for Sleep):
> - Initial: 6 min @ 1 Hz, 40%
> - Intermediate: 8 min @ 1 Hz, 50%
> - Advanced: 12 min @ 1 Hz, 60%

---

## System Components

### 1. **Authentication / Provider Access**
- Login via Memberstack
- Account includes:
  - Subscription status
  - Protocol library access
  - Purchase history

### 2. **Client Intake Module**
- Create client profile
- Select condition
- Upload MAP (PDF)
- OR complete CEC questionnaire

### 3. **Protocol Engine**
- Look up correct PBM protocol via key matrix
- Return all three time blocks (Initial, Intermediate, Advanced)
- Display values for manual entry into Neuronix app

### 4. **Shop Module**
- Products: Helmet, accessories, bundles
- Subscriptions: Annual software access
- Features:
  - Product cards
  - Simple cart & checkout (Stripe)
  - Inventory notes (e.g. “Ships in 3–5 days”)
  - Post-purchase thank you page

### 5. **Blog (CMS SEO Section)**
- Article template with featured image, subtitle, author, publish date
- Typography tuned for readability
- Blog components:
  - Pull quotes, embedded videos, light code formatting
  - Related articles
  - End-of-article CTA (e.g. subscribe or shop)

### 6. **Admin Tools (optional MVP+)**
- CSV export of all patient protocols
- Protocol usage logs
- Product stock tracking

---

## MVP Features
- Account system (Memberstack)
- Provider dashboard
- Upload or CEC intake
- Protocol mapping and display
- Shop page with Stripe checkout
- Blog CMS interface via Xano
- Dark mode

---

## Protocol Data Logic
- 24 NFB protocols mapped per condition to PBM protocol 1–12
- PBM protocols defined by:
  - **Pulse Rate**: 1Hz, 10Hz, 20Hz, 40Hz
  - **Intensity**: % value per phase
  - **Time**: Minutes per phase

PBM Protocols:
| Protocol | Hz   | Stage 1 (min, %) | Stage 2 | Stage 3 |
|----------|------|------------------|---------|---------|
| 1–3      | 40Hz | varies           | varies  | varies  |
| 4–6      | 10Hz | varies           | varies  | varies  |
| 7–9      | 20Hz | varies           | varies  | varies  |
| 10–12    | 1Hz  | varies           | varies  | varies  |

---

## Page Structure

### **Public Pages**
- `/` — Homepage
- `/shop` — Product listings
- `/shop/[product]` — Product detail page
- `/checkout` — Stripe checkout flow
- `/blog` — SEO article index
- `/blog/[slug]` — Individual article page
- `/privacy`, `/terms`, `/faq` — Legal + info

### **Authenticated Pages**
- `/dashboard` — Provider overview (client count, quick links)
- `/clients` — Client management page
- `/clients/new` — Intake form (condition + map upload or CEC)
- `/protocols/[clientId]` — Protocol result screen
- `/account` — Subscription + account details
- `/resources` — Loom videos, protocol setup help

---

## Business Model (for context)
- $400/year subscription unlocks:
  - All PBM protocols
  - Discounted helmet pricing (e.g., $1,099 vs $1,795 retail)
- Optional add-ons:
  - Protocol "expansion packs"
  - Webinars / masterclasses

---

## Integration Constraints
- **No Neuronix API**: all protocol settings must be entered manually
- **Manual fallback**: Loom videos or screenshots guide client setup

---

## Deliverables
- Frontend: Tailwind-based provider dashboard, intake form, protocol display
- Backend: Xano (data + CMS)
- Auth: Memberstack
- Shop: Stripe integration for one-time + subscription sales
- Blog: CMS + article rendering

---

## Timeline Goals
- Week 1–2: UX wireframes + protocol engine scaffolding
- Week 3–4: Auth + intake + protocol logic
- Week 5: Blog/shop flow, dark mode toggle
- Week 6: Soft launch

---

## Notes
- All data pulled from internal spreadsheet for now
- Future version may integrate MAP parsing or EDF support
- Long-term: own-branded helmet + native app

---
