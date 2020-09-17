import {flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {cli} from 'cli-ux'
import BaseCommand, {PostgresConnector} from '../../../lib/base'

type ConnectorInfo = Pick<
  PostgresConnector,
  'kafka_addon' |
  'postgres_addon' |
  'name' |
  'uuid' |
  'tables' |
  'excluded_columns' |
  'kafka_app' |
  'postgres_app'
>

export default class ConnectorsList extends BaseCommand {
  static description = 'List all Data Connectors for a particular app or addon\nRead more about this feature at https://devcenter.heroku.com/articles/heroku-data-connectors'

  static aliases = [
    'data:connectors:list',
  ]

  static examples = [
    'heroku data:connectors -a your-app',
    'heroku data:connectors --app=your-app --json',
    'heroku data:connectors --addon=your-postgres-addon --table',
  ]

  static flags = {
    app: flags.app(),
    remote: flags.remote(),
    addon: flags.string({
      description: 'The ID or name for the addon your your connector is attached to',
    }),
    table: flags.boolean({
      description: 'Return the results as a table',
      exclusive: ['json'],
    }),
    json: flags.boolean({
      description: 'Return the results as JSON',
      exclusive: ['table'],
    }),
  }

  async run() {
    const {flags} = this.parse(ConnectorsList)

    let connectorInfo: Array<ConnectorInfo>

    if (flags.app) {
      // make sure we have app id even if they passed app name
      const {body: app} = await this.heroku.get<Heroku.App>(`/apps/${flags.app}`)

      const response = await this.shogun.get<Array<ConnectorInfo>>(
        `/data/cdc/v0/apps/${app.id}`,
        this.shogun.defaults
      )

      connectorInfo = response.body
    } else if (flags.addon) {
      // make sure we have addon id even if the addon name
      const {body: [addon]} =  await this.heroku.post<Array<Heroku.AddOn>>('/actions/addons/resolve', {
        body: {
          addon: flags.addon,
        },
      })

      const {body: response} = await this.shogun.get<Array<ConnectorInfo>>(
        `/data/cdc/v0/addons/${addon.id}`,
        this.shogun.defaults
      )

      connectorInfo = response
    } else {
      cli.error('You must pass either the --app or --addon flag')
    }

    if (flags.json) {
      connectorInfo.forEach(v => {
        cli.styledJSON(v)
        this.log()
      })
      return
    }

    cli.styledHeader(`Data Connector info for ${flags.app || flags.addon}`)

    if (flags.table) {
      cli.table(connectorInfo, {
        name: {header: 'Connector Name'},
        kafka_addon: {
          header: 'Kafka Add-On',
          get: row => row.kafka_addon.name,
        },
        postgres_addon: {
          header: 'Postgres Add-On',
          get: row => row.postgres_addon.name,
        },
        tables: {header: 'Tables'},
        excluded_columns: {header: 'Excluded Columns'},
      })
    } else {
      connectorInfo.forEach(c => {
        cli.styledObject({
          'Connector Name': c.name,
          'Kafka Add-On': c.kafka_addon.name,
          'Postgres Add-On': c.postgres_addon.name,
          Tables: c.tables,
          'Excluded Columns': c.excluded_columns,
        })
        this.log()
      })
    }
    this.log()
  }
}
