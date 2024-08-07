import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
    async login({ request, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])

        try {
            const user = await User.verifyCredentials(email, password)
            if (!user.is_actived) {
                return response.unauthorized('Invalid credentials')
            }
            return await User.accessTokens.create(user)
        } catch {
            return response.unauthorized('Invalid credentials')
        }
    }

    async logout({ auth }: HttpContext) {
        const tokens = await User.accessTokens.all(auth.user!)
        for (const token of tokens) {
            await User.accessTokens.delete(auth.user!, token.identifier)
        }

        return {
            revoked: true,
        }
    }

    async refresh({ auth }: HttpContext) {
        const user: User = auth.user!
        await User.accessTokens.delete(user!, user.currentAccessToken!.identifier)
        return await User.accessTokens.create(user)
    }

    async me({ auth }: HttpContext) {
        const user: User = auth.user!
/*         await user.load('skills', (skills) => {
            skills.preload('module')
        }) */
        return user
    }
}