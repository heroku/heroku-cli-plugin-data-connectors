import {expect, test} from '@oclif/test'

const connectorId = 'pg-12345'

const settings = {
  foo: 'bar',
  'decimal.handling.mode': 'precise',
}

describe('data:cdc:update', () => {
  describe('standard use', () => {
    const expectedOutput = `The Postgres Connector is now being updated.\nRun heroku data:cdc:wait ${connectorId} to check the update process.`
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .patch(`/data/cdc/v0/connectors/${connectorId}`, {
        settings,
      })
      .reply(200)
    })
    .stdout()
    .command([
      'data:cdc:update',
      connectorId,
      '--setting=foo=bar',
      '--setting=decimal.handling.mode=precise',
    ])
    .it('works', ctx => {
      expect(ctx.stdout.trim()).to.include(expectedOutput)
    })
  })

  describe('when passingj invalid setting pairs', () => {
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
      'data:cdc:update',
      connectorId,
      '--setting=foo.bar',
    ])
    .catch(error => expect(error.message).to.equal('You must pass each --setting flag using the format `key=value`'))
    .it('exits before the API call and warns about the invalid flag')
  })
})
