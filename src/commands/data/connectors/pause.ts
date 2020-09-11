import {cli} from 'cli-ux'
import BaseCommand from '../../../lib/base'

export default class ConnectorsPause extends BaseCommand {
  static description = 'Pause change event creation on a Data Connector\nRead more about this feature at https://devcenter.heroku.com/articles/heroku-data-connectors'

  static examples = [
    '$ heroku data:connectors:pause gentle-connector-1234',
  ]

  static args = [
    {
      name: 'connector',
    },
  ]

  async run() {
    const {args} = this.parse(ConnectorsPause)

    cli.action.start(`Pausing Data Connector ${args.connector}`)
    try {
      await this.shogun.put(`/data/cdc/v0/connectors/${args.connector}/pause`,
        {
          ...this.shogun.defaults,
          raw: true,
        })
    } catch (error) {
      cli.error(error)
    }
    cli.action.stop()
  }
}
