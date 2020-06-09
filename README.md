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
$ npm install -g @heroku-cli/data-connectors-plugin
$ heroku COMMAND
running command...
$ heroku (-v|--version|version)
@heroku-cli/data-connectors-plugin/0.0.0 darwin-x64 node-v12.15.0
$ heroku --help [COMMAND]
USAGE
  $ heroku COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`heroku data:connectors`](#heroku-dataconnectors)
* [`heroku data:connectors:create`](#heroku-dataconnectorscreate)
* [`heroku data:connectors:destroy [CONNECTOR]`](#heroku-dataconnectorsdestroy-connector)
* [`heroku data:connectors:info [CONNECTOR]`](#heroku-dataconnectorsinfo-connector)
* [`heroku data:connectors:pause [CONNECTOR]`](#heroku-dataconnectorspause-connector)
* [`heroku data:connectors:resume [CONNECTOR]`](#heroku-dataconnectorsresume-connector)
* [`heroku data:connectors:update [CONNECTOR]`](#heroku-dataconnectorsupdate-connector)
* [`heroku data:connectors:wait [CONNECTOR]`](#heroku-dataconnectorswait-connector)

## `heroku data:connectors`

List all Data Connectors for a particular app or addon

```
USAGE
  $ heroku data:connectors

OPTIONS
  -a, --app=app        app to run command against
  -r, --remote=remote  git remote of app to use
  --addon=addon        The ID or name for the addon your your connector is attached to
  --json               Return the results as json
  --table              Return the results as a table

ALIASES
  $ heroku data:connectors:list

EXAMPLES
  heroku data:connectors -a your-app
  heroku data:connectors --app=your-app --json
  heroku data:connectors --addon=your-postgres-addon --table
```

_See code: [src/commands/data/connectors/index.ts](https://github.com/heroku/data-connectors-plugin/blob/v0.0.0/src/commands/data/connectors/index.ts)_

## `heroku data:connectors:create`

create a new Data Connector

```
USAGE
  $ heroku data:connectors:create

OPTIONS
  -t, --table=table  (required) Tables to include
  --exclude=exclude  Columns to exclude
  --source=source    (required) The name or ID of the database instance whose change data you want to store
  --store=store      (required) The name or ID of the database instance that will store the change data

EXAMPLES
  $ heroku data:connectors:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.posts 
  --table public.comments
  $ heroku data:connectors:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.users 
  --exclude public.users.password
```

_See code: [src/commands/data/connectors/create.ts](https://github.com/heroku/data-connectors-plugin/blob/v0.0.0/src/commands/data/connectors/create.ts)_

## `heroku data:connectors:destroy [CONNECTOR]`

destroy a Data Connector

```
USAGE
  $ heroku data:connectors:destroy [CONNECTOR]

EXAMPLE
  $ heroku data:connectors:destroy gentle-connector-1234
```

_See code: [src/commands/data/connectors/destroy.ts](https://github.com/heroku/data-connectors-plugin/blob/v0.0.0/src/commands/data/connectors/destroy.ts)_

## `heroku data:connectors:info [CONNECTOR]`

get information about a Data Connector

```
USAGE
  $ heroku data:connectors:info [CONNECTOR]

OPTIONS
  --json  output in json format

EXAMPLES
  $ heroku data:connectors:info gentle-connector-1234
  $ heroku data:connectors:info gentle-connector-1234 --json
```

_See code: [src/commands/data/connectors/info.ts](https://github.com/heroku/data-connectors-plugin/blob/v0.0.0/src/commands/data/connectors/info.ts)_

## `heroku data:connectors:pause [CONNECTOR]`

Pause change event creation on a Data Connector

```
USAGE
  $ heroku data:connectors:pause [CONNECTOR]

EXAMPLE
  $ heroku data:connectors:pause gentle-connector-1234
```

_See code: [src/commands/data/connectors/pause.ts](https://github.com/heroku/data-connectors-plugin/blob/v0.0.0/src/commands/data/connectors/pause.ts)_

## `heroku data:connectors:resume [CONNECTOR]`

Resume change event creation on a Data Connector

```
USAGE
  $ heroku data:connectors:resume [CONNECTOR]

EXAMPLE
  $ heroku data:connectors:resume gentle-connector-1234
```

_See code: [src/commands/data/connectors/resume.ts](https://github.com/heroku/data-connectors-plugin/blob/v0.0.0/src/commands/data/connectors/resume.ts)_

## `heroku data:connectors:update [CONNECTOR]`

update the settings for a Data Connector

```
USAGE
  $ heroku data:connectors:update [CONNECTOR]

OPTIONS
  --setting=setting  (required)

EXAMPLE
  $ heroku data:connectors:update ad2a0126-aee2-4815-8e95-8367e3a2984b --setting key=value --setting otherKey=otherValue
```

_See code: [src/commands/data/connectors/update.ts](https://github.com/heroku/data-connectors-plugin/blob/v0.0.0/src/commands/data/connectors/update.ts)_

## `heroku data:connectors:wait [CONNECTOR]`

wait for your Data Connector to be provisioned

```
USAGE
  $ heroku data:connectors:wait [CONNECTOR]

EXAMPLE
  $ heroku data:connectors:wait gentle-connector-1234
```

_See code: [src/commands/data/connectors/wait.ts](https://github.com/heroku/data-connectors-plugin/blob/v0.0.0/src/commands/data/connectors/wait.ts)_
<!-- commandsstop -->
