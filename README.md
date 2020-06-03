heroku-change-data-capture
==========================

A Heroku CLI Plugin for managing Change Data Capture connections

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/heroku-change-data-capture.svg)](https://npmjs.org/package/heroku-change-data-capture)
[![CircleCI](https://circleci.com/gh/heroku/heroku-change-data-capture/tree/master.svg?style=shield)](https://circleci.com/gh/heroku/heroku-change-data-capture/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/heroku-change-data-capture.svg)](https://npmjs.org/package/heroku-change-data-capture)
[![License](https://img.shields.io/npm/l/heroku-change-data-capture.svg)](https://github.com/heroku/heroku-change-data-capture/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g heroku-change-data-capture
$ heroku COMMAND
running command...
$ heroku (-v|--version|version)
heroku-change-data-capture/0.0.0 darwin-x64 node-v12.15.0
$ heroku --help [COMMAND]
USAGE
  $ heroku COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`heroku data:cdc`](#heroku-datacdc)
* [`heroku data:cdc:create`](#heroku-datacdccreate)
* [`heroku data:cdc:destroy [CONNECTOR]`](#heroku-datacdcdestroy-connector)
* [`heroku data:cdc:info [CDCID]`](#heroku-datacdcinfo-cdcid)
* [`heroku data:cdc:pause [CONNECTOR]`](#heroku-datacdcpause-connector)
* [`heroku data:cdc:resume [CONNECTOR]`](#heroku-datacdcresume-connector)
* [`heroku data:cdc:wait [CONNECTOR]`](#heroku-datacdcwait-connector)

## `heroku data:cdc`

List all Postgres connectors for a particular app or addon

```
USAGE
  $ heroku data:cdc

OPTIONS
  -a, --app=app        app to run command against
  -r, --remote=remote  git remote of app to use
  --addon=addon        The ID or name for the addon your your connector is attached to
  --json               Return the results as json
  --table              Return the results as a table

ALIASES
  $ heroku data:cdc:list

EXAMPLES
  heroku data:cdc -a your-app
  heroku data:cdc --app=your-app --json
  heroku data:cdc --addon=your-postgres-addon --table
```

_See code: [src/commands/data/cdc/index.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/index.ts)_

## `heroku data:cdc:create`

create a new Postgres Connector attached to your Kafka cluster

```
USAGE
  $ heroku data:cdc:create

OPTIONS
  -a, --app=app      app to run command against
  -t, --table=table  (required) Tables to include
  --exclude=exclude  Columns to exclude
  --source=source    (required) The name or ID of the Postgres instance whose change data you want to store
  --store=store      (required) The name or ID of the Kafka instance that will store the change data

EXAMPLES
  $ heroku data:cdc:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.posts --table 
  public.comments
  $ heroku data:cdc:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.users --exclude 
  public.users.password
```

_See code: [src/commands/data/cdc/create.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/create.ts)_

## `heroku data:cdc:destroy [CONNECTOR]`

destroy a Postgres Connector

```
USAGE
  $ heroku data:cdc:destroy [CONNECTOR]

EXAMPLE
  $ heroku data:cdc:destroy gentle-connector-1234
```

_See code: [src/commands/data/cdc/destroy.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/destroy.ts)_

## `heroku data:cdc:info [CDCID]`

get information about a CDC Connection

```
USAGE
  $ heroku data:cdc:info [CDCID]

OPTIONS
  --json  output in json format

EXAMPLES
  $ heroku cdc ad2a0126-aee2-4815-8e95-8367e3a2984b
  $ heroku cdc ad2a0126-aee2-4815-8e95-8367e3a2984b --json
```

_See code: [src/commands/data/cdc/info.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/info.ts)_

## `heroku data:cdc:pause [CONNECTOR]`

Pause change event creation on a Postgres connector

```
USAGE
  $ heroku data:cdc:pause [CONNECTOR]

EXAMPLE
  heroku data:cdc:pause my-sweet-connector
```

_See code: [src/commands/data/cdc/pause.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/pause.ts)_

## `heroku data:cdc:resume [CONNECTOR]`

Resume change event creation on a Postgres connector

```
USAGE
  $ heroku data:cdc:resume [CONNECTOR]

EXAMPLE
  heroku data:cdc:resume my-sweet-connector
```

_See code: [src/commands/data/cdc/resume.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/resume.ts)_

## `heroku data:cdc:wait [CONNECTOR]`

wait for your Postgres Connector to be provisioned

```
USAGE
  $ heroku data:cdc:wait [CONNECTOR]

EXAMPLE
  $ heroku data:cdc:wait gentle-connector-1234
```

_See code: [src/commands/data/cdc/wait.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/wait.ts)_
<!-- commandsstop -->
