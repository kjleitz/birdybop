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

> **NOTE:** Make sure you have appropriate extensions for ESLint and Rubocop installed in your editor, and that they're working properly. Vetur (an extension for Vue development) is also recommended if you will be working on UI changes in `birdybop/frontend`.

> **NOTE:** These commands install the dependencies locally, which might be necessary for your editor to pick up on packages for, e.g., extensions like ESLint, but you will need to use `docker-compose` to run the application and those dependencies will be maintained separately inside the containers.

### Install/configure VSCode extensions

> **NOTE:** If you're not using VSCode, you can skip this, but you'll want to make sure you use similar functionality in whatever editor you do use.

Install the following extensions:

- "ESLint" (`dbaeumer.vscode-eslint`)
- "Ruby" (`rebornix.ruby`)
- "VSCode Ruby" (`wingrunr21.vscode-ruby`)
- "ruby-rubocop" (`misogi.ruby-rubocop`)
- "Vue Language Features (Volar)" (`johnsoncodehk.volar`)
- "TypeScript Vue Plugin (Volar)" (`johnsoncodehk.vscode-typescript-vue-plugin`)

> **NOTE:** If you have the "Vetur" (`octref.vetur`) extension installed, you will need to disable it for this workspace. Find the extension in the extensions sidebar, click the gear icon, and select _"Disable (Workspace)"._

> **NOTE:** You will also need to disable the built-in TypeScript language extension in order to allow Volar to use "Take Over Mode" for TypeScript language features. Search `@builtin typescript` in the extensions sidebar, find the extension called "TypeScript and JavaScript Language Features" (`vscode.typescript-language-features`), click the gear icon, and select _"Disable (Workspace)"._

> **NOTE:** You will likely need to quit and re-open your editor after these changes.

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

## Run stuff inside the docker containers

Sometimes you're gonna need to do stuff you'd normally just do locally, like `bundle add foobar` to add a gem to the Ruby/Rails application (`backend` in `docker-compose.yml`), or `pnpm run lint` to run the linter in the TypeScript/Vue application (`frontend` in `docker-compose.yml`).

It's difficult to remember the incantations for executing commands inside running (or stopped) containers, using `docker-compose run ...` or `docker-compose exec ...`, with or without `--entrypoints="..."`, etc. So, for your convenience, there are some scripts inside the `bin/` folder at the root of this directory which can help out.

### Specific stubs (shortcuts for common commands):

- `bin/pnpm <...args>`: acts like invoking `pnpm` inside the `frontend` service container; `pnpm` will receive any arguments you pass the script
- `bin/bundle <...args>`: acts like invoking `bundle` inside the `backend` service container; `bundle` will receive any arguments you pass the script
- `bin/rails <...args>`: acts like invoking `rails` inside the `backend` service container; `rails` will receive any arguments you pass the script
- `bin/rake <...args>`: acts like invoking `rake` inside the `backend` service container; `rake` will receive any arguments you pass the script

### General stubs (for executing arbitrary commands):

- `bin/frontend <command> <...args>`: invokes a given command inside the `frontend` service container
- `bin/backend <command> <...args>`: invokes a given command inside the `backend` service container

### Examples

```bash
# `bin/pnpm` runs `pnpm` in the `frontend` service container with given args
bin/pnpm install
bin/pnpm add -D @types/marked
bin/pnpm add -g pnpm
bin/pnpm run test:unit
bin/pnpm run lint

# `bin/frontend` runs an arbitrary command in the `frontend` service container
bin/frontend node --version
bin/frontend ls -l /app/node_modules

# `bin/bundle` runs `bundle` in the `backend` service container with given args
bin/bundle install
bin/bundle add nokogiri
bin/bundle update rails
bin/bundle exec rubocop

# `bin/rails` runs `rails` in the `backend` service container with given args
bin/rails db:migrate
bin/rails test
bin/rails g migration add_foo_to_bars foo:integer
bin/rails routes
bin/rails console

# `bin/rake` runs `rake` in the `backend` service container with given args
bin/rake some:task
bin/rake -T

# `bin/backend` runs an arbitrary command in the `backend` service container
bin/backend rubocop
bin/backend ruby --version
bin/backend pwd
```

## Maintain the application

### Installing new dependencies

If you add new packages in `frontend/package.json` (or just with `pnpm add ...`), you'll want to do a `pnpm install` inside the docker container. You can do this with `bin/frontend pnpm install`.

If you add new packages in `backend/Gemfile` (or just with `bundle add ...`), you'll want to do a `bundle install` inside the docker container. You can do this with `bin/backend bundle install`.

### Migrating the database

If you add a database migration to `backend/db/migrate` (or use `rails g migration ...`), you'll want to do a `rails db:migrate` inside the docker container. You can do this with `bin/backend rails db:migrate`.

## Debug the application

Docker is weird. I haven't worked out how to get `binding.pry_remote` working for the back end, but you _can_ use `binding.pry`. Hit the breakpoint, then run `docker attach birdybop_backend_1`. It will attach but not give you any kind of prompt. That's okay; the prompt will appear once you type something and hit "enter." You'll be attached to the REPL from `binding.pry` now. Do your thing. Press <kbd>ctrl+d</kbd> (or type `exit`) to exit the REPL, like normal. Press <kbd>ctrl+p</kbd> then <kbd>ctrl+q</kbd> to exit the attached docker process without quitting it (which is what would happen if you pressed <kbd>ctrl+c</kbd>).

## Contributing

I mean, go ham.

- Do not use `@ts-ignore`
- Please fix warnings and errors reported by ESLint and Rubocop
- If you modify the Terraform file(s), run `terraform fmt` to format them, and `terraform validate` to make sure they're valid
- Run `bin/check` to run the lints and tests for everything in one go

## TODO

- Consider keeping the crawler and Solr database for sites that aren't present in Searx (user-submitted). See [the Searx docs for integrating with Solr](https://searx.github.io/searx/blog/search-indexer-engines.html#solr) if it seems like a decent idea.
