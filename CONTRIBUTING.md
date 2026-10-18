# Team workflow

## Before implementing features

Both members must confirm responsibilities before feature development starts. Each member must contribute to **both database and application development**, as required by the course. This document does not assign ownership yet.

| Member | GitHub account | Database responsibility | Application responsibility | Review/demo responsibility |
| --- | --- | --- | --- | --- |
| Member 1 | ssoommeesshh | Pending agreement | Pending agreement | Pending agreement |
| Member 2 | Pending invitation | Pending agreement | Pending agreement | Pending agreement |

Record the agreed split in this table together. Split work into small issues with an owner, expected result, database impact, and acceptance checks. Keep integration tasks visible so neither member is blocked by undocumented assumptions.

## First-time setup

Follow the README to clone the public repository. Accept the collaborator invitation before pushing changes. Configure your own real commit identity inside your clone:

```powershell
git config user.name "Your Name"
git config user.email "your-own-verified-email@example.com"
```

Replace the example values. A verified GitHub email or your own GitHub-provided noreply email lets commits appear under your account. Never impersonate a teammate or manufacture contribution history.

## For each task

Start from a clean working tree. Commit or safely store unrelated local work before switching branches.

```powershell
git switch master
git pull --ff-only origin master
git switch -c docs/your-task-name
# Make and review your changes. Use feat/, fix/, or db/ for other task types.
git status
git diff
git add path/to/changed-file
git commit -m "docs: describe the concrete change"
git push -u origin HEAD
```

Replace example paths and branch names with your task's actual values. Open a pull request against `master`, explain what changed and how it was checked, and ask your teammate to review it. Include database changes and setup steps when relevant. Preserve each member's authorship in merged history. Do not force-push the shared branch.

After pulling changes to `package-lock.json`, run `npm ci`. Review dependency changes with the teammate rather than accepting automatic major upgrades or downgrades.

## Before committing

- Review the staged diff with `git diff --cached`.
- Run `npm run lint`; run `npm run build` for application/configuration/dependency changes.
- Keep passwords, tokens, connection strings containing credentials, local `.env` files, build output, and `node_modules` out of Git.
- Record reproducible tests and screenshots as features are completed; do not claim planned functionality already works.
- For schema changes, first document the concrete issue, impact on the frozen 15-table design, and the agreed correction.

Do not add SQL, database clients, authentication, API endpoints, or product features until the work split is confirmed. Documentation and initial setup are ready for review now.
