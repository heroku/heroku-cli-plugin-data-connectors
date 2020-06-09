import {flags} from '@heroku-cli/command'
import color from '@heroku-cli/color'
import cli from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

interface Dict<T> {
  [key: string]: T;
}

export default class ConnectorsUpdate extends BaseCommand {
  static description = 'update the settings for a Data Connector'

  static examples = [
    '$ heroku data:connectors:update ad2a0126-aee2-4815-8e95-8367e3a2984b --setting key=value --setting otherKey=otherValue',
  ]

  static args = [
    {
      name: 'connector',
    },
  ]

  static flags = {
    setting: flags.string({
      multiple: true,
      required: true,
      parse: input => {
        const [key, value] = input.split('=')
        if (!key || !value) {
          cli.error('You must pass each --setting flag using the format `key=value`')
        }
        return [key, value]
      },
    }),
  }

  async run() {
    const {args, flags} = this.parse(ConnectorsUpdate)

    const setting = flags.setting || []

    const params = setting.reduce((acc: Dict<string>, [key, value]) => {
      acc[key] = value
      return acc
    }, {})

    cli.action.start(`Updating Data Connector ${args.connector}`)
    try {
      await this.shogun.patch<PostgresConnector>(`/data/cdc/v0/connectors/${args.connector}`, {
        body: {
          settings: params,
        },
        ...this.shogun.defaults,
      })
    } catch (error) {
      cli.error(error)
    }
    cli.action.stop()

    this.log()
    this.log('Your Data Connector is now being updated.')
    this.log(`Run ${color.cyan(`heroku data:connectors:wait ${args.connector}`)} to check the update process.`)
  }
}
