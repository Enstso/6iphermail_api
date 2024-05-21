import AuthSocial from '#models/auth_social'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AuthSocialProvider {

  /**
   * Register bindings to the container
   */
  register() { }

  /**
   * The container bindings have booted
   */
  async boot() { }

  /**
   * The application has been booted
   */
  async start() { }

  /**
   * The process has been started
   */
  async ready() { }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() { }

  async create(user_id: number, { id_discord_provider, id_google_provider, id_github_provider }: { id_discord_provider?: string, id_google_provider?: string, id_github_provider?: string }) {
    AuthSocial.create({ user_id, id_discord_provider, id_google_provider, id_github_provider })
  }
  async update(user_id: number, { id_discord_provider, id_google_provider, id_github_provider }: { id_discord_provider?: string, id_google_provider?: string, id_github_provider?: string }) {
    AuthSocial.query().where('user_id', user_id).update({
      id_discord_provider: id_discord_provider,
      id_google_provider: id_google_provider,
      id_github_provider: id_github_provider
    })
  }
  async exists(type_provider:string,id_provider:string): Promise<boolean> {
    return await true ? AuthSocial.findBy(type_provider, id_provider) != null : false
}

}

