import {expect, test} from '@oclif/test'

const connectorId = 'gentle-connector-1234'

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
    expect(ctx.stdout.trim()).to.include('Note: We do not delete your Kafka topics automatically, because they could still contain messages which you haven\'t consumed. Please delete the topics manually. See heroku kafka:topics:destroy --help')
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

  test
  .stdout()
  .stderr()
  .command([
    'data:connectors:destroy',
    '--confirm=not_correct',
    connectorId,
  ])
  .catch(error => {
    const expectedError = `Confirmation not_correct did not match ${connectorId}. Aborted.`
    expect(error.message).to.include(expectedError)
  })
})
