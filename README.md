# `svelte` Migration TODO:

- [X] Get field validation and error display working.
- [X] Migrate to `vite`-based template, as the `degit`-based one is no longer maintained.
- [ ] Figure out how to keep the `pack-attack.js` external to the `svelte` files and use it via import.
- [ ] Figure out how to make CSS definitions imported from separate files.
- [X] Improve CSS so it looks better, possibly closer to the old Formik version 0.0.13.
- [X] Figure out how do populate `/build` with production optimized build for display on GitHub.
- [ ] Add form reset button?
- [ ] Add drop-down for common creatures as well as custom entry.`

---

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
