# GitHub Pages hosting

The public web app is deployed from `main` by [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml).

The expected URL is:

<https://oreliau.github.io/meditation-app/>

The workflow runs typechecking, Biome linting, the test suite, and Expo's static web export before publishing. It sets Expo's base URL to `/meditation-app` so links and assets work on the repository's project-page URL. The exported `index.html` is also copied to `404.html`, which lets Expo Router recover direct links and browser refreshes on GitHub Pages.

The home background already renders a theme-aware gradient fallback. Browsers without WebGPU use that fallback automatically; WebGPU remains an optional enhancement.

## One-time repository setup

In the repository settings, open **Pages** and set **Source** to **GitHub Actions**. The workflow has the required `pages: write` and `id-token: write` permissions.

For a local production export:

```sh
pnpm install --frozen-lockfile
pnpm run expo:export:github-pages
```

This writes the static site to `dist/`.
