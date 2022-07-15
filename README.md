# Ecosystem DAO

Front end application for the Ecosystem DAO. The Ecosystem DAO is an
open source project desiged to engage and include the Stacks Community
in decision making about the Stacks Network and related projects.

## Creating this project

Project created using

```bash
npm create svelte stxeco-svelte
```

With options

- Typescript -> yes
- Eslint -> yes

See also dev notes below for instructions on polyfilling Buffer into webpack 5.

### File Structure

The application is structured according to [this](https://kit.svelte.dev/docs/project-structure).

## Developing

Clone the repo and install dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

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

### Dev Notes

The Vite config has been tailored to include a ployfil for the Buffer library which
Stacks.js library requires.

```js
npm install -D buffer
npm install -D rollup-plugin-polyfill-node
```

See following;

- [How to polyfill Buffer with Webpack 5
  ](https://viglucci.io/how-to-polyfill-buffer-with-webpack-5)
- [Working with Webpack](https://cli.vuejs.org/guide/webpack.html#chaining-advanced)
- [Uncaught ReferenceError: Buffer is not defined](https://stackoverflow.com/questions/68707553/uncaught-referenceerror-buffer-is-not-defined)
- [How to Polyfill node core modules in webpack 5](https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5)

## Reference

For Svelte / Svelte Kit;

- [create-svelte](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).
- [svelte user guide](https://svelte.dev/tutorial/writable-stores)
- [svelte kit user guide](https://kit.svelte.dev/docs/introduction#before-we-begin)

For Stacks.js see;

- [Hiro Systesm - Stacks.js](https://github.com/hirosystems/stacks.js)

For Ecosystem DAO see;

- [GitHub](https://github.com/Clarity-Innovation-Lab/ecosystem-dao)
