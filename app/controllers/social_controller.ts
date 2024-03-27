import type { HttpContext } from '@adonisjs/core/http'
import userProvider from '../providers/user_provider.js';
import authProvider from '../providers/auth_provider.js';
import User from '#models/user';
import { time } from 'console';
import { TIMEOUT } from 'dns';
export default class SocialController {
    private user_provider: userProvider = new userProvider()
    private auth_provider: authProvider = new authProvider()
    googleRedirect({ ally }: HttpContext) {
        return ally.use('google').redirect();
    }

    /*
    userprovider
    si il existe pas on le crée
    si il existe on le connecte
    */

    async googleCallback({ ally, response }: HttpContext) {
        
        const google = ally.use('google')
        /**
   * User has denied access by canceling
   * the login flow
   */
        if (google.accessDenied()) {

            return 'You have cancelled the login process'
        }

        /**
         * OAuth state verification failed. This happens when the
         * CSRF cookie gets expired.
         */
        if (google.stateMisMatch()) {
            return 'We are unable to verify the request. Please try again'
        }

        /**
         * GitHub responded with some error
         */
        if (google.hasError()) {
            return google.getError()
        }

        /**
         * Access user info
         */
        const user = await google.user()
        const exist = await this.user_provider.exists(user.email)

        if (!exist) {
            await this.user_provider.create({ username: user.nickName, email: user.email}, true)
            const user_db = await User.findByOrFail('email', user.email)
            this.auth_provider.create(user_db.id, { id_google_provider: user.id })
        }


    }

    githubRedirect({ ally }: HttpContext) {
        return ally.use('github').redirect();
    }

    async githubCallback({ ally, response }: HttpContext) {
        const gh = ally.use('github')
        /**
   * User has denied access by canceling
   * the login flow
   */
        if (gh.accessDenied()) {

            return 'You have cancelled the login process'
        }

        /**
         * OAuth state verification failed. This happens when the
         * CSRF cookie gets expired.
         */
        if (gh.stateMisMatch()) {
            return 'We are unable to verify the request. Please try again'
        }

        /**
         * GitHub responded with some error
         */
        if (gh.hasError()) {
            return gh.getError()
        }

        /**
         * Access user info
         */
        const user = await gh.user()
        const exist = await this.user_provider.exists(user.email)

        if (!exist) {
            await this.user_provider.create({ username: user.nickName, email: user.email}, true)
            const user_db = await User.findByOrFail('email', user.email)
            this.auth_provider.create(user_db.id, { id_github_provider: user.id })
        }
        return user

    }

    discordRedirect({ ally }: HttpContext) {
        return ally.use('discord').redirect();
    }

    async discordCallback({ ally, response }: HttpContext) {
        const discord = ally.use('discord')
        /**
   * User has denied access by canceling
   * the login flow
   */
        if (discord.accessDenied()) {

            return 'You have cancelled the login process'
        }

        /**
         * OAuth state verification failed. This happens when the
         * CSRF cookie gets expired.
         */
        if (discord.stateMisMatch()) {
            return 'We are unable to verify the request. Please try again'
        }

        /**
         * GitHub responded with some error
         */
        if (discord.hasError()) {
            return discord.getError()
        }

        /**
         * Access user info
         */
        const user = await discord.user()
        const exist = await this.user_provider.exists(user.email)

        if (!exist) {
            await this.user_provider.create({ username: user.nickName, email: user.email}, true)
            const user_db = await User.findByOrFail('email', user.email)
            this.auth_provider.create(user_db.id, { id_discord_provider: user.id })
        }
        return user

    }
}