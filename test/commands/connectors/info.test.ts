import {expect, test} from '@oclif/test'

const connector = {
  kafka_app: {
    name: 'my-sweet-app',
  },
  kafka_addon: {
    name: 'kafka-metric-96658',
    uuid: '8ca74bdf-25ea-413b-bbc1-90c57233361f',
  },
  postgres_app: {
    name: 'my-sweet-app',
  },
  postgres_addon: {
    name: 'postgresql-rectangular-10992',
    uuid: '677abc7a-839a-4589-86c3-e0a28a882690',
  },
  uuid: '123456',
  name: 'pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a',
  status: 'available',
  lag: '< 1 MB',
  created_at: '2020-05-05 15:37:21 +0000',
  tables: [
    'public.posts',
    'public.comments',
  ],
  excluded_columns: [
    'foo',
    'bar',
  ],
  topics: [
    {
      table_name: 'public.posts',
      topic_name: 'pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a.public.posts',
    },
    {
      table_name: 'public.comments',
      topic_name: 'pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a.public.comments',
    },
  ],
}

describe('data:connectors:info', () => {
  describe('when the connector is still provisioning', () => {
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/connectors/${connector.uuid}`)
      .reply(200, {...connector, status: 'creating'})
    })
    .stdout()
    .command(['data:connectors:info', '123456'])
    .it('indicates the connector is still being provisioned', ctx => {
      const expectedOutput = `The Data Connector is now being provisioned for 123456.
Run heroku data:connectors:wait ${connector.name} to check the creation process.`

      expect(ctx.stdout).to.include(expectedOutput)
    })
  })

  describe('with normal output', () => {
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/connectors/${connector.uuid}`)
      .reply(200, connector)
    })
    .stdout()
    .command(['data:connectors:info', '123456'])
    .it('returns the correct output', ctx => {
      const expectedOutput = `=== Data Connector status for 123456
Lag:          < 1 MB
Service Name: 123456
Status:       available

=== Configuration
Table Name      Topic Name
public.posts    pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a.public.posts
public.comments pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a.public.comments

Excluded Columns
foo
bar

Your Data Connector is now available.`

      ctx.stdout.split('\n').forEach(line => {
        expect(expectedOutput).to.include(line.trim())
      })
    })
  })

  describe('with --json flag', () => {
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/connectors/${connector.uuid}`)
      .reply(200, connector)
    })
    .stdout()
    .command(['data:connectors:info', '123456', '--json'])
    .it('returns the correct JSON output', ctx => {
      expect(JSON.parse(ctx.stdout)).to.deep.equal(connector)
    })
  })
})
