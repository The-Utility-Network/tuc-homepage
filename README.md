# The Utility Company

> **Welcome to the future of utility.**
> A next-generation digital experience powered by modern web technologies.

![TUC Screenshot](https://theutilityco.com/opengraph-image.png)

## Overview

**The Utility Company (TUC)** homepage is a high-performance, visually immersive web application serving as the central hub for TUC's ecosystem. Built with **Next.js 16** and **React 19**, it features a sophisticated, dark-mode aesthetic, complex 3D-like animations, and a dynamic "Game of Life" background simulation that runs efficiently on the client side.

This repository contains the source code for the frontend interface, showcasing modular architecture, modern CSS styling with Tailwind v4, and optimized asset delivery.

## ✨ Key Features

- **🌊 Dynamic Visuals**: A custom, performant implementation of **Conway's Game of Life** rendered on a canvas overlay (`WaveConwayBackground`), creating a living, breathing backdrop.
- **🏗️ Architectural Pillars**: Interactive 3D component showcases representing the core pillars of the TUC ecosystem.
- **⚡ High Performance**: Utilizing Next.js App Router, Server Components, and dynamic imports for optimal load times and SEO scores.
- **🎨 Modern Design System**: Built with **Tailwind CSS v4**, featuring glassmorphism, fluid typography, and responsive layouts that adapt seamlessly from mobile to desktop.
- **🧩 Modular Components**: Strictly typed TypeScript components for maintainability and scalability (Hero, About, Subsidiaries, Services, Partners).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Optimization**: `next/image`, `next/font`, `sharp`

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/tuc-homepage.git
    cd tuc-homepage
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```bash
src/
├── app/                # Next.js App Router pages and layouts
│   ├── globals.css     # Global styles and Tailwind directives
│   ├── layout.tsx      # Root layout definition
│   └── page.tsx        # Main homepage composition
├── components/         # Reusable UI components
│   ├── Hero.tsx        # Top-fold hero section
│   ├── Navbar.tsx      # Responsive navigation
│   ├── WaveConwayBackground.tsx # Canvas-based background animation
│   └── ...             # Feature sections (About, Pillars, etc.)
└── lib/                # Utility functions and shared logic
```

## 🔒 Security

This repository is scanned to ensure no sensitive credentials or private keys are exposed.
- Environment variables are managed via `.env` files (excluded from git).
- All API interactions are handled securely.

## 📄 License

© 2024 The Utility Company. All rights reserved.
