import vine from '@vinejs/vine'

export const oauthValidator = vine.compile(
    vine.object({
        username: vine.string().trim().escape(),
        email: vine.string().trim().email().unique(async (db, value) => {
            const user = await db
                .from('users')
                .where('email', value)
                .first()
            return !user
        }),
        
    })
)
