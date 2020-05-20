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
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
heroku-change-data-capture/0.0.0 darwin-x64 node-v12.15.0
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example data:cdc:create`](#oclif-example-datacdccreate)
* [`oclif-example data:cdc:destroy [CONNECTOR]`](#oclif-example-datacdcdestroy-connector)
* [`oclif-example data:cdc:info [CDCID]`](#oclif-example-datacdcinfo-cdcid)
* [`oclif-example data:cdc:wait [CONNECTOR]`](#oclif-example-datacdcwait-connector)

## `oclif-example data:cdc:create`

create a new Postgres Connector attached to your Kafka cluster

```
USAGE
  $ oclif-example data:cdc:create

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

## `oclif-example data:cdc:destroy [CONNECTOR]`

destroy a Postgres Connector

```
USAGE
  $ oclif-example data:cdc:destroy [CONNECTOR]

EXAMPLE
  $ heroku data:cdc:destroy gentle-connector-1234
```

_See code: [src/commands/data/cdc/destroy.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/destroy.ts)_

## `oclif-example data:cdc:info [CDCID]`

get information about a CDC Connection

```
USAGE
  $ oclif-example data:cdc:info [CDCID]

OPTIONS
  --json  output in json format

EXAMPLES
  $ heroku cdc ad2a0126-aee2-4815-8e95-8367e3a2984b
  $ heroku cdc ad2a0126-aee2-4815-8e95-8367e3a2984b --json
```

_See code: [src/commands/data/cdc/info.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/info.ts)_

## `oclif-example data:cdc:wait [CONNECTOR]`

wait for your Postgres Connector to be provisioned

```
USAGE
  $ oclif-example data:cdc:wait [CONNECTOR]

EXAMPLE
  $ heroku data:cdc:wait gentle-connector-1234
```

_See code: [src/commands/data/cdc/wait.ts](https://github.com/heroku/heroku-change-data-capture/blob/v0.0.0/src/commands/data/cdc/wait.ts)_
<!-- commandsstop -->
