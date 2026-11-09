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

### 1. Database Initialization
Ensure your local MySQL service (`MySQL80`) is running, then load the schema and seeds:

```powershell
# From the repository root
Get-Content database/schema.sql -Raw | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
Get-Content database/seed.sql -Raw | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

### 2. Run Application
```powershell
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Optional Somesh Features (F07 and F08)

MongoDB and PostgreSQL are optional enhancements: the MySQL catalog continues to work if either service is unavailable. Set `MONGODB_URI`, `POSTGRES_URL`, and a strong `SESSION_SECRET` in `.env.local`, then initialize the two extension stores:

```powershell
# MongoDB extended descriptions
mongosh $env:MONGODB_URI database/mongodb-seed.js

# pgvector semantic ranking
Get-Content database/postgres-vector.sql -Raw | psql $env:POSTGRES_URL
```

`GET /api/games/{gameId}/similar?limit=6` returns the pgvector-ranked games, hydrated from the authoritative MySQL catalog.

---

## Demo Accounts (Password: `password123`)

| Name | Email | Role | Permitted Actions |
|---|---|---|---|
| **Sreejith (Admin)** | `sreejith@example.com` | `ADMIN` | Wishlists, Target Matches, Admin Price Recording |
| **Somesh (Admin)** | `somesh@example.com` | `ADMIN` | Wishlists, Target Matches, Admin Price Recording |
| **Aarav (User 1)** | `aarav@example.com` | `USER` | Wishlists, Target Matches (Cannot record prices) |
| **Diya (User 2)** | `diya@example.com` | `USER` | Private wishlists (Cannot view Aarav's wishlists) |
