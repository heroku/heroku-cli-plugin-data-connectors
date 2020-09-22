import * as Heroku from '@heroku-cli/schema'
import {APIClient} from '@heroku-cli/command'

export async function addon(heroku: APIClient, addon: string, app?: string) {
  const {body: result} = await heroku.post<Heroku.AddOn[]>('/actions/addons/resolve', {
    body: {
      app,
      addon,
    }},
  )

  if (result.length > 1) {
    if (app === undefined) {
      throw new Error('Unable to determine addon, try including an app')
    } else {
      throw new Error('Unable to determine addon')
    }
  }

  return result[0]
}
