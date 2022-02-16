# birdybop front end

## setup

### clone the project and enter the `frontend/` directory

```
git clone git@github.com:kjleitz/birdybop.git
cd birdybop/frontend
```

### install `pnpm`

Install PNPM: https://pnpm.io/installation

### install dependencies

```
pnpm i
```

### start the dev server

```
pnpm run serve
```

(runs on port 8080 by default)

### build for production

```
pnpm run build
```

### run the linter

```
pnpm run lint
```

### run the tests

```
pnpm run test:unit
```

## TODO

- literally everything

### Migrating to Vue 3

- disable TS server in this workspace to use Volar's "Takeover Mode" when finished
- migrate tests over
- remove `tsconfig.test.json` and `vue.config.js`
- move to `pinia`
- remove `public/index.html`
