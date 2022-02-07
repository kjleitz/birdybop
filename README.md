# birdybop

## Initial setup

### Clone the repo

```bash
git clone https://github.com/kjleitz/birdybop
```

### Install dependencies for running the application

- Install [Docker](https://docs.docker.com/get-docker/) and [`docker-compose`](https://docs.docker.com/compose/install/).
- Install [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

### Install dependencies for local development

- Install [`pnpm`](https://pnpm.io/installation) (and Node.js, if not installed)
- Install Ruby (recommended method: [Install `rvm`](https://rvm.io/rvm/install) and then `cd path/to/birdybop && rvm install "$(cat backend/.ruby-version)"`)

You'll also need the front-end dependencies and the back-end dependencies installed for tooling (linters, testing, etc.).

So, `cd` into the project directory (`cd path/to/birdybop`), and then:

```bash
cd frontend
pnpm install
cd ../backend
bundle install
```

**NOTE:** Make sure you have appropriate extensions for ESLint and Rubocop installed in your editor, and that they're working properly. Vetur (an extension for Vue development) is also recommended if you will be working on UI changes in `birdybop/frontend`.

### Start the application

Run the stack:

```bash
docker-compose up
```

### Set up the database

Create the PostgreSQL database, load the schema, and seed it with some example data:

```bash
docker-compose exec backend bundle exec rake db:setup
```

## Run the application

### ...in the foreground

You can start the stack using `docker-compose`:

```bash
docker-compose up
```

### ...in the background

Run it in the background:

```bash
docker-compose up -d
```

Tail the logs:

```bash
docker-compose logs -f
```

Stop the application:

```bash
docker-compose down
```

**NOTE:** Database data will not be removed unless the `--volumes` option is specified.

## Debug the application

Docker is weird. I haven't worked out how to get `binding.pry_remote` working for the back end, but you _can_ use `binding.pry`. Hit the breakpoint, then run `docker attach birdybop_backend_1`. It will attach but not give you any kind of prompt. That's okay; the prompt will appear once you type something and hit "enter." You'll be attached to the REPL from `binding.pry` now. Do your thing. Press <kbd>ctrl+d</kbd> (or type `exit`) to exit the REPL, like normal. Press <kbd>ctrl+p</kbd> then <kbd>ctrl+q</kbd> to exit the attached docker process without quitting it (which is what would happen if you pressed <kbd>ctrl+c</kbd>).

## Contributing

I mean, go ham.

- Do not use `@ts-ignore`
- Please fix warnings and errors reported by ESLint and Rubocop
- If you modify the Terraform file(s), run `terraform fmt` to format them, and `terraform validate` to make sure they're valid

## TODO

- Consider keeping the crawler and Solr database for sites that aren't present in Searx (user-submitted). See [the Searx docs for integrating with Solr](https://searx.github.io/searx/blog/search-indexer-engines.html#solr) if it seems like a decent idea.
