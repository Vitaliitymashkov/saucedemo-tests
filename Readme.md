# Saucedemo UI Tests

Playwright + TypeScript end-to-end test suite for [saucedemo.com](https://www.saucedemo.com).

## Prerequisites
- Node.js 18+
- npm 9+
- Playwright 1.58.2+ (to install: `npm i playwright`)
- package-lock.json should be tracked in order to run tests in CI

- To set up github secrets run: `./set-github-secrets.sh`
    - You need to be logged in to github CLI: `gh auth login` (to install: `brew install gh`)
    - You need to have a personal access token with the following scopes: `repo`, `read:org`, `workflow`

## To run tests in CI without new changes use the following command:
    - 'git commit --allow-empty -m "Trigger GitHub Actions"'
    - 'git push vt-origin main'

## To use Claude AI for test generation
- Use `CLAUDE.md` for context setup and specific instructions

## Project Structure

- `pages/` — Page Object Model classes
- `tests/e2e/` — End-to-end test files
- `test-data/` — Test data files (JSON fixtures, etc.)
- `playwright.config.ts` — Playwright configuration (reads BASE_URL from .env)

## Conventions

- Use the Page Object Model pattern: keep selectors and page interactions in `pages/`, tests in `tests/e2e/`.
- Name test files `*.spec.ts`.
- Name page objects `*.page.ts`.
- Use `dotenv` for environment variables — copy `.env.example` to `.env` and fill in values.
- HTML reporter is configured by default; reports go to `playwright-report/`.
- Screenshots are captured only on failure; traces are recorded on first retry.

## Commands
Use `npm ...` commands instead of full `npx ...`


- `npm test` — run all tests
- `npm run test:ui` — run all tests in UI mode
- `npm run test:ui:debug` — run all tests in UI mode with debugging
- `npm run sr` — show test report

### Not recommended, but operational
- `npx playwright test --project=chromium` — run tests in a specific browser - chromium
- `npx playwright test --project=firefox` — run tests in a specific browser - firefox
- `npx playwright test --project=webkit` — run tests in a specific browser - webkit (macOS only)
- `npx playwright test -g "standard_user logs in successfully"` — run tests by name pattern
- `npx playwright show-report` — open the HTML report