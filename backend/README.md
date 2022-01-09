# birdybop back end

## setup

### install `postgres`

Install PostgreSQL: https://www.postgresql.org/download/

### install `redis`

Install Redis: https://redis.io/topics/quickstart#installing-redis

### install `rvm`

Install RVM: https://rvm.io/

### clone the project and enter the `backend/` directory

```
git clone git@github.com:kjleitz/birdybop.git
cd birdybop/backend
```

### install `ruby`

```
rvm install $(cat .ruby-version)
```

### install dependencies

```
bundle
```

### create database user

```
sudo -u postgres createuser -s birdybop -P
```

You will be prompted for a password and password confirmation; enter `birdybop` for both.

### create the databases, load the schema, seed the development database

```
rake db:setup
```

### run the server

```
rails s
```

(runs on port 3000 by default)

### run tests

```
rails test
```

### run the linter

```
rubocop
```

## TODO

### voting weight

- voting weight should be inversely proportional to the number of accounts associated with the same IP address
- literally everything else
