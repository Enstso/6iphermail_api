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
    public active(user: User): void {
        user.active = true
        user.save()
    }

    public inactive(user: User): void {
        user.active = false
        user.save()
    }

    public async exists(email: string): Promise<boolean> {
        return true ? await User.findBy('email', email) != null : false
    }


}

/*

- Je m'inscrit en oauth, booléen à true, je crée un utilisateur sans mot de passe
- ensuite je récupère l'id de l'utilisateur et je crée un auth avec l'id de l'utilisateur du tiers dans la colonne corrspondante

- Sans oauth, je crée un utilisateur avec un mot de passe

- Pour l'autentification, avec le oauth je vérifie si l'utilisateur existe, si oui je vérifie si il est vérifié chez le tiers, si le id existe en bdd. active
- Sans oauth, je vérifie si l'utilisateur existe, si oui je vérifie si le mot de passe est correcte active

*/
