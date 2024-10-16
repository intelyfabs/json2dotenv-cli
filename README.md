# json2dotenv CLI

A command-line tool to quickly convert from JSON env files to `dotenv` files for use in local testing with ephemeral environments.

# Install

## With Binaries

Download a binary from the releases section ->

Then install it however you like, for example:

```sh 
sudo install downloads/dotenv-platform /usr/bin
```

or, if you have [Deno 2.0](https://deno.land/) installed:

```sh
deno install -gf https://raw.githubusercontent.com/intelyfabs/json2dotenv-cli/refs/tags/latest/main.ts -n dotenv 
```

# Usage

Give an `env.json` file:

```json
{
  "API": "http://api.ephemeral1.egg.legacy.com",
  "DB_PASSWORD": "lH1d4BkJ3",
  "DB_USER": "admin"
}
```

You can do the following:

```sh
$> dotenv env.json
```
And `dotenv` will create the file `.env` in the cwd with the following contents:

```txt
API=http://api.ephemeral1.egg.legacy.com
DB_PASSWORD=lH1d4BkJ3
DB_USER=admin
```

You can also pipe into `dotenv` like `pbpaste | dotenv > .env`
