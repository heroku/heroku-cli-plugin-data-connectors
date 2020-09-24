import color from '@heroku-cli/color'
import {flags} from '@heroku-cli/command'
import {cli} from 'cli-ux'
import {fetchAddon} from '../../../fetcher'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

export default class ConnectorsCreate extends BaseCommand {
  static description = 'create a new Data Connector\nRead more about this feature at https://devcenter.heroku.com/articles/heroku-data-connectors'

  static flags = {
    app: flags.app(),
    source: flags.string({
      required: true,
      description: 'The name of the database add-on whose change data you want to store',
    }),
    store: flags.string({
      required: true,
      description: 'The name of the database add-on that will store the change data',
    }),
    name: flags.string({
      required: false,
      description: 'Name of the connector',
    }),
    table: flags.string({
      char: 't',
      description: 'Tables to include',
      multiple: true,
      required: true,
    }),
    exclude: flags.string({
      description: 'Columns to exclude',
      multiple: true,
    }),
    'platform-version': flags.string({
      char: 'p',
      required: false,
      hidden: true,
    }),
  }

  static examples = [
    '$ heroku data:connectors:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.posts --table public.comments',
    '$ heroku data:connectors:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.users --exclude public.users.password',
  ]

  async run() {
    const {flags} = this.parse(ConnectorsCreate)
    const tables = flags.table
    const excluded = flags.exclude || []
    const platformVersion = flags['platform-version'] || ''
    const name = flags.name || ''
    const kafka = await fetchAddon(this.heroku, flags.store, flags.app)
    const postgres = await fetchAddon(this.heroku, flags.source, flags.app)

    cli.action.start('Provisioning Data Connector')

    const {body: res} = await this.shogun.post<PostgresConnector>(`/data/cdc/v0/kafka_tenants/${kafka.id}`, {
      ...this.shogun.defaults,
      body: {
        postgres_addon_uuid: postgres.id,
        tables,
        excluded_columns: excluded,
        platform_version: platformVersion,
        name: name,
      },
    })
    cli.action.stop()

    this.log()
    cli.styledObject({
      Name: res.name,
      Status: res.status,
    })
    this.log()
    this.log('Run ' + color.cyan('heroku data:connectors:wait ' + res.name) +
             ' to check the creation process.')
  }
}
