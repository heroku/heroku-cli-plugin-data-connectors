import {expect, test} from '@oclif/test'

const connectorId = '123456'

describe('cdc:destroy', () => {
  test
  .nock('https://postgres-api.heroku.com', api => {
    api
    .delete(`/data/cdc/v0/connectors/${connectorId}`)
    .reply(200)
  })
  .stdout()
  .command([
    'cdc:destroy',
    connectorId,
  ])
  .it('works', ctx => {
    const expectedOutput = `Postgres Connector ${connectorId} deleted successfully.`
    expect(ctx.stdout.trim()).to.include(expectedOutput)
  })

  test
  .nock('https://postgres-api.heroku.com', api => {
    api
    .delete(`/data/cdc/v0/connectors/${connectorId}`)
    .replyWithError('negative ghost rider, the pattern is full')
  })
  .stdout()
  .stderr()
  .command([
    'cdc:destroy',
    connectorId,
  ])
  .catch(error => {
    expect(error.message).to.equal('negative ghost rider, the pattern is full')
  })
  .it('shows an error message when there is an error', ctx => {
    const expectedOutput = 'There was an issue deleting your Postgres Connector.'
    expect(ctx.stderr.trim()).to.include(expectedOutput)
  })
})
