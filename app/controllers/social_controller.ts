import type { HttpContext } from '@adonisjs/core/http'

export default class SocialController {
    googleRedirect({ ally }: HttpContext) {
        return ally.use('google').redirect();
    }



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
        return user

    }

//     linkedinRedirect({ ally }: HttpContext) {
//         return ally.use('linkedin').redirect();
//     }

//     async linkedinCallback({ ally, response }: HttpContext) {
//         const linkedin = ally.use('linkedin')
//         /**
//    * User has denied access by canceling
//    * the login flow
//    */
//         if (linkedin.accessDenied()) {

//             return 'You have cancelled the login process'
//         }

//         /**
//          * OAuth state verification failed. This happens when the
//          * CSRF cookie gets expired.
//          */
//         if (linkedin.stateMisMatch()) {
//             return 'We are unable to verify the request. Please try again'
//         }

//         /**
//          * GitHub responded with some error
//          */
//         if (linkedin.hasError()) {
//             return linkedin.getError()
//         }

//         /**
//          * Access user info
//          */
//         const user = await linkedin.user()
//         return user

//     }
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
        return user

    }
}