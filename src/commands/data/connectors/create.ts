import color from '@heroku-cli/color'
import {flags} from '@heroku-cli/command'
import {cli} from 'cli-ux'

import BaseCommand, {PostgresConnector} from '../../../lib/base'

export default class ConnectorsCreate extends BaseCommand {
  static description = 'create a new Data Connector'

  static flags = {
    source: flags.string({
      required: true,
      description: 'The name or ID of the database instance whose change data you want to store',
    }),
    store: flags.string({
      required: true,
      description: 'The name or ID of the database instance that will store the change data',
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
    'image-tag': flags.string({
      char: 'i',
      required: false,
      hidden: true,
    }),
    'accept-beta': flags.boolean({
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
    const {source: postgres, store: kafka} = flags
    const tables = flags.table
    const excluded = flags.exclude || []
    const imageTag = flags['image-tag'] || ''
    const confirm = flags['accept-beta'] || false
    const name = flags.name || ''

    if (!confirm) {
      await cli.prompt('Do you agree to the TOC for this beta offering? (y/n)')
    }

    cli.action.start('Creating Data Connector')
    const {body: res} = await this.shogun.post<PostgresConnector>(`/data/cdc/v0/kafka_tenants/${kafka}`, {
      ...this.shogun.defaults,
      body: {
        postgres_addon_uuid: postgres,
        tables,
        excluded_columns: excluded,
        image_tag: imageTag,
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
    this.log('This offering is in a beta period. By provisioning this connector, you agree to the beta terms.')
    this.log('Details can be reviewed at: some-url')
    this.log()
    this.log(`The Data Connector is now being provisioned for ${color.cyan(kafka)}.`)
    this.log(`Run ${color.cyan('heroku data:connectors:wait ' + res.name)} to check the creation process.`)
  }
}
