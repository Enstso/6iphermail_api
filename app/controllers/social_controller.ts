import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AuthSocialProvider from '#providers/auth_social_provider'
import UserProvider from '#providers/user_provider'
import User from '#models/user';
import { oauthValidator } from '#validators/oauth_user';

@inject()
export default class SocialController {
    constructor(protected authSocialProvider: AuthSocialProvider, protected userProvider: UserProvider) { }
    googleRedirect({ ally }: HttpContext) {
        return ally.use('google').redirect();
    }
    async googleCallback({ ally, auth, response }: HttpContext) {

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
        if (user.emailVerificationState === 'verified') {
            if (await this.userProvider.exists(user.email)) {
                const user_db = await User.findByOrFail('email', user.email)
                if (await this.authSocialProvider.exists('id_google_provider', user.id)) {
                    return auth.use('web').login(user_db)
                }
            } else {
                const validate = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.userProvider.create(validate, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.authSocialProvider.create(user_db.id, { id_google_provider: user.id })
                return response.safeStatus(201)
            }
        }
        return response.abort('Email not verified')

    }

    githubRedirect({ ally }: HttpContext) {
        return ally.use('github').redirect();
    }
    async githubCallback({ ally, auth, response }: HttpContext) {

        const github = ally.use('github')
        /**
         * User has denied access by canceling
         * the login flow
         *  
         * 
         *  
         */
        if (github.accessDenied()) {
            return 'You have cancelled the login process';
        }

        /**
         * OAuth state verification failed. This happens when the
         * CSRF cookie gets expired.
         */
        if (github.stateMisMatch()) {
            return 'We are unable to verify the request. Please try again';

        }

        /**
         * GitHub responded with some error
         */
        if (github.hasError()) {
            return github.getError();
        }

        /**
         * Access user info
         */

        const user = await github.user();

        if (user.emailVerificationState === 'verified') {
            if (await this.userProvider.exists(user.email)) {
                const user_db = await User.findByOrFail('email', user.email)
                if (await this.authSocialProvider.exists('id_github_provider', user.id)) {
                    return auth.use('web').login(user_db)
                }
            } else {
                const validate = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.userProvider.create(validate, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.authSocialProvider.create(user_db.id, { id_github_provider: user.id })
                return response.safeStatus(201)
            }
        }

    }

    discordRedirect({ ally }: HttpContext) {
        return ally.use('discord').redirect();
    }

    async discordCallback({ ally, auth, response }: HttpContext) {
        const discord = ally.use('discord')
        /**
         * User has denied access by canceling
         * the login flow
         */
        if (discord.accessDenied()) {
            return 'You have cancelled the login process';
        }

        /**
         * OAuth state verification failed. This happens when the
         * CSRF cookie gets expired.
         */
        if (discord.stateMisMatch()) {
            return 'We are unable to verify the request. Please try again';
        }

        /**
         * GitHub responded with some error
         */
        if (discord.hasError()) {
            return discord.getError();
        }

        /**
         * Access user info
         */
        const user = await discord.user();
        if (user.emailVerificationState === 'verified') {
            if (await this.userProvider.exists(user.email)) {
                const user_db = await User.findByOrFail('email', user.email)
                if (await this.authSocialProvider.exists('id_discord_provider', user.id)) {
                    return auth.use('web').login(user_db)
                }
            } else {
                const validate = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.userProvider.create(validate, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.authSocialProvider.create(user_db.id, { id_discord_provider: user.id })
                return response.safeStatus(201)
            }
        }
    }
}