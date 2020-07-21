import {cli} from 'cli-ux'
import color from '@heroku-cli/color'
import {flags} from '@heroku-cli/command'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

export default class ConnectorsDestroy extends BaseCommand {
  static description = 'destroy a Data Connector'

  static args = [
    {
      name: 'connector',
    },
  ]

  static flags = {
    confirm: flags.boolean({
      description: 'confirms destroying the connector if passed in',
      required: false,
    }),
  }

  static examples = [
    '$ heroku data:connectors:destroy gentle-connector-1234',
  ]

  async run() {
    const {args,flags} = this.parse(ConnectorsDestroy)
    const connector = args.connector
    const confirm = flags.confirm
    const confirmed = confirm || await cli.confirm(`Are you sure you would like to destroy connector ${color.cyan(connector)} (y/n)?`)

    if (confirmed) {
      cli.action.start('Destroying Data Connector')
      try {
        await this.shogun.delete<PostgresConnector>(`/data/cdc/v0/connectors/${connector}`, this.shogun.defaults)
        this.log(`Data Connector ${connector} deleted successfully.`)
      } catch (error) {
        this.warn('There was an issue deleting your Data Connector.')
        throw error
      } finally {
        cli.action.stop()
      }
    }
  }
}
