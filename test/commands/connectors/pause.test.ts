import {expect, test} from '@oclif/test'

const connectorId = '123456'

describe('data:connectors:pause', () => {
  describe('pausing the connection', () => {
    test
    .nock('https://postgres-api.heroku.com', api => {
      api
      .put(`/data/cdc/v0/connectors/${connectorId}/pause`)
      .reply(200, '')
    })
    .stderr()
    .command(['data:connectors:pause', connectorId])
    .it('works', ctx => {
      expect(ctx.stderr).to.include(`Pausing Data Connector ${connectorId}... done`)
    })
  })
})
