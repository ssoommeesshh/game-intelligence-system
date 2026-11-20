# Game Intelligence & Market Analytics Platform

A high-performance DBMS project combining relational catalog indexing, multi-store price monitoring, personalized wishlist deal scoring, and cross-database extensions.

---

## Architecture & Technology Stack

| Component | Responsibility | Technology |
|---|---|---|
| **Authoritative Relational Core** | Game identity, catalog, stores, prices, users, wishlists | **MySQL 8.0** |
| **Full Description & Documents** | Flexible game details, extended content (F07 - Somesh) | **MongoDB** |
| **Semantic Discovery** | Game embeddings & vector similarity search (F08 - Somesh) | **PostgreSQL + pgvector** |
| **Application Layer** | Next.js 15, React 19, TypeScript, Tailwind CSS | **Node.js (v22+)** |

---

## Team Work Split

### Sreejith's Scope (100% Implemented & Verified)
- **Database Architecture:** Complete 15-table relational schema matching frozen ER diagram (`docs/reference/ERdiag-gen.jpeg`), 10+ records per table, views, triggers, and stored procedures.
- **F02 — Game Catalog & Structured Details:**
  - `GET /api/games?q=&genreId=&tagId=&page=1&pageSize=20`
  - `GET /api/games/{gameId}`
  - Exported reusable `getGamesByIds(gameIds)` preserving pgvector rank ordering for F08.
  - UI at `/games` and `/games/{gameId}` with official Steam header image CDN integration.
- **F03 — Current Store Prices & Recorded History:**
  - `GET /api/games/{gameId}/prices`
  - SQL Window function (`ROW_NUMBER() OVER (PARTITION BY game_id, store_id ORDER BY recorded_at DESC)`) extracting the latest store observation.
  - Calculation of dataset historical low vs. current per-store prices.
  - Full chronological price log table.
- **F04 — Personal Wishlists & Controlled Writes:**
  - `GET /api/wishlists`, `POST /api/wishlists`
  - `PATCH /api/wishlists/{wishlistId}`, `DELETE /api/wishlists/{wishlistId}`
  - `POST /api/wishlists/{wishlistId}/games`
  - `PATCH /api/wishlists/{wishlistId}/games/{gameId}`, `DELETE /api/wishlists/{wishlistId}/games/{gameId}`
  - Atomic multi-step transaction creating a wishlist with first game (`sp_create_wishlist_with_first_game`) with rollback handling.
  - Owner authorization enforcement.
- **F05 — Admin Store Discounts & Price Observations:**
  - `POST /api/admin/prices` (ADMIN protected, guest receives 401, USER receives 403).
  - Derived price calculation: $\text{selling\_price} = \text{base\_price} \times (1 - \text{discount} / 100)$.
  - Triggers automated audit log in `PRICE_AUDIT_LOG`.
  - UI at `/admin/prices`.
- **F06 — Wishlist Target-Price Matches:**
  - `GET /api/wishlists/deals`
  - Queries games where `current_lowest_price <= target_price`.
  - UI deals banner on `/wishlists`.

### Somesh's Scope (Integration Boundaries Prepared)
- **F01 — Authentication:** `lib/auth.ts` provides agreed helper exports (`getCurrentUser()`, `requireUser()`, `requireAdmin()`).
- **F07 — MongoDB Full Content:** Dedicated `<GameFullDetails gameId={game.gameId} />` section hosted on `/games/[gameId]`.
- **F08 — Semantic Search:** `getGamesByIds(gameIds)` exported from `lib/db/catalog.ts` for hydrations.

---

## 17 DBMS Evaluation Requirements Evidence

1. **Frozen 15-Table Relational Schema:** `PUBLISHER`, `DEVELOPER`, `GAME`, `GAME_DEVELOPER`, `GENRE`, `GAME_GENRE`, `TAG`, `GAME_TAG`, `PLATFORM`, `GAME_PLATFORM`, `USER`, `WISHLIST`, `WISHLIST_GAME`, `STORE`, `PRICE_HISTORY`.
2. **10+ Records per Table:** Verified in `database/seed.sql`.
3. **Advanced SQL Categories Executed:**
   - **Views:** `view_latest_store_prices` (window function), `view_game_current_lowest`, `view_game_historical_lowest`, `view_game_catalog_summary`.
   - **Stored Routines:** `fn_calculate_discounted_price` (function), `sp_record_price_observation` (procedure with OUT parameters).
   - **Transactions:** `sp_create_wishlist_with_first_game` with `START TRANSACTION`, `COMMIT`, and `ROLLBACK` on constraint violation.
   - **Triggers:** `trg_after_price_history_insert` logging all observations to `PRICE_AUDIT_LOG`.
   - **Indexes:** Composite index on `(game_id, recorded_at DESC)`, `(user_id)`, `(title)`.
4. **DDL Evidence:** `CREATE`, `ALTER`, `DROP` demonstrated in `database/queries_demo.sql`.
5. **DML Evidence:** Multi-table `JOIN`, `GROUP BY`, `HAVING`, aggregates, and subqueries in `database/queries_demo.sql`.

---

## Quick Setup Instructions

### 1. Prerequisites (Windows / PowerShell)

Run the following commands from the repository root. Install:

- **Node.js 22.19+** and npm.
- **MySQL 8.0** for the catalog, prices, users, and wishlists.
- **MongoDB Community Server** and **mongosh** for extended game content. Installing mongosh alone does not install the database server.
- **PostgreSQL** (17 is used in the examples) with **pgvector installed for that PostgreSQL version**. PostgreSQL alone does not include the extension; follow the [official native Windows pgvector installation instructions](https://github.com/pgvector/pgvector#windows) before applying the SQL below.
- **Ollama** for generating embeddings, following its [Windows setup instructions](https://docs.ollama.com/windows).

MySQL is required to run the core app. MongoDB and PostgreSQL enable the full-details and similar-games sections. Ollama is needed during embedding generation; browsing already-generated recommendations only needs the databases.

Open a new PowerShell terminal after installing tools. If a command is not recognized, add its installation directory to PATH or use the full executable path. These examples avoid relying on PATH for MySQL and PostgreSQL:

```powershell
$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$psql = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
# Adjust these paths to your installed versions.
node --version
npm --version
& $mysql --version
& $psql --version
mongosh --version
ollama --version
```

### 2. Dependencies and Local Configuration

```powershell
npm ci
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Edit `.env.local` with your actual database credentials. Keep the database names below when using the supplied seed scripts. Use a non-empty MySQL password: the embedding generator requires it.

```dotenv
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD
MYSQL_DATABASE=game_intelligence_db
SESSION_SECRET=YOUR_RANDOM_SECRET
MONGODB_URI=mongodb://localhost:27017/game_intelligence
MONGODB_DATABASE=game_intelligence
POSTGRES_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/game_embeddings
OLLAMA_URL=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

Generate a session secret with the following command and paste its output as `SESSION_SECRET`. Do not use the example file's shared secret. `.env.local` is ignored by Git.

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

URL-encode special characters in passwords used inside connection URLs (for example, `@` becomes `%40`). If your MongoDB server requires authentication, include its credentials and authentication database in `MONGODB_URI`.

Next.js and `npm run embeddings:generate` load `.env.local` themselves. PowerShell does **not**, so load these variables before running the `mongosh` and `psql` commands below. This loader expects one `KEY=VALUE` assignment per line, optionally quoted, without inline comments:

```powershell
Get-Content .env.local | ForEach-Object {
  if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$') {
    $name = $Matches[1]
    $value = $Matches[2].Trim()
    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
        ($value.StartsWith("'") -and $value.EndsWith("'"))) {
      $value = $value.Substring(1, $value.Length - 2)
    }
    [Environment]::SetEnvironmentVariable($name, $value, 'Process')
  }
}
```

### 3. Start the Database Services

If installed as Windows services, check their status in an Administrator PowerShell terminal:

```powershell
Get-Service -Name MySQL80,MongoDB,postgresql-x64-17
# Run only for services shown as Stopped; names may differ by installation.
Start-Service -Name MySQL80
Start-Service -Name MongoDB
Start-Service -Name postgresql-x64-17
```

The default ports are MySQL `3306`, MongoDB `27017`, and PostgreSQL `5432`. Match `.env.local` to your actual ports. If you did not install a database as a service, start it using its installation's launcher/configuration instead.

### 4. Initialize Data (First Setup Only)

**The MySQL schema script drops and recreates `game_intelligence_db`; the seed script truncates its tables. Run these only for a fresh demo database or an intentional reset, never as a daily startup step.**

```powershell
# Enter your MySQL root password when prompted. Stop if either command fails.
Get-Content database/schema.sql -Raw | & $mysql -u root -p
Get-Content database/seed.sql -Raw | & $mysql -u root -p

# Upsert extended content for the 12 demo games.
# Re-running replaces those MongoDB documents, including any manual edits.
mongosh "$env:MONGODB_URI" --file database/mongodb-seed.js

# Create the PostgreSQL database once; skip this command if it already exists.
# Adjust host, port, and user to match POSTGRES_URL; enter its password when prompted.
& $psql -h localhost -p 5432 -U postgres -d postgres -W -v ON_ERROR_STOP=1 -c "CREATE DATABASE game_embeddings;"

# Enable pgvector and create/migrate the embedding table.
& $psql -d "$env:POSTGRES_URL" -v ON_ERROR_STOP=1 -f database/postgres-vector.sql
```

The PostgreSQL account must have permission to create the database and enable the extension. If `vector.control` is missing or `extension "vector" is not available`, install pgvector into the matching PostgreSQL server installation first; the SQL script enables an installed extension, it does not install its binaries.

### 5. Generate Embeddings

Start the Ollama Windows app. If its server is not already running, run `ollama serve` in a separate terminal and leave it open. Its default address is `http://localhost:11434`.

```powershell
ollama pull nomic-embed-text
npm run embeddings:generate
```

The generator reads MySQL titles, descriptions, genres, and tags plus MongoDB descriptions, stories, and features. It stores the generated vectors in PostgreSQL and skips records whose source hash and model name are unchanged. A fresh seeded catalog should finish with `12 generated, 0 unchanged, 12 catalog games`; a repeat should report `0 generated, 12 unchanged`.

Complete generation for **all** games before using recommendations, including after migrating the original hard-coded 3D vectors or changing models. An interrupted run can leave incompatible dimensions or models mixed in the table; rerun the same command to finish. Re-run after editing game content. Ollama can be stopped once generation finishes successfully.

### 6. Run the App (Everyday Startup)

With the database services running, open a terminal in the repository root:

```powershell
npm run dev
```

This one command starts **both the frontend and the backend API routes** through Next.js. Leave the terminal open, wait for `Ready`, then open **[http://localhost:3000](http://localhost:3000)** (or the port printed by Next.js). Stop it with `Ctrl+C`. Use this npm command directly; the legacy `run-dev.ps1` contains another developer's machine-specific Node path.

For subsequent runs, do not reload schema/seed scripts or regenerate unchanged embeddings. Restart the dev server after changing `.env.local`; also reload PowerShell variables if using CLI database commands. For a production deployment, use `npm run build` then `npm start`, configure a private `SESSION_SECRET`, and serve over HTTPS for secure login cookies.

### 7. Check the Setup

- Open `/games`: the seeded catalog should contain 12 games.
- Open `/login`: use `somesh@example.com` / `password123` for the admin demo, then visit `/wishlists` and `/admin/prices`.
- Open `/games/gam-001`: extended MongoDB content and a **You may also like** section should appear after seeding and embedding generation.
- Open `/api/games/gam-001/similar?limit=6`: expect an `items` array containing similar games. An empty array can also indicate a PostgreSQL/configuration failure, since the current implementation catches database errors.

Useful database checks (in a terminal with the paths and environment loaded above):

```powershell
mongosh "$env:MONGODB_URI" --quiet --eval 'db.getSiblingDB("game_intelligence").game_details.countDocuments({})'
& $psql -d "$env:POSTGRES_URL" -c "SELECT extversion FROM pg_extension WHERE extname = 'vector';"
& $psql -d "$env:POSTGRES_URL" -c "SELECT embedding_model, vector_dims(embedding) AS dimensions, COUNT(*) FROM game_embeddings GROUP BY embedding_model, vector_dims(embedding);"
```

Expect 12 MongoDB documents and 12 vectors belonging to the same model and dimension. Recommendations currently use an existing game's vector; a live natural-language search box is not implemented. If login returns `500`, check the server terminal, MySQL credentials/database, and `SESSION_SECRET`. A `401` indicates invalid credentials. The first page load can take longer while Next.js compiles.

---

## Demo Accounts (Password: `password123`)

| Name | Email | Role | Permitted Actions |
|---|---|---|---|
| **Sreejith (Admin)** | `sreejith@example.com` | `ADMIN` | Wishlists, Target Matches, Admin Price Recording |
| **Somesh (Admin)** | `somesh@example.com` | `ADMIN` | Wishlists, Target Matches, Admin Price Recording |
| **Aarav (User 1)** | `aarav@example.com` | `USER` | Wishlists, Target Matches (Cannot record prices) |
| **Diya (User 2)** | `diya@example.com` | `USER` | Private wishlists (Cannot view Aarav's wishlists) |
