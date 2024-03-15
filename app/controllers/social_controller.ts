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
}