import {expect, test} from '@oclif/test'
import cli from 'cli-ux'

const connectorId = '123456'

describe('data:connectors:destroy', () => {
  test
  .stdout()
  .stub(cli, 'confirm', () => async () => true)
  .nock('https://postgres-api.heroku.com', api => {
    api
    .delete(`/data/cdc/v0/connectors/${connectorId}`)
    .reply(200)
  })
  .command([
    'data:connectors:destroy',
    connectorId,
  ])
  .it('works', ctx => {
    const expectedOutput = `Data Connector ${connectorId} deleted successfully.`
    expect(ctx.stdout.trim()).to.include(expectedOutput)
  })

  test
  .stdout()
  .command([
    'data:connectors:destroy',
    connectorId,
  ])
  .it('waits for confirmation', ctx => {
    const expectedOutput = `Are you sure you would like to destroy connector ${connectorId} (y/n)?`
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
    'data:connectors:destroy',
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
