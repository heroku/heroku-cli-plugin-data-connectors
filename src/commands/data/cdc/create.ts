import color from '@heroku-cli/color'
import {flags} from '@heroku-cli/command'
import {cli} from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

export default class ConnectorsCreate extends BaseCommand {
  static description = 'create a new Postgres Connector attached to your Kafka cluster'

  static flags = {
    source: flags.string({
      required: true,
      description: 'The name or ID of the Postgres instance whose change data you want to store',
    }),
    store: flags.string({
      required: true,
      description: 'The name or ID of the Kafka instance that will store the change data',
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
    'image-tag': flags.string({
      char: 'i',
      required: false,
      hidden: true,
    }),
  }

  static examples = [
    '$ heroku data:cdc:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.posts --table public.comments',
    '$ heroku data:cdc:create --store kafka-lovely-12345 --source postgresql-neato-98765 --table public.users --exclude public.users.password',
  ]

  async run() {
    const {flags} = this.parse(ConnectorsCreate)
    const {source: postgres, store: kafka} = flags
    const tables = flags.table
    const excluded = flags.exclude || []
    const imageTag = flags['image-tag'] || ''

    cli.action.start('Creating Postgres Connector')
    const {body: res} = await this.shogun.post<PostgresConnector>(`/data/cdc/v0/kafka_tenants/${kafka}`, {
      ...this.shogun.defaults,
      body: {
        postgres_addon_uuid: postgres,
        tables,
        excluded_columns: excluded,
        image_tag: imageTag,
      },
    })
    cli.action.stop()
    this.log()
    cli.styledObject({
      Status: res.status,
    })

    this.log()
    this.log(`The Postgres Connector is now being provisioned for ${color.cyan(kafka)}.`)
    this.log('Run ' + color.cyan('heroku data:cdc:wait ' + res.name) +
             ' to check the creation process.')
  }
}
