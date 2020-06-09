import {cli} from 'cli-ux'
import BaseCommand from '../../../lib/base'

export default class ConnectorResume extends BaseCommand {
  static description = 'Resume change event creation on a Postgres connector'

  static examples = [
    '$ heroku data:cdc:resume gentle-connector-1234',
  ]

  static args = [
    {
      name: 'connector',
    },
  ]

  async run() {
    const {args} = this.parse(ConnectorResume)

    cli.action.start(`Resuming Postgres connector ${args.connector}`)
    try {
      await this.shogun.put(`/data/cdc/v0/connectors/${args.connector}/resume`,
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
