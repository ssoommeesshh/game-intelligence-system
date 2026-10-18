# Setup, dependency review, and validation

## Baseline

Prepared on 2026-10-18. The current checkout is `C:\Users\harih\OneDrive\Desktop\somesh\sem-5\dbms\miniproj`; the repository is https://github.com/ssoommeesshh/game-intelligence-system and the existing branch is `master`.

At the owner's request, the app was moved here from `C:\Users\harih\game-intelligence-platform`, preserving source files, installed dependencies, and Git history/remotes. The old development server was stopped for the move. A teammate can clone anywhere, install dependencies with `npm ci`, and run commands from that clone's root. Do not copy `node_modules` or `.next` between machines. The reference PDFs and ER images are included under `docs/reference` so the checkout is self-contained for planning. The existing root-level originals were preserved and verified to match the tracked reference copies; those local duplicates are ignored by Git.

Versions declared in `package.json`: Next.js 16.4.2, React/React DOM 19.3.0, `eslint-config-next` 16.4.2, and ESLint range `^9`. The installed top-level ESLint is 9.39.5. The initial machine's Node.js/npm versions were reported as 22.19.0/10.9.3.

## npm audit review

`npm audit --json` reports **five high-severity findings** in the dependency chain:

```text
eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces
```

The underlying reported advisory is [braces stack-exhaustion denial of service, GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), affecting `braces <=3.0.3`. The five package entries include propagated findings; they are not five separate root advisories. The chain is rooted in a development lint dependency; this does not remove the need to review/fix it or establish that all runtime dependencies are safe.

npm's reported fix is `eslint-config-next` 14.2.35, marked as a semver-major change. That would downgrade the existing 16.4.2 lint configuration. No audit fix, dependency override, package edit, or lockfile update was applied. Review compatible remediation before making changes, then verify lint/build and rerun the audit.

The previously reported deprecated-ESLint installation warning has not been reproduced by a fresh installation during this handoff. The installed top-level ESLint is 9.39.5; do not assume the warning identified that exact package/version. Capture the full warning and dependency path on the next installation before deciding on remediation.

## Verification record

- Starter previously ran at http://localhost:3000, as reported during initial setup.
- `npm run lint`: passed during this handoff.
- `npm run build`: passed, including compilation, TypeScript, and static page generation.
- `git diff --check` and the staged whitespace check: passed.
- Reviewed the tracked starter and checked for common credential patterns; no matches were reported. Only documentation and supplied course/ER references were staged for the handoff commit. Dependencies and environment files remain excluded.
- Repository visibility was initially changed to private, then changed to public at the owner's explicit request during relocation.
- After relocation, the generated `.next` cache was cleared and `npm run build` passed from the new directory. The development server was restarted here, and an HTTP request to `http://127.0.0.1:3000` returned 200 with the starter page.
- No feature tests exist yet because project-specific functionality has not been implemented.

Keep future setup changes and unresolved blockers in this file so each teammate can reproduce the same environment.
