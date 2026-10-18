# Game Intelligence & Market Analytics Platform

A two-member DBMS Level 3 project inspired by SteamDB, combining semantic game discovery, wishlist-based deal scoring, and review-sentiment/price analytics.

## Current status

This repository contains a working Next.js starter and shared planning documents. The home page is still the default starter page. Authentication, databases, ingestion, search, scoring, and dashboards are **planned, not implemented**. Feature implementation is on hold until both teammates confirm the work split.

The agreed relational design has **15 tables**. Keep it frozen unless a specific integrity or requirements issue is identified and reviewed by both members.

## Run the starter

Prerequisites: Git, Node.js 22.19.0, and npm 10.9.3 (the versions used for the initial setup). Use the committed lockfile to reproduce dependencies.

```powershell
git clone https://github.com/ssoommeesshh/game-intelligence-system.git
cd game-intelligence-system
npm ci
npm run dev
```

Open http://localhost:3000. If that port is occupied, check the terminal for the port Next.js selected. Stop the server with Ctrl+C.

This repository is public, so anyone can clone it. Pushing changes requires collaborator access and authentication with your own GitHub account. Do not use a teammate's credentials. Clone into any convenient directory; the folder name does not affect the app.

The local app has been moved into `C:\Users\harih\OneDrive\Desktop\somesh\sem-5\dbms\miniproj`. Run your project commands from this directory:

```powershell
cd "C:\Users\harih\OneDrive\Desktop\somesh\sem-5\dbms\miniproj"
npm run dev
```

The starter currently needs **no database services, API keys, or environment variables**. Database setup instructions and an `.env.example` will be added when integration is implemented. Never commit actual passwords, tokens, or `.env` files.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies exactly from `package-lock.json` |
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm start` | Serve a completed production build |
| `npm audit` | Inspect dependency advisories; does not fix them |

The default layout downloads Geist fonts through `next/font/google`; a build may require internet access to fetch them. There is no automated project test suite yet.

## Stack and responsibilities

| Technology | Purpose | Status |
| --- | --- | --- |
| Next.js 16.4.2, React 19.3.0, TypeScript | Web interface and server-side API | Starter only |
| MySQL 8.0 | Relational catalog, users, wishlists, price history | Planned |
| MongoDB | Variable-format reviews and sentiment metadata | Planned |
| Qdrant | Game embeddings and semantic similarity retrieval | Planned |

Database credentials and database clients will stay on the server. Authentication must support at least two roles (planned: user and admin), with authorization enforced on backend operations.

## Database tools for later integration

The initial Windows machine has MySQL Community Server 8.0.46 (`MySQL80` service), mongosh 2.5.9, and Docker 29.7.2. These are recorded reference versions, not services installed or configured by this repository. `mongosh` is a client; its presence does not prove a MongoDB server is running. Qdrant has not been provisioned here.

On the original Windows setup, check MySQL with:

```powershell
Get-Service MySQL80
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" --version
```

Your own paths and service names may differ. There are currently no migrations, seed scripts, database creation commands, or Docker Compose configuration to execute.

## Shared documents

- [Project brief and requirement checklist](docs/PROJECT_BRIEF.md)
- [Database design and relationship clarification](docs/DATABASE_DESIGN.md)
- [Dependency review and validation record](docs/SETUP_NOTES.md)
- [Team workflow and work split template](CONTRIBUTING.md)
- [Original course requirements](docs/reference/DBMS%20Level%203%20Project%20Requirements.pdf)
- [Original evaluation document](docs/reference/DBMS%20Level%203.pdf)
- [Generated ER diagram](docs/reference/ERdiag-gen.jpeg)
- [Handwritten ER reference](docs/reference/writeen-ERdiag.jpeg)

## Collaborating

The current shared branch is `master`. Use your own account and meaningful commits, with a separate branch for each task. See [CONTRIBUTING.md](CONTRIBUTING.md) before starting. Both members need demonstrable database and application contributions; the work split remains pending.

Commit source, configuration, documentation, and `package-lock.json`. Git ignores `node_modules`, `.next`, build output, and local environment files; each teammate regenerates these locally.

## Known dependency issue

The initial audit reports five high-severity findings through the ESLint/Next.js lint dependency chain. This has been investigated and recorded in [setup notes](docs/SETUP_NOTES.md), but is unresolved. Do not run `npm audit fix --force`: the reported fix changes `eslint-config-next` to an older major version and needs compatibility review. No dependency versions were changed during this handoff.
