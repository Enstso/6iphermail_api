import User from '#models/user';
import { loginValidator } from '#validators/login_user';
import { registerValidator } from '#validators/register_user';
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
    public async register({ request,response }: HttpContext) {
        const data = request.all()
        const payload = await registerValidator.validate(data)
        await User.create(payload)
        return response.safeStatus(201).json({message:"User created!"})
    }

    public async login({ auth,request,response}: HttpContext) {
        const data = request.all()
        await loginValidator.validate(data)
        return response.safeStatus(200).json({message:`Welcome ${data.email}`})
    }

}
