import color from '@heroku-cli/color'
import {flags} from '@heroku-cli/command'
import {cli} from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../lib/base'

export default class ConnectorsCreate extends BaseCommand {
  static description = 'create a new Postgres Connector attached to your Kafka cluster'

  static args = [
    {name: 'kafka'},
  ]

  static flags = {
    source: flags.string({required: true}),
    table: flags.string({
      char: 't',
      description: 'Tables to include',
      multiple: true,
      required: true,
    }),
    app: flags.app(),
    exclude: flags.string({
      description: 'Columns to exclude',
      multiple: true,
    }),
  }

  static examples = [
    '$ heroku data:cdc:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.posts --table public.comments',
    '$ heroku data:cdc:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.users --exclude public.users.password',
  ]

  async run() {
    const {args, flags} = this.parse(ConnectorsCreate)
    const kafka_tenant = args.kafka
    const postgresAddon = flags.source
    const tables = flags.table
    const excluded = flags.exclude || []

    cli.action.start('Creating Postgres Connector')
    const {body: res} = await this.shogun.post<PostgresConnector>(`/data/cdc/v0/kafka_tenants/${kafka_tenant}`, {
      ...this.shogun.defaults,
      body: {
        postgres_addon_uuid: postgresAddon,
        tables,
        excluded_columns: excluded,
      },
    })
    cli.action.stop()
    this.log()
    cli.styledObject({
      Status: res.status,
    })

    this.log()
    this.log(`The Postgres Connector is now being provisioned for ${color.cyan(kafka_tenant)}.`)
    this.log('Run ' + color.cyan('heroku data:cdc:wait ' + res.name + ' --app ' + flags.app) +
             ' to check the creation process.')
  }
}
