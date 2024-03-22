import vine from '@vinejs/vine'
export const loginValidator = vine.compile(
    vine.object(
        {
            email: vine.string().trim().email().exists(async (db, value) => {
                const user = await db
                    .from('users')
                    .where('email', value)
                    .first()
                return !!user
            }),
            password: vine.string().trim().escape()
        }
    )
)