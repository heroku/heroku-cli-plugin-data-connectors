import {flags} from '@heroku-cli/command'
import color from '@heroku-cli/color'
import cli from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

export default class ConnectorsInfo extends BaseCommand {
  static description = 'get information about a Data Connector'

  static examples = [
    '$ heroku data:connectors:info gentle-connector-1234',
    '$ heroku data:connectors:info gentle-connector-1234 --json',
  ]

  static flags = {
    json: flags.boolean({
      description: 'output in json format',
    }),
  }

  static args = [
    {
      name: 'connector',
    },
  ]

  async run() {
    const {args, flags} = this.parse(ConnectorsInfo)

    const connector = args.connector
    const {body: res} = await this.shogun.get<PostgresConnector>(
      `/data/cdc/v0/connectors/${connector}`,
      this.shogun.defaults
    )

    if (flags.json) {
      cli.styledJSON(res)
      return
    }

    if (res.status === 'creating') {
      this.log(`The Data Connector is now being provisioned for ${color.cyan(connector)}.`)
      this.log(`Run ${color.cyan(`heroku data:connectors:wait ${res.name}`)} to check the creation process.`)
      return
    }

    cli.styledHeader(`Data Connector status for ${color.cyan(connector)}`)
    cli.styledObject({
      Status: res.status,
      'Service Name': res.uuid || 'Provisioning',
    })

    if (res.topics && res.topics.length > 0) {
      this.log()
      cli.styledHeader('Configuration')
      cli.table(res.topics, {
        table_name: {header: 'Table Name'},
        topic_name: {header: 'Topic Name'},
      })
    }

    if (res.excluded_columns && res.excluded_columns.length > 0) {
      this.log()
      this.log(color.bold('Excluded Columns'))

      res.excluded_columns.forEach(column => this.log(column))
    }

    this.log()

    if (res.status === 'available') {
      this.log(`Your Data Connector is now ${color.green('available')}.`)
    }
  }
}
