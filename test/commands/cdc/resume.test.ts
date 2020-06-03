import {expect, test} from '@oclif/test'

const connectorId = '123456'

describe('data:cdc:resume', () => {
  describe('pausing the connection', () => {
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .put(`/data/cdc/v0/connectors/${connectorId}/resume`)
      .reply(200, '')
    })
    .stderr()
    .command(['data:cdc:pause', connectorId])
    .it('works', ctx => {
      expect(ctx.stderr).to.include(`Pausing Postgres connector ${connectorId}... done`)
    })
  })
})
