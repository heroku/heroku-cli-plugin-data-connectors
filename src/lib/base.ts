import {APIClient, Command} from '@heroku-cli/command'
import {IConfig} from '@oclif/config'
import {cli} from 'cli-ux'
import color from '@heroku-cli/color'
import {error} from '@oclif/errors'

export default abstract class Base extends Command {
  shogun: APIClient;

  constructor(argv: Array<string>, config: IConfig) {
    super(argv, config)

    const client = new APIClient(this.config, {})
    client.defaults.host = process.env.HEROKU_DATA_HOST || 'postgres-api.heroku.com'
    client.defaults.headers = {
      ...this.heroku.defaults.headers,
      authorization: `Basic ${Buffer.from(':' + this.heroku.auth).toString('base64')}`,
    }
    this.shogun = client
  }
}
export interface PostgresConnector {
  created_at: string;
  excluded_columns: string[];
  kafka_addon: {name: string; uuid: string};
  kafka_app: {name: string};
  name: string;
  postgres_addon: {name: string; uuid: string};
  postgres_app: {name: string};
  status: 'creating' | 'available';
  tables: string[];
  topics: {table_name: string; topic_name: string}[];
  uuid: string;
}

export function confirmConnector(connector: string, confirm: string | undefined) {
  return new Promise(function (resolve: any, reject: any) {
    if (confirm) {
      if (confirm === connector) return resolve()
      return reject(error(`Confirmation ${color.bold.red(confirm)} did not match ${color.bold.red(connector)}. Aborted.`))
    }
    error('')
    cli.prompt(`To proceed, type ${color.bold.red(connector)} or re-run this command with ${color.bold.red('--confirm', connector)}`).then(function (confirm: string) {
      if (confirm === connector) return resolve()
      return reject(error(`Confirmation did not match ${color.bold.red(connector)}. Aborted.`))
    })
  })
}

