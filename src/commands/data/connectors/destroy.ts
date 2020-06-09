import {cli} from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

export default class ConnectorsDestroy extends BaseCommand {
  static description = 'destroy a Data Connector'

  static args = [
    {
      name: 'connector',
    },
  ]

  static examples = [
    '$ heroku data:connectors:destroy gentle-connector-1234',
  ]

  async run() {
    const {args} = this.parse(ConnectorsDestroy)
    const connector = args.connector

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
