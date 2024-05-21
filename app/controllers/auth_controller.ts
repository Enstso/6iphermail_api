import User from '#models/user'
import UserProvider from '#providers/user_provider'
import { loginValidator } from '#validators/login_user'
import { registerValidator } from '#validators/register_user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
    constructor(protected userProvider: UserProvider) { }
    public async register({ request, response }: HttpContext) {
        const data = request.all()
        const validate = await registerValidator.validate(data);
        await this.userProvider.create(validate);
        return response.safeStatus(201)
    }

    public async login({ request, auth, response }: HttpContext) {
        const data = request.all();
        const validate = await loginValidator.validate(data)
        const { email, password } = validate;
        const user = await User.verifyCredentials(email, password);
        await auth.use('web').login(user);
        return response.safeStatus(200).json({ message: "User logged in!", username: user.username })
    }

    public async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout();
        return response.safeStatus(200).json({ message: "User logged out!" })
    }

    public async me({ auth }: HttpContext) {
        return auth.user
    }
}
