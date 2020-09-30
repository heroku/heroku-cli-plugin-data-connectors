import {flags} from '@heroku-cli/command'
import color from '@heroku-cli/color'
import cli from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

interface Dict<T> {
  [key: string]: T;
}

export default class ConnectorsUpdate extends BaseCommand {
  static description = 'Update the settings, tables and columns to exclude for a Data Connector\nRead more about this feature at https://devcenter.heroku.com/articles/heroku-data-connectors#update-configuration'

  static examples = [
    '$ heroku data:connectors:update gentle-connector-1234 --setting key=value --setting otherKey=otherValue --add-table public.posts --add-table public.people --remove-table public.people --add-exclude public.posts.key --remove-exclude public.posts.key',
  ]

  static args = [
    {
      name: 'connector',
    },
  ]

  static flags = {
    setting: flags.string({
      multiple: true,
      required: false,
      parse: input => {
        const [key, value] = input.split('=')
        if (!key || !value) {
          cli.error('You must pass each --setting flag using the format `key=value`')
        }
        return [key, value]
      },
    }),
    addTable: flags.string({
      char: 't',
      description: 'Tables to add',
      multiple: true,
      required: false,
    }),
    removeTable: flags.string({
      char: 't',
      description: 'Tables to remove',
      multiple: true,
      required: false,
    }),
    addExclude: flags.string({
      char: 't',
      description: 'Columns to exclude',
      multiple: true,
      required: false,
    }),
    removeExclude: flags.string({
      char: 't',
      description: 'Columns to no longer exclude',
      multiple: true,
      required: false,
    }),
  }

  async run() {
    const {args, flags} = this.parse(ConnectorsUpdate)

    const setting = flags.setting || []
    const tablesToAdd = flags.addTable || []
    const tablesToRemove = flags.removeTable || []
    const excludedColumnsToAdd = flags.addExclude || []
    const excludedColumnsToRemove = flags.removeExclude || []

    const params = setting.reduce((acc: Dict<string>, [key, value]) => {
      acc[key] = value
      return acc
    }, {})

    cli.action.start(`Updating Data Connector ${args.connector}`)
    try {
      await this.shogun.patch<PostgresConnector>(`/data/cdc/v0/connectors/${args.connector}`, {
        body: {
          settings: params,
          tables_to_add: tablesToAdd,
          tables_to_remove: tablesToRemove,
          excluded_columns_to_add: excludedColumnsToAdd,
          excluded_columns_to_remove: excludedColumnsToRemove,
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
