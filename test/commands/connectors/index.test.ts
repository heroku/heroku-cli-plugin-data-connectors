import {expect, test} from '@oclif/test'

const appName = 'my-sweet-app'
const appId = '123456'

const kafkaName = 'kafka-metric-96658'
const kafkaId = '8ca74bdf-25ea-413b-bbc1-90c57233361f'

const connectorList = [
  {
    kafka_app: {
      name: appName,
    },
    kafka_addon: {
      name: kafkaName,
      uuid: kafkaId,
    },
    postgres_app: {
      name: appName,
    },
    postgres_addon: {
      name: 'postgresql-rectangular-10992',
      uuid: '677abc7a-839a-4589-86c3-e0a28a882690',
    },
    uuid: '123456',
    name: 'pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a',
  },
  {
    kafka_app: {
      name: appName,
    },
    kafka_addon: {
      name: kafkaName,
      uuid: kafkaId,
    },
    postgres_app: {
      name: appName,
    },
    postgres_addon: {
      name: 'postgresql-rectangular-10992',
      uuid: '677abc7a-839a-4589-86c3-e0a28a882690',
    },
    uuid: '123456',
    name: 'pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a',
  },
]

describe('data:connectors', () => {
  describe('using the app flag', () => {
    test
    .nock('https://api.heroku.com', api => {
      api
      .get(`/apps/${appName}`)
      .reply(200, {
        id: appId,
      })
    })
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/apps/${appId}`)
      .reply(200, connectorList)
    })
    .stdout()
    .command(['data:connectors', `--app=${appName}`])
    .it('returns the correct output', ctx => {
      const expectedOutput = `=== Data Connector info for ${appName}
Connector Name:  pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a
Kafka Add-On:    kafka-metric-96658
Postgres Add-On: postgresql-rectangular-10992

Connector Name:  pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a
Kafka Add-On:    kafka-metric-96658
Postgres Add-On: postgresql-rectangular-10992`

      ctx.stdout.split('\n').forEach(v => {
        expect(expectedOutput).to.include(v.trim())
      })
    })

    test
    .nock('https://api.heroku.com', api => {
      api
      .get(`/apps/${appName}`)
      .reply(200, {
        id: appId,
      })
    })
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/apps/${appId}`)
      .reply(200, connectorList)
    })
    .stdout()
    .command(['data:connectors', `--app=${appName}`, '--table'])
    .it('returns the correct table output', ctx => {
      const expectedOutput = `=== Data Connector info for ${appName}
Connector Name Kafka Add-On Postgres Add-On
pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a kafka-metric-96658 postgresql-rectangular-10992
pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a kafka-metric-96658 postgresql-rectangular-10992`

      const actualOutput = ctx.stdout.replace(/ +/g, ' ')
      expectedOutput.split('\n').forEach(expectedLine => {
        expect(actualOutput).to.include(expectedLine.trim().replace(/\s+/g, ' '))
      })
    })
  })

  describe('using the addon flag', () => {
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
    .nock('https://postgres-api.heroku.com', api => {
      api
      .get(`/data/cdc/v0/addons/${kafkaId}`)
      .reply(200, connectorList)
    })
    .stdout()
    .command(['data:connectors', `--addon=${kafkaName}`])
    .it('returns the correct output', ctx => {
      const expectedOutput = `=== Data Connector info for ${kafkaName}
Connector Name:  pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a
Kafka Add-On:    kafka-metric-96658
Postgres Add-On: postgresql-rectangular-10992

Connector Name:  pg2k_a9cc07b4_2a8c_438d_8e54_db08073e5a9a
Kafka Add-On:    kafka-metric-96658
Postgres Add-On: postgresql-rectangular-10992`

      ctx.stdout.split('\n').forEach(v => {
        expect(expectedOutput).to.include(v.trim())
      })
    })
  })
})
