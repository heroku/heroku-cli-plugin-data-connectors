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
    '$ heroku data:connectors:update gentle-connector-1234 --setting key=value --setting otherKey=otherValue --add-table public.posts --add-table public.people --remove-table public.messages --add-exclude public.posts.key --remove-exclude public.parcels.key',
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
      description: 'Tables to add',
      multiple: true,
      required: false,
    }),
    removeTable: flags.string({
      description: 'Tables to remove',
      multiple: true,
      required: false,
    }),
    addExclude: flags.string({
      description: 'Columns to exclude',
      multiple: true,
      required: false,
    }),
    removeExclude: flags.string({
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
      const {body: res} = await this.shogun.get<PostgresConnector>(
        `/data/cdc/v0/connectors/${args.connector}`,
        this.shogun.defaults
      )
      const tables = [...new Set(res.tables.concat(tablesToAdd).filter(t => !tablesToRemove.includes(t)))]
      const excludedColumns = [...new Set(res.excluded_columns.concat(excludedColumnsToAdd).filter(c => !excludedColumnsToRemove.includes(c)))]
      await this.shogun.patch<PostgresConnector>(`/data/cdc/v0/connectors/${args.connector}`, {
        body: {
          settings: params,
          tables: tables,
          excluded_columns: excludedColumns,
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
