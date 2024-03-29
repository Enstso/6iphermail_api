import type { HttpContext } from '@adonisjs/core/http'
import userProvider from '../providers/user_provider.js';
import authProvider from '../providers/auth_provider.js';
import User from '#models/user';
import { oauthValidator } from '#validators/oauth';

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

        if (user.emailVerificationState === 'verified') {
            if (exist) {
                const user_db = await User.findByOrFail('email', user.email)
                if (await this.auth_provider.exists('id_google_provider', user.id)) {
                    this.user_provider.active(user_db)
                    return this.auth_provider.token(user_db)
                }
            } else {
                const paylaod = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.user_provider.create(paylaod, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.auth_provider.create(user_db.id, { id_google_provider: user.id })
                return response.safeStatus(201).json({ message: "User created!" })
            }
        }
        return response.abort('Email not verified')

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

        if (user.emailVerificationState === 'verified') {
            if (exist) {
                const user_db = await User.findByOrFail('email', user.email)
                if (await this.auth_provider.exists('id_github_provider', user.id)) {
                    this.user_provider.active(user_db)
                    return this.auth_provider.token(user_db)
                }
            } else {
                const paylaod = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.user_provider.create(paylaod, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.auth_provider.create(user_db.id, { id_google_provider: user.id })
                return response.safeStatus(201).json({ message: "User created!" })
            }
        }
        return response.abort('Email not verified')

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

        if (user.emailVerificationState === 'verified') {
            if (exist) {
                const user_db = await User.findByOrFail('email', user.email)
                if (await this.auth_provider.exists('id_google_provider', user.id)) {
                    this.user_provider.active(user_db)
                    return this.auth_provider.token(user_db)
                }
            } else {
                const paylaod = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.user_provider.create(paylaod, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.auth_provider.create(user_db.id, { id_discord_provider: user.id })
                return response.safeStatus(201).json({ message: "User created!" })
            }
        }
        return response.abort('Email not verified')

    }
}