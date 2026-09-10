# Ele-mental (Elemental Sandspiel)

A high-performance falling-sand cellular automata engine and chemical physics laboratory built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**.

Ele-mental runs real-time thermodynamic, fluid-dynamic, and chemical simulations inside a dedicated multi-threaded **Web Worker** using typed arrays (`Uint8Array`, `Int16Array`, `Float32Array`) to sustain 60 FPS across hundreds of thousands of particle updates per second.

---

## Features

### 1. Realistic Physics & Thermodynamics
- **Archimedean Buoyancy**: Gases (steam, methane, hydrogen, oxygen, smoke, toxic gas) bubble upward through liquids. Low-density granular materials (sawdust, snow) float to the surface of denser liquids, while dense fluids percolate down through porous powders.
- **Thermodynamic Phase Transitions**: Complete thermodynamic cycles including the $H_2O$ cycle ($\text{Ice} \leftrightarrow \text{Water} \leftrightarrow \text{Steam}$), organic melting (Wax $\rightarrow$ Oil at 65°C), and extreme geological melting (Stone $\rightarrow$ Lava at 1150°C, Metal $\rightarrow$ Lava at 1450°C).
- **Chemical Combustion & Explosions**: Exothermic oxygen acceleration, oxy-hydrogen gas mixture detonations, nitro demolition shocks, acid dissolution, and ember ash residues.
- **Fluid Viscosity & Surface Tension**: Distinct lateral dispersion rates for water, light oils, viscous acids, molten lava, and cryogenic nitrogen.
- **Directional Gravity**: Switch gravity dynamically between **Normal (down)**, **Inverted (up)**, **Left**, **Right**, and **Zero-G**.

### 2. Extensive Element Matrix
Over 45 built-in elements across 8 specialized categories:

| Category | Elements |
|---|---|
| **Solids** | Wall, Stone, Wood, Brick, Glass, Wax, Metal, Gold, Sponge, Fuse, Charcoal, Clay, Obsidian, Concrete, Ice |
| **Liquids** | Water, Oil, Acid, Lava, Mercury, Salt Water, Alcohol, Liquid Nitrogen, Nitroglycerin |
| **Powders** | Sand, Dirt, Gunpowder, Salt, Seed, Sawdust, Snow, Ash, Termite, Rust |
| **Gases** | Steam, Smoke, Toxic Gas, Methane, Hydrogen, Oxygen, Carbon Dioxide |
| **Energy & Special** | Fire, Spark, Void, Plasma, Laser, Source |
| **Life** | Plant, Spore, Algae, Yeast |
| **Tools** | Eraser, Heat Gun, Cold Beam, Electric Probe, Wind / Pressure Impulse |

### 3. Custom Element & Reaction Studio
- Create user-defined elements with customized density, viscosity, flammability, thermal conductivity, electrical conductivity, corrosiveness, and boiling/freezing points.
- Define custom chemical reactions ($A + B \rightarrow C + D$) with reaction probabilities, heat deltas, pressure deltas, and visual particle effects (`flash`, `explode`, `spark`, `dissolve`).
- Instant local persistence through `localStorage`.

### 4. Diagnostic View Modes
- **Natural**: True-to-life elemental coloration with per-particle color jitter.
- **Thermal Heatmap**: Color-graded thermal visualization ranging from cryogenic blue ($-196^\circ\text{C}$) to ambient green ($22^\circ\text{C}$) to plasma incandescent white ($3000^\circ\text{C}$).
- **Pressure Gradient**: Real-time atmospheric and kinetic pressure waves.
- **Velocity / State**: Visual differentiation between static solids, mobile powders, fluid liquids, and buoyant gases.

### 5. Interactive Transport & Inspector
- **Transport Bar**: Play, Pause, Single-frame step forward, and variable simulation speeds ($0.25\times$ to $4\times$).
- **Precision Inspector HUD**: Hover over or tap any particle to inspect its element key, coordinate index, temperature, pressure, density, and remaining lifespan.
- **Preset Laboratory Scenes**: Instant setups for Clean Sandbox, Chemical Laboratory, Volcano & Oil Reservoir, Electrolysis Rig, Nuclear Fission Chamber, and Nitro Demolition.

---

## Project Structure & Atomic Design

The frontend codebase is organized according to **Atomic Design** principles, ensuring modularity, isolation, and reusability:

```
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages automated build & deployment workflow
├── app/
│   ├── globals.css              # Tailwind CSS v4 styling entrypoint
│   ├── layout.tsx               # Root layout & OpenGraph metadata
│   ├── not-found.tsx            # Custom 404 error page
│   └── page.tsx                 # Main application page
├── components/
│   ├── atoms/                   # Primitive UI components (buttons, badges, sliders, canvas primitives)
│   ├── molecules/               # Composite components (transport deck, brush controls, inspector cards, HUD)
│   ├── organisms/               # Full feature modules (element palette, bottom sheet, scene modals, canvas)
│   └── templates/               # Layout templates (SandspielStudio)
├── hooks/
│   └── useSandspielSimulation.ts# React hook bridging UI state to the Web Worker engine
├── lib/
│   └── sandspiel/
│       ├── elements/            # Element definitions and physical constants
│       ├── reactions/           # Chemical and thermal reaction matrices
│       ├── physics/             # Cellular automata step simulation & state buffers
│       ├── presets/             # Laboratory preset scenes
│       ├── custom-element-store.ts # LocalStorage state persistence
│       ├── simulation-engine.ts # Simulation lifecycle coordinator
│       └── types/               # TypeScript definitions
├── public/                      # Static assets
├── next.config.ts               # Next.js configuration (static export & base-path handling)
├── package.json                 # Project dependencies and build scripts
└── tsconfig.json                # TypeScript compiler configuration
```

---

## Getting Started

### Prerequisites
- **Node.js**: Version 22 LTS or newer (v22.x or v24.x recommended)
- **Package Manager**: `npm`, `yarn`, or `bun`

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/cdpollard/Ele-mental.git
cd Ele-mental
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verification & Linting

```bash
npm run lint
```

---

## Deployment to GitHub Pages

Ele-mental is preconfigured for zero-configuration deployment to **GitHub Pages** via GitHub Actions.

### How the Deploy Script Works

The automated deployment workflow is located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **Target Environment**:
   - Runs on modern `ubuntu-latest` using **Node.js 22 LTS** (`node-version: 22`).
   - Caches npm dependencies with `cache-dependency-path: package-lock.json` against the committed `package-lock.json`.
2. **Subpath Handling**:
   - Uses `actions/configure-pages@v5` to dynamically inject the repository name (`/Ele-mental`) as `NEXT_PUBLIC_BASE_PATH`.
   - `next.config.ts` reads `GITHUB_PAGES=true` and sets `output: 'export'`, `basePath`, and `assetPrefix` to ensure all CSS, JavaScript chunks, and worker assets load properly on GitHub Pages.
3. **Static Generation**:
   - Runs `npm run build` under `NODE_ENV=production` to export all pages and canvas assets into static HTML/JS inside the `./out` directory.
   - Emits `./out/.nojekyll` to prevent GitHub Pages from ignoring files prefixed with underscores.
4. **Artifact Upload & Deployment**:
   - `actions/upload-pages-artifact@v3` packages `./out`.
   - `actions/deploy-pages@v4` publishes the build directly to the live GitHub Pages environment.

### Setting Up GitHub Pages in Your Repository

1. Push your code to GitHub (to `main` or `master`).
2. In your repository on GitHub, navigate to:
   **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**.
4. The workflow will automatically trigger on every push to `main`/`master`, or you can trigger it manually via the **Actions** tab using the **Run workflow** button.

---

## Troubleshooting CI/CD Deploy Issues

| Issue | Cause | Fix |
|---|---|---|
| `Dependencies lock file is not found...` | `cache: npm` in `actions/setup-node` could not locate `package-lock.json`. | Ensure `package-lock.json` is generated and committed to the repository. The workflow now specifies `cache-dependency-path: package-lock.json`. |
| `Node.js 20 is deprecated...` | GitHub Actions runner deprecated Node 20 runtimes. | The workflow is updated to `node-version: 22` to run on the latest LTS runner. |
| Non-standard `NODE_ENV` prerender errors | Invoking `next build` without `NODE_ENV=production` triggers fallback error page rendering. | The workflow explicitly sets `NODE_ENV: production` during the export step. |

---

## License

MIT License. Feel free to explore, experiment, fork, and build custom elements!
