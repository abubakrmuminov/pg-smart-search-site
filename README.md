# pg-smart-search Cinematic Portal

An elite, high-performance documentation portal for the `pg-smart-search` SDK. Built with **Next.js 16** and **Framer Motion**, this portal provides a cinematic visualization of complex search orchestration logic.

## 🌟 Key Features

- **Execution Flow Simulator**: Real-time visualization of the Parallel Fast-Track engine, demonstrating FTS vs Trigram orchestration and "Zombie Prevention" logic.
- **Visual Query Debugger**: A "Technical Trace" engine that shows how queries are sanitized, corrected for layout (qwerty → ru), and tokenized.
- **Interactive Index Guide**: Comprehensive guide for PostgreSQL indexing strategies (GIN vs GiST) with snippets for Prisma and TypeORM.
- **Elite Aesthetic**: High-fidelity "Blueprint" design system with glassmorphism, noise grain, and 60 FPS animations.

## 🛠️ Tech Stack

- **Core**: Next.js 16 (App Router), React 19
- **Animations**: Framer Motion 12
- **Styling**: Pure Vanilla CSS (Zero dependencies)
- **I18n**: Built-in Internationalization (EN / RU)

## 🚀 Getting Started

### 1. Installation

Install project dependencies:

```bash
npm install
```

### 2. Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

### 3. Production Build

Build for production:

```bash
npm run build
```

## 📐 Design Tokens

All design tokens (colors, blur, spacing) are managed via CSS variables in `styles/globals.css`.

- `--c-turbo`: Electric Cyan (#22d3ee)
- `--c-cobalt`: Pro Blue (#2a59ff)
- `--c-violet`: Abort Purple (#7c3aed)
- `--s-0`: Deep Charcoal (#030303)

## 📄 License

This portal is part of the `pg-smart-search` ecosystem. Licensed under MIT.
