# Contributing

## Development

```sh
yarn install
npx playwright install chromium
yarn dev    # serves index.html with five-server for manual testing
```

This repo is pinned to Node 24 via `.node-version`.

## Testing

Tests run in a real browser (via [Playwright](https://playwright.dev/)) rather than a mocked DOM, since this library's whole job is orchestrating real CSS transition events.

```sh
yarn test
```

For interactive/watch mode, use `npx web-test-runner --watch`. Tests also run in CI on every pull request (`.github/workflows/ci.yml`) and must pass before merging.

## Pull requests

- Branch off `main`, open a PR against `main`.
- Keep `debut.js`/`debut.min.js` out of commits — they're build artifacts (gitignored) generated from `lib/` via `yarn build`/`yarn build:min`, not hand-edited.
- CI runs the test suite and a build sanity check on every PR.

## Releasing

Releases are cut manually, not automated in CI.

1. On `main`, with everything you want released already merged:
   ```sh
   npm version patch --no-git-tag-version   # or `minor` / `major`
   ```
2. Commit the version bump using the version number as the message, matching existing tags (e.g. `0.12.1`):
   ```sh
   git add package.json
   git commit -m "0.12.1"
   git tag v0.12.1
   git push origin main --tags
   ```
3. Publish to npm. `prepack` runs automatically and rebuilds `debut.js`/`debut.min.js` from `lib/` before publishing, so there's no separate build step:
   ```sh
   npm publish
   ```
   This requires being logged in as a package owner (`npm whoami` to check, `npm login` if not).
