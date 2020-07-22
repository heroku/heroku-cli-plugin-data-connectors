import {expect, test} from '@oclif/test'

const kafkaId = 'abcdef'
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
  image_tag: '',
  name: 'my-cdc-connector',
}

describe('data:connectors:create', () => {
  const expectedOutput = 'The Data Connector is now being provisioned for abcdef.\nRun heroku data:connectors:wait new-cdc-connector to check the creation process.'
  test
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
    `--store=${kafkaId}`,
    `--source=${postgresId}`,
    '--table=public.foo',
    '--table=public.bar',
    '--exclude=public.foo.column1',
    '--name=my-cdc-connector',
  ])
  .it('works', ctx => {
    expect(ctx.stdout.trim()).to.include(expectedOutput)
  })
})
