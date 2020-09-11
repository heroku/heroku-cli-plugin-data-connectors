import {cli} from 'cli-ux'
import {flags} from '@heroku-cli/command'

import BaseCommand, {confirmConnector, PostgresConnector} from '../../../lib/base'

export default class ConnectorsDestroy extends BaseCommand {
  static description = 'Destroy a Data Connector\nRead more about this feature at https://devcenter.heroku.com/articles/heroku-data-connectors'

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
    const confirm = flags.confirm || ''

    await confirmConnector(connector, confirm)

    cli.action.start('Destroying Data Connector')
    try {
      await this.shogun.delete<PostgresConnector>(`/data/cdc/v0/connectors/${connector}`, this.shogun.defaults)
      this.log(`Data Connector ${connector} deleted successfully.`)
      this.log('Note: We do not delete your Kafka topics automatically, because they could still contain messages which you haven\'t consumed. Please delete the topics manually. See heroku kafka:topics:destroy --help')
    } catch (error) {
      this.warn('There was an issue deleting your Data Connector.')
      throw error
    } finally {
      cli.action.stop()
    }
  }
}
