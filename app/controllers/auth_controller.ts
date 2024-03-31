import User from '#models/user';
import { loginValidator } from '#validators/login_user';
import { registerValidator } from '#validators/register_user';
import { type HttpContext } from '@adonisjs/core/http'
import authProvider from '../providers/auth_provider.js';
import userProvider from '../providers/user_provider.js';
import hash from '@adonisjs/core/services/hash';
import { Encryption } from '@adonisjs/core/encryption'
export default class AuthController {
    private auth_provider: authProvider = new authProvider()
    private user_provider: userProvider = new userProvider()
    /*private encryption: Encryption = new Encryption({
        secret: '6iphermailtokenenstso',
    })*/

    public async register({ request, response }: HttpContext) {
        const data = request.all()
        const payload = await registerValidator.validate(data)
        await User.create(payload)
        return response.safeStatus(201).json({ message: "User created!" })
    }

    public async login({ request, response }: HttpContext) {
        const data = request.all()
        const payload = await loginValidator.validate(data)
        const user = await User.findByOrFail('email', payload.email)
        
        if (!user) {
            response.abort('Invalid credentials')
        }
        const verifyPassword = await hash.verify(user.password, payload.password)

        if (!verifyPassword) {
            response.abort('Invalid credentials')
        }
        this.user_provider.active(user)

        return response.safeStatus(200).json({ token: await this.auth_provider.token(user), email: payload.email, message: "Login successful!" })
    }

    public async logout({ request, response }: HttpContext) {
        const data = request.all()
        const user: User = await User.findByOrFail('email', data.email)
        this.user_provider.inactive(user)
        await this.auth_provider.revokeToken(user)
        return response.safeStatus(200).json({ message: "Logout successful!" })
    }


}

/*

*/