import {cli} from 'cli-ux'
import BaseCommand from '../../../lib/base'

export default class ConnectorPause extends BaseCommand {
  static description = 'Pause change event creation on a Postgres connector'

  static examples = [
    'heroku data:cdc:pause my-sweet-connector',
  ]

  static args = [
    {
      name: 'connector',
    },
  ]

  async run() {
    const {args} = this.parse(ConnectorPause)

    cli.action.start(`Pausing Postgres connector ${args.connector}`)
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
