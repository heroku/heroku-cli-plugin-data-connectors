import {expect, test} from '@oclif/test'

const kafkaName = 'kafka-metric-96658'
const kafkaId = 'abcdef'
const postgresName = 'postgresql-satirical-36423'
const postgresId = '123456'

const kafkaTenant = {
  postgres_addon_uuid: postgresId,
  tables: [
    'public.foo',
    'public.bar',
  ],
  excluded_columns: [
    'public.foo.column1',
  ],
  platform_version: '',
  name: 'my-cdc-connector',
}

describe('data:connectors:create', () => {
  const expectedOutput = 'Run heroku data:connectors:wait new-cdc-connector to check the creation process.'
  test
  .nock('https://api.heroku.com', api => {
    api
    .post('/actions/addons/resolve', {
      addon: kafkaName,
    })
    .reply(200, [{
      id: kafkaId,
    }])
  })
  .nock('https://api.heroku.com', api => {
    api
    .post('/actions/addons/resolve', {
      addon: postgresName,
    })
    .reply(200, [{
      id: postgresId,
    }])
  })
  .nock('https://postgres-api.heroku.com', api => {
    api
    .post(`/data/cdc/v0/kafka_tenants/${kafkaId}`, kafkaTenant)
    .reply(200, {
      name: 'new-cdc-connector',
    })
  })
  .stdout()
  .command([
    'data:connectors:create',
    `--store=${kafkaName}`,
    `--source=${postgresName}`,
    '--table=public.foo',
    '--table=public.bar',
    '--exclude=public.foo.column1',
    '--name=my-cdc-connector',
  ])
  .it('works', ctx => {
    expect(ctx.stdout.trim()).to.include(expectedOutput)
  })
})
