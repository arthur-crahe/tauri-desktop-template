---
description: Cut a release end-to-end — bump the version everywhere, run the quality gate, commit, tag, and push so the GitHub Actions pipeline builds a draft Release.
argument-hint: "[version X.Y.Z | patch | minor | major]"
disable-model-invocation: true
allowed-tools: Read, Edit, Bash(git status:*), Bash(git rev-parse:*), Bash(git fetch:*), Bash(git ls-remote:*), Bash(git tag:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git log:*), Bash(pnpm:*)
---

# Release

Cut a full release for version/bump: **$1**

> Before the first release, replace the `OWNER/REPO` placeholders below (and in `.github/workflows/release.yml`, `src-tauri/tauri.conf.json`) with your GitHub `owner/repo`, and configure updater signing — see `README.md`.

## Current state
- Branch: !`git rev-parse --abbrev-ref HEAD`
- Working tree (empty = clean): !`git status --short`
- Existing release tags: !`git tag --list 'app-v*' --sort=-v:refname`

## Procedure

Do these in order. **Stop and report immediately if any check fails — never push a half-finished release.**

1. **Preconditions.** Abort unless all hold:
   - current branch is `main`;
   - the working tree is clean (no uncommitted changes);
   - `main` is up to date with the remote — run `git fetch --tags origin`, then confirm `git rev-parse main` equals `git rev-parse origin/main`.

2. **Resolve the target version** from `$1` and the current `version` in `src-tauri/tauri.conf.json`:
   - a semver `X.Y.Z` → use it as-is;
   - `patch` / `minor` / `major` → increment the current version accordingly.
   The target must be **≥** the current version, and the tag `app-v<target>` must not already exist **on the remote** — verify with `git ls-remote --tags origin "app-v<target>"` and abort if it returns anything. State the resolved version explicitly.

3. **Quality gate** — run all, require each to pass, abort on the first failure:
   - `pnpm install --frozen-lockfile`
   - `pnpm typecheck`
   - `pnpm lint`
   - `pnpm test`

4. **Bump the version** to the target — it must be identical across all four files:
   - `src-tauri/tauri.conf.json` → `"version"`
   - `package.json` → `"version"`
   - `src-tauri/Cargo.toml` → `[package]` `version`
   - `src-tauri/Cargo.lock` → the `version` line in the `name = "tauri-desktop-template"` package block (match it in context; other packages may share the same number)

   Skip this step if the target already equals the current version (e.g. the very first release) — then there is no bump commit and the tag lands on the current `HEAD`, so make sure `HEAD` is the intended release point.

5. **Commit** the bump — skip if nothing changed: `git commit -am "chore(release): v<target>"`.

6. **Verify, then tag.** Re-read `src-tauri/tauri.conf.json` and confirm its `version` is exactly `<target>` — the pipeline derives the Release tag from this, so it MUST equal the git tag; abort on mismatch. Then `git tag app-v<target>` ← the `app-v` prefix is what triggers `.github/workflows/release.yml`.

7. **Push**: `git push origin main`, then `git push origin app-v<target>`.

8. **Report**:
   - the tag and version pushed;
   - the pipeline run → https://github.com/OWNER/REPO/actions
   - that a **draft** Release will appear at https://github.com/OWNER/REPO/releases once the `ubuntu-22.04` + `windows-latest` matrix finishes, with the installers (.deb/.rpm/.AppImage/.exe/.msi) attached.

**Do NOT publish the Release.** The pipeline creates it as a draft on purpose — the user reviews and publishes it.
