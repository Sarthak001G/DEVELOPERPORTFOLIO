# Developer Portfolio & Case-Study Builder

A modern, responsive web application for developers to build, customize, and export professional portfolio websites with in-depth project case studies.

![Portfolio Builder Preview](https://img.shields.io/badge/Status-Complete-success)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-yellow)
![HTML5 / CSS3](https://img.shields.io/badge/HTML5-CSS3-blue)

---

## 🌟 Key Features

- **Authentication System:**
  - Login & Registration with real-time password strength metering.
  - "Try Demo" bypass mode for rapid evaluation.
  - Client-side auth guard protecting all app pages.

- **Dashboard:**
  - Dynamic user greeting and live stats (total projects, skills, profile completeness, active template).
  - Setup checklist with interactive progress tracking.
  - Recent project case-study activity feed.

- **Personal Information Editor:**
  - Profile customization (Name, Title, Bio, Email, Phone, Location, Website, Social Links).
  - Dynamic tag-based skill manager with 35+ preset suggestions.
  - Educational history and work experience list managers.
  - Debounced auto-save with visual feedback indicator.

- **Project & Case-Study Builder:**
  - Full CRUD operations with instant search and duplicate tools.
  - Structured case studies:
    - *Overview:* Title, tagline, technology tags, and featured project badges.
    - *Case Study Breakdown:* Problem Statement, Solution Architecture, Key Features list, Challenges, and Outcomes.
    - *Media & Links:* Live screenshot preview, Demo URLs, and GitHub links.

- **Template Gallery & Live Customizer:**
  - **3 Distinct Portfolio Templates:**
    - `Aurora`: Dark gradient with glassmorphism and glow effects.
    - `Minimal`: Clean, modern, high-contrast light typography.
    - `Neon`: Cyberpunk terminal-inspired theme with glowing accents.
  - **Live Editor:** Real-time color pickers (Primary & Secondary), Google Font switcher, and section visibility toggles.
  - **Responsive Device Preview:** Instant toggle between Desktop, Tablet, and Mobile viewports.

- **One-Click Export:**
  - Download a self-contained, standalone `.html` file ready to host on GitHub Pages, Vercel, Netlify, or any static host.
  - Copy full source code directly to clipboard.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Pure Vanilla JavaScript (ES6+), Semantic HTML5, Custom CSS3 with CSS Variables.
- **Storage:** Reactive `localStorage` data store with custom event bus for cross-component reactivity.
- **Styling:** Modular CSS architecture (`variables.css`, `layout.css`, `components.css`, `forms.css`, `dashboard.css`, `animations.css`).
- **Zero Dependencies:** No bundlers, external frameworks, or build steps required.

---

## 🚀 Getting Started

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Sarthak001G/<repo-name>.git
   cd DEVELOPERPORTFOLIO
   ```

2. Open `index.html` in any modern web browser, or serve using a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node
   npx serve
   ```

3. Sign in or click **"Try Demo — Skip Sign In"** to begin customizing your portfolio!

---

## 📁 Project Structure

```
├── index.html                   # Main dashboard
├── css/
│   ├── variables.css            # Color tokens, spacing, typography
│   ├── reset.css                # Base reset styles
│   ├── layout.css               # App shell and sidebar
│   ├── components.css           # UI components
│   ├── forms.css                # Form elements
│   ├── dashboard.css            # Dashboard layout
│   └── animations.css           # Keyframe animations
├── js/
│   ├── core/                    # Core managers (Auth, Store, Theme, Utils, Router)
│   ├── pages/                   # Page controllers
│   └── templates/               # Standalone template renderers
└── pages/
    ├── auth.html                # Sign in / Sign up page
    ├── personal-info.html       # Profile settings
    ├── project-builder.html     # Case study builder
    ├── template-gallery.html    # Template selector
    ├── live-editor.html         # Customizer with live preview
    └── portfolio.html           # Full portfolio viewer & exporter
```

---

## 📄 License

MIT License. Free to use and modify for personal or commercial projects.
