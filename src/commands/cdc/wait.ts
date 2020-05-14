import {cli} from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../lib/base'

export default class ConnectorsWait extends BaseCommand {
  static description = 'wait for your Postgres Connector to be provisioned'

  static args = [
    {name: 'connector'},
  ]

  static examples = [
    '$ heroku data:cdc:wait gentle-connector-1234',
  ]

  async run() {
    const {args} = this.parse(ConnectorsWait)
    const connector = args.connector

    let status

    cli.action.start('Waiting for the Postgres Connector to be provisioned')

    /* eslint-disable no-await-in-loop */
    while (status !== 'available') {
      const {body: res} = await this.shogun.get<PostgresConnector>(
        `/data/cdc/v0/connectors/${connector}`,
        this.shogun.defaults
      )
      status = res.status
      await cli.wait(10000)
    }

    cli.action.stop()
  }
}
