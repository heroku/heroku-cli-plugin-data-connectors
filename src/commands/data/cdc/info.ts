import {flags} from '@heroku-cli/command'
import color from '@heroku-cli/color'
import cli from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

export default class CdcInfo extends BaseCommand {
  static description = 'get information about a CDC Connection'

  static examples = [
    '$ heroku cdc ad2a0126-aee2-4815-8e95-8367e3a2984b',
    '$ heroku cdc ad2a0126-aee2-4815-8e95-8367e3a2984b --json',
  ]

  static flags = {
    json: flags.boolean({
      description: 'output in json format',
    }),
  }

  static args = [
    {
      name: 'cdcId',
    },
  ]

  async run() {
    const {args, flags} = this.parse(CdcInfo)

    const connector = args.cdcId
    const {body: res} = await this.shogun.get<PostgresConnector>(
      `/data/cdc/v0/connectors/${connector}`,
      this.shogun.defaults
    )

    if (flags.json) {
      cli.styledJSON(res)
      return
    }

    if (res.status === 'creating') {
      this.log(`The Postgres Connector is now being provisioned for ${color.cyan(connector)}.`)
      this.log(`Run ${color.cyan('heroku data:cdc:wait -a APP')} to check the creation process.`)
      return
    }

    cli.styledHeader(`Postgres Connector status for ${color.cyan(connector)}`)
    cli.styledObject({
      Status: res.status,
      'Service Name': res.uuid || 'Provisioning',
    })

    if (res.topics.length > 0) {
      this.log()
      cli.styledHeader('Configuration')
      cli.table(res.topics, {
        table_name: {header: 'Table Name'},
        topic_name: {header: 'Topic Name'},
      })
    }

    if (res.excluded_columns.length > 0) {
      this.log()
      this.log(color.bold('Excluded Columns'))

      res.excluded_columns.forEach(column => this.log(column))
    }

    this.log()

    if (res.status === 'available') {
      this.log(`Your postgres connector is now ${color.green('available')}.`)
    }
  }
}
