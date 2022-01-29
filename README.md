# birdybop

## Initial setup

### Install dependencies

Install [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/).

### Start the application

Run the stack:

```
docker-compose up
```

### Set up the database

Create the PostgreSQL database, load the schema, and seed it with some example data:

```
docker-compose exec backend bundle exec rake db:setup
```

## Run the application

### ...in the foreground

You can start the stack using `docker-compose`:

```
docker-compose up
```

### ...in the background

Run it in the background:

```
docker-compose up -d
```

Tail the logs:

```
docker-compose logs -f
```

Stop the application:

```
docker-compose down
```

**NOTE:** Database data will not be removed unless the `--volumes` option is specified.
