import {cli} from 'cli-ux'
import {flags} from '@heroku-cli/command'

import BaseCommand, {confirmConnector, PostgresConnector} from '../../../lib/base'

export default class ConnectorsDestroy extends BaseCommand {
  static description = 'destroy a Data Connector'

  static args = [
    {
      name: 'connector',
    },
  ]

  static flags = {
    confirm: flags.string({
      description: 'confirms destroying the connector if passed in',
      required: false,
    }),
  }

  static examples = [
    '$ heroku data:connectors:destroy gentle-connector-1234',
    '$ heroku data:connectors:destroy gentle-connector-1234 --confirm gentle-connector-1234',
  ]

  async run() {
    const {args, flags} = this.parse(ConnectorsDestroy)
    const connector = args.connector

    await confirmConnector(connector, flags.confirm)
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
