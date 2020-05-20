import {APIClient, Command} from '@heroku-cli/command'
import {IConfig} from '@oclif/config'

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
