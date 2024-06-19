import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AuthSocialProvider from '#providers/auth_social_provider'
import UserProvider from '#providers/user_provider'
import User from '#models/user';
import { oauthValidator } from '#validators/oauth_user';
import { url } from 'inspector';

@inject()
export default class SocialController {
    constructor(protected authSocialProvider: AuthSocialProvider, protected userProvider: UserProvider) { }
    async googleRedirect({ ally,response }: HttpContext) {
        const url = await ally.use('google').redirectUrl()
        return response.json({'url':url})
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
                    await auth.use('web').login(user_db)
                    return response.redirect('http://localhost:5173')
                }
            } else {
                const validate = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.userProvider.create(validate, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.authSocialProvider.create(user_db.id, { id_google_provider: user.id })
                return response.redirect('http://localhost:5173/login')
            }
        }
        return response.abort('Email not verified')

    }

    async githubRedirect({ ally, response }: HttpContext) {
        const url = await ally.use('github').redirectUrl()
        return response.json({ 'url': url })
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
                    await auth.use('web').login(user_db)
                    return response.redirect('http://localhost:5173')
                }
            } else {
                const validate = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.userProvider.create(validate, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.authSocialProvider.create(user_db.id, { id_github_provider: user.id })
                return response.redirect('http://localhost:5173/login')
            }
        }

    }

    async discordRedirect({ ally, response }: HttpContext) {
        const url = await ally.use('discord').redirectUrl()
        return response.json({ 'url': url })
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
        console.log(user);
        if (user.emailVerificationState === 'verified') {
            if (await this.userProvider.exists(user.email)) {
                const user_db = await User.findByOrFail('email', user.email)
                if (await this.authSocialProvider.exists('id_discord_provider', user.id)) {
                    await auth.use('web').login(user_db)
                    return response.redirect('http://localhost:5173')
                }
            } else {
                const validate = await oauthValidator.validate({ username: user.nickName, email: user.email })
                await this.userProvider.create(validate, true)
                const user_db = await User.findByOrFail('email', user.email)
                this.authSocialProvider.create(user_db.id, { id_discord_provider: user.id })
                return response.redirect('http://localhost:5173/login')
            }
        }
    }
}