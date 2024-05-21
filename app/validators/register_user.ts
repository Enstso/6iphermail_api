import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        username: vine.string().trim().escape(),
        email: vine.string().trim().email().unique(async (db, value) => {
            const user = await db
                .from('users')
                .where('email', value)
                .first()
            return !user
        }),
        password: vine.string().trim().escape(),

    })
)

