import User from "#models/user";

export default class userProvider {

    constructor() { }

    public async create({ username, email, password }: { username?: string, email?: string, password?: string }, oauth?: boolean): Promise<void> {

        if (oauth) {
            await User.create({
                username: username,
                email: email,
                oauth: oauth
            })
        } else {
            await User.create({
                username: username,
                email: email,
                password: password,
            })
        }
    }

    public async exists(email: string): Promise<boolean> {
        return true ? await User.findBy('email', email) != null : false
    }



}

/*

- Mise en place des middlewares
- Récupération des mails


*/
