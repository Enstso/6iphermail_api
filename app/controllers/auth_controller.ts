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

    public async generateAuthCode({ auth, response }: HttpContext) {
        if (!await this.userProvider.codeUserExists(auth.user?.$attributes.id)) {
            await this.userProvider.generateAuthCode(auth.user?.$attributes.id)
        } else {
            const code = await this.userProvider.getCodeByUserId(auth.user?.$attributes.id)
            return response.safeStatus(200).json({ message: "Code already exists!", code: code })
        }
    }

    public async verifyAuthCode({ request, auth, response }: HttpContext) {
        const data = request.all()
        const { code, email } = data
        if (await this.userProvider.verifyAuthCode(code, email)) {
            const user = await User.findBy('email', email);
            if (user) {
                await auth.use('web').login(user);
            } else {
                return response.safeStatus(400).json({ message: "User not found!" })
            }
            return response.safeStatus(200).json({ message: "Code verified!", username: user.username })
        } else {
            return response.safeStatus(400).json({ message: "Code not verified!" })
        }
    }

    public async me({ auth, response }: HttpContext) {
        return response.safeStatus(200).json({ username: auth.user?.$attributes.username, email: auth.user?.$attributes.email})
    }
}
