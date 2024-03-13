import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        firstname: vine.string().trim().escape(),
        lastname: vine.string().trim().escape(),
        username: vine.string().trim().escape(),
        email: vine.string().trim().email().unique(async (db, value) => {
            const user = await db
                .from('users')
                .where('email', value)
                .first()
            return !user
        }),
        password: vine.string().trim().escape(),
        phone: vine.string().trim().maxLength(15).escape()
    })
)

