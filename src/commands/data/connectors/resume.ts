import {cli} from 'cli-ux'
import BaseCommand from '../../../lib/base'

export default class ConnectorsResume extends BaseCommand {
  static description = 'Resume change event creation on a Data Connector\nRead more about this feature at https://devcenter.heroku.com/articles/heroku-data-connectors'

  static examples = [
    '$ heroku data:connectors:resume gentle-connector-1234',
  ]

  static args = [
    {
      name: 'connector',
    },
  ]

  async run() {
    const {args} = this.parse(ConnectorsResume)

    cli.action.start(`Resuming Data Connector ${args.connector}`)
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
