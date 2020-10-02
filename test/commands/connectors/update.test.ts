import {expect, test} from '@oclif/test'

const connectorId = 'pg-12345'

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
  uuid: connectorId,
  name: 'pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a',
  status: 'available',
  lag: '< 1 MB',
  created_at: '2020-05-05 15:37:21 +0000',
  tables: [
    'public.posts',
    'public.comments',
  ],
  excluded_columns: [
    'public.posts.foo',
    'public.comments.bar',
  ],
}

describe('data:connectors:update', () => {
  describe('update settings only', () => {
    const expectedOutput = `Your Data Connector is now being updated.\nRun heroku data:connectors:wait ${connectorId} to check the update process.`
    const tables = [
      'public.posts',
      'public.comments',
    ]
    const excluded_columns = [
      'public.posts.foo',
      'public.comments.bar',
    ]
    const settings = {
      foo: 'bar',
      'decimal.handling.mode': 'precise',
    }
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .patch(`/data/cdc/v0/connectors/${connectorId}`, {
        settings,
        tables,
        excluded_columns,
      })
      .reply(200)
    })
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/connectors/${connectorId}`)
      .reply(200, connector)
    })
    .stdout()
    .command([
      'data:connectors:update',
      connectorId,
      '--setting=foo=bar',
      '--setting=decimal.handling.mode=precise',
    ])
    .it('works', ctx => {
      expect(ctx.stdout.trim()).to.include(expectedOutput)
    })
  })

  describe('when passingj invalid setting pairs', () => {
    const settings = {
      foo: 'bar',
      'decimal.handling.mode': 'precise',
    }
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .patch(`/data/cdc/v0/connectors/${connectorId}`, {
        settings,
      })
      .optionally()
      .reply(200)
    })
    .command([
      'data:connectors:update',
      connectorId,
      '--setting=foo.bar',
    ])
    .catch(error => expect(error.message).to.equal('You must pass each --setting flag using the format `key=value`'))
    .it('exits before the API call and warns about the invalid flag')
  })

  describe('add and remove table', () => {
    const expectedOutput = `Your Data Connector is now being updated.\nRun heroku data:connectors:wait ${connectorId} to check the update process.`
    const tables = [
      'public.posts',
      'public.newtable',
    ]
    const excluded_columns = [
      'public.posts.foo',
      'public.comments.bar',
    ]
    const settings = {}
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .patch(`/data/cdc/v0/connectors/${connectorId}`, {
        settings,
        tables,
        excluded_columns,
      })
      .reply(200)
    })
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/connectors/${connectorId}`)
      .reply(200, connector)
    })
    .stdout()
    .command([
      'data:connectors:update',
      connectorId,
      '--addTable=public.newtable',
      '--removeTable=public.comments',
    ])
    .it('works', ctx => {
      expect(ctx.stdout.trim()).to.include(expectedOutput)
    })
  })

  describe('add and remove excluded columns', () => {
    const expectedOutput = `Your Data Connector is now being updated.\nRun heroku data:connectors:wait ${connectorId} to check the update process.`
    const tables = [
      'public.posts',
      'public.comments',
    ]
    const excluded_columns = [
      'public.posts.foo',
      'public.comments.newcolumns',
    ]
    const settings = {}
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .patch(`/data/cdc/v0/connectors/${connectorId}`, {
        settings,
        tables,
        excluded_columns,
      })
      .reply(200)
    })
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/connectors/${connectorId}`)
      .reply(200, connector)
    })
    .stdout()
    .command([
      'data:connectors:update',
      connectorId,
      '--addExclude=public.comments.newcolumns',
      '--removeExclude=public.comments.bar',
    ])
    .it('works', ctx => {
      expect(ctx.stdout.trim()).to.include(expectedOutput)
    })
  })

  describe('handles duplicates', () => {
    const expectedOutput = `Your Data Connector is now being updated.\nRun heroku data:connectors:wait ${connectorId} to check the update process.`
    const tables = [
      'public.posts',
      'public.comments',
      'public.newtable',
    ]
    const excluded_columns = [
      'public.posts.foo',
      'public.comments.bar',
      'public.newtable.col',
    ]
    const settings = {}
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .patch(`/data/cdc/v0/connectors/${connectorId}`, {
        settings,
        tables,
        excluded_columns,
      })
      .reply(200)
    })
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/connectors/${connectorId}`)
      .reply(200, connector)
    })
    .stdout()
    .command([
      'data:connectors:update',
      connectorId,
      '--addTable=public.newtable',
      '--addTable=public.newtable',
      '--addExclude=public.newtable.col',
      '--addExclude=public.newtable.col',
    ])
    .it('works', ctx => {
      expect(ctx.stdout.trim()).to.include(expectedOutput)
    })
  })
})
