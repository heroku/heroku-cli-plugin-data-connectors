import {expect, test} from '@oclif/test'

const connectorId = '123456'

describe('data:connectors:destroy', () => {
  test
  .stdout()
  .stderr()
  .nock('https://postgres-api.heroku.com', api => {
    api
    .delete(`/data/cdc/v0/connectors/${connectorId}`)
    .reply(200)
  })
  .command([
    'data:connectors:destroy',
    `--confirm=${connectorId}`,
    connectorId,
  ])
  .it('works', ctx => {
    const expectedOutput = `Data Connector ${connectorId} deleted successfully.`
    expect(ctx.stdout.trim()).to.include(expectedOutput)
  })

  test
  .stdout()
  .stderr()
  .nock('https://postgres-api.heroku.com', api => {
    api
    .delete(`/data/cdc/v0/connectors/${connectorId}`)
    .replyWithError('negative ghost rider, the pattern is full')
  })
  .command([
    'data:connectors:destroy',
    `--confirm=${connectorId}`,
    connectorId,
  ])
  .catch(error => {
    expect(error.message).to.equal('negative ghost rider, the pattern is full')
  })
  .it('shows an error message when there is an error', ctx => {
    const expectedOutput = 'There was an issue deleting your Data Connector.'
    expect(ctx.stderr.trim()).to.include(expectedOutput)
  })
})
