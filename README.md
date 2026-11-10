# React + TypeScript + Vite

## CI/CD: GitHub Actions and Cloudflare Pages

The workflow in [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)
runs `npm ci`, `npm run lint`, and `npm run build` using Node.js 24.
Pull requests targeting `master` run checks only. Successful pushes to
`master` upload `dist/` as an artifact, then deploy that exact artifact to
the existing Cloudflare Pages project. There are no PR preview deployments
or manual release triggers.

Production runs are serialized without cancelling an active deployment.
Immediately before deployment, the workflow checks the current `master`
commit and skips superseded builds. A push arriving after that check may
briefly leave the preceding version live until the next successful run.
Deployment failures fail the workflow; the Actions summary includes the
deployment URL after a successful production upload.

### One-time setup and cutover

1. In the existing Cloudflare Pages project, confirm the production branch
   is `master`. Keep the project, Git connection, and custom domains.
2. Review the project's build environment variables. Any values needed
   during the Vite build must be added explicitly to the workflow's build
   step through GitHub Actions variables or secrets. Cloudflare build
   variables are not automatically available to GitHub Actions. `VITE_*`
   values are included in the public browser bundle and must not contain
   secrets. The current app does not require build variables.
3. Create a Cloudflare API token with **Account → Cloudflare Pages → Edit**
   permission, scoped to the account containing the existing project.
4. In the GitHub repository, open **Settings → Secrets and variables →
   Actions** and add:

   | Name | Type | Value |
   | --- | --- | --- |
   | `CLOUDFLARE_API_TOKEN` | Repository secret | The scoped API token |
   | `CLOUDFLARE_ACCOUNT_ID` | Repository secret | The existing project's account ID |
   | `CLOUDFLARE_PAGES_PROJECT_NAME` | Repository variable | The exact existing Pages project name, not its URL |

5. Before merging the workflow to `master`, open the Cloudflare Pages
   project's **Build → Branch control** settings. Turn off **Enable
   automatic production branch deployments** and set preview branches to
   **None (Disable automatic branch deployments)**. This prevents duplicate
   deployments and ensures failed GitHub checks cannot be bypassed by a
   Cloudflare Git build. The current production site remains available.
6. Merge the workflow to `master`. In GitHub's **Actions** tab, confirm
   **Lint and build** and **Deploy to Cloudflare Pages** succeed. In
   Cloudflare, verify the deployment is marked **Production**, with the
   expected commit, and that no automatic Git build also ran. Open the
   deployment URL and existing production domain and check the page,
   JavaScript, CSS, and images load.
7. In the repository's branch protection or ruleset for `master`, require
   the **Lint and build** status check before merging. The check becomes
   selectable after its first workflow run.

Cloudflare supports [Wrangler uploads to existing Git-connected projects
with automatic deployments disabled](https://developers.cloudflare.com/pages/configuration/git-integration/#disable-automatic-deployments).
See also [Cloudflare's CI deployment guide](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).
Credentials are used only in the production deployment job; pull request
checks do not receive them.

### Troubleshooting and rollback

- **Missing GitHub Actions setting:** Add the named secret or repository
  variable above, then rerun the failed job. Do not put credentials in the
  workflow file or logs.
- **Authentication or project errors:** Check the token's permission,
  account scope, account ID, and exact Pages project name.
- **A preview deployment was created instead of production:** Set the
  existing Pages project's production branch to `master`, then rerun the
  deployment job. The workflow intentionally fails if Cloudflare reports
  a non-production upload.
- **Lint or build fails:** Run `npm ci`, `npm run lint`, and `npm run build`
  locally with Node.js 24 and fix the reported issue. Deployment is blocked
  until validation succeeds. No automated application test suite is
  configured yet.
- **Deployment skipped:** The commit is no longer the head of `master`.
  Check the workflow run for the latest commit. Older workflow reruns also
  skip deployment, so use Cloudflare rollback to restore an older version.
- **Rollback:** In the existing Pages project's deployments list, choose a
  previous successful production deployment and use **Rollback to this
  deployment**. Verify the production domain afterward. Also revert or fix
  the faulty commit through a pull request; a subsequent successful push
  to `master` will deploy again. Allow an active production workflow to
  finish, or cancel it, before rolling back so it cannot overwrite the
  rollback.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Automatic changelog

`CHANGELOG.md` records each push to `master`, including changes whose build or
deployment fails. The production workflow queues up to 100 pending runs and
updates the changelog after validation and deployment finish. PR checks run
separately and cancel outdated revisions. Generated changelog-only commits do
not supersede source builds in the deployment head check.

Each entry uses the original workflow creation timestamp in Asia/Manila, a
comparison link, and categorized PR titles or direct commit subjects. Prefer
`feat:`, `fix:`, `docs:`, `ci:`, `build:`, `test:`, or `chore:` titles; scopes
are retained and `!` marks breaking changes. Merged PRs appear once rather than
repeating their individual commits. Other titles appear under Changed.

The final job uses the built-in `GITHUB_TOKEN` with `contents: write` and
`pull-requests: read`, plus `actions: read` for the original run timestamp; no new
secret is needed. Before enabling this workflow,
verify repository Actions policies and master branch rules permit the bot to
push directly. Required PRs or status checks may block these writes: configure
an explicitly permitted automation identity before enabling, or change the
publication approach. Do not disable protections merely to clear an error.
No repository settings are changed by this implementation.

Bot commits modify only `CHANGELOG.md` and use the `[generated-changelog]`
marker. GitHub does not start another push workflow for writes using its built-in
token. If generation or publishing fails, fix the reported permission/API issue
and rerun the original failed workflow job. Manually canceled runs and queue
overflow also require rerunning the affected workflow. Source-SHA markers
prevent duplicate entries. Concurrent pushes are retried three times without
force-pushing. Force-push history rewrites are unsupported.

Run generator tests locally with `node --test scripts/*.test.mjs`.
