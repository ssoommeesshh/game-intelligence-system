# Shared project brief

## Objective

Help players discover games by meaning and compare worthwhile deals using wishlist preferences, historical prices, and review sentiment. The platform should demonstrate meaningful database analysis beyond basic CRUD.

## Planned user flows

1. A user registers/signs in, searches with a natural-language description, and filters relevant games.
2. A user maintains wishlists with target prices and priorities, then sees explainable deal scores.
3. A user examines game price history and review sentiment to support a purchase decision.
4. An admin maintains approved catalog data and oversees ingestion/analytics through authorized server operations.

These flows are proposals for implementation after the work split. The deal-score formula, sentiment method, embedding model, ingestion sources/licensing, refresh cadence, currency policy, and UI details remain to be agreed. Do not present invented numbers or scores as real market data.

## Architecture

```text
Browser -> Next.js interface -> server-side API/auth/validation
                                 |-> MySQL: catalog, users, wishlists, prices
                                 |-> MongoDB: reviews and sentiment metadata
                                 |-> Qdrant: game embeddings and similarity search
```

MySQL is the source of truth for game identity. MongoDB documents and Qdrant points refer to its `game_id`. External-store/provider identifiers are mappings, not replacements for the internal primary key. Database credentials remain server-side.

## Why these databases

| Store | Justification |
| --- | --- |
| MySQL | Structured relationships, joins, constraints, transactions, historical-price aggregation |
| MongoDB | Review documents can have provider-specific fields and changing metadata; aggregation supports sentiment summaries |
| Qdrant | Similarity retrieval over embedded game descriptions supports semantic discovery |

Adding MongoDB and Qdrant is justified by separate review and retrieval workloads. They do not add SQL tables to the frozen relational design.

## Course requirement checklist

All items below remain pending implementation unless explicitly marked otherwise.

| Requirement | Planned evidence/deliverable | Status |
| --- | --- | --- |
| Two-member team; each works on DB and app | Agreed work split, individual commits, demo ownership | Pending |
| ER diagram and relational schema | Supplied diagrams; 15-table design notes; final typed data dictionary | References and notes included; DDL pending |
| SQL plus NoSQL/vector | MySQL, MongoDB, Qdrant integrations | Pending |
| DDL: CREATE, ALTER, DROP, keys, constraints, indexes | Versioned scripts and safe demonstrations on disposable data | Pending |
| DML: INSERT, UPDATE, DELETE, SELECT | Catalog/wishlist operations and reproducible queries | Pending |
| JOIN, GROUP BY, HAVING, ORDER BY, aggregates, subqueries | Price/deal/report queries with expected results | Pending |
| At least four advanced SQL concepts | Proposed: transactions, views, stored procedure/function, triggers, indexing | Pending; choose and demonstrate at least four |
| At least one advanced NoSQL/vector concept | Review aggregation and/or vector similarity search | Pending |
| Vector documentation | Embedded fields, model/version, dimensions, metric, metadata, filters, retrieval strategy | Pending |
| Functional Next.js app with API/database integration | Search, forms, tables, dashboards and backend operations | Starter only |
| Backend authentication; minimum two roles | User/admin permissions and authorization tests | Pending |
| Database validation/integrity | Keys, constraints, transactions and failing-input test cases | Pending |
| Individual GitHub contributions | Authored commits and reviewed pull requests | Handoff prepared; team work pending |
| Final documentation and demonstration | Objectives, requirements, architecture, schema, implementation, queries, screenshots, testing, conclusion | Planning docs started |

Use the supplied course requirements as the authority for evaluation. Any destructive DDL demonstration must use a disposable test schema, not the shared development database.

## Milestones after work split confirmation

1. Finalize attribute types, constraints and the typed dictionary without changing the agreed entities; agree cross-database contracts.
2. Implement and test DDL, reproducible sample data, meaningful queries, and advanced database features.
3. Integrate authentication and the planned user/admin flows through Next.js server code.
4. Integrate review aggregation, embeddings and semantic retrieval with documented methods.
5. Complete integrity/authorization tests, screenshots, demonstration scripts, and the final report.

No deadlines or teammate assignments have been invented here.
