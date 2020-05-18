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
}

describe('cdc:create', () => {
  const expectedOutput = 'The Postgres Connector is now being provisioned for abcdef.\nRun heroku data:cdc:wait new-cdc-connector --app undefined to check the creation process.'
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
    'cdc:create',
    kafkaId,
    `--postgres-addon=${postgresId}`,
    '--table=public.foo',
    '--table=public.bar',
    '--exclude=public.foo.column1',
  ])
  .it('works', ctx => {
    expect(ctx.stdout.trim()).to.include(expectedOutput)
  })
})
