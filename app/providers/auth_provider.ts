import Auth from "#models/auth";
import User from "#models/user";
export default class authProvider {

    constructor() { }

    public create(user_id: number, { id_discord_provider, id_google_provider, id_github_provider }: { id_discord_provider?: string, id_google_provider?: string, id_github_provider?: string }): void {
        Auth.create({
            user_id: user_id,
            id_discord_provider: id_discord_provider,
            id_google_provider: id_google_provider,
            id_github_provider: id_github_provider
        })
    }

    public update(user_id: number, { id_discord_provider, id_google_provider, id_github_provider }: { id_discord_provider?: string, id_google_provider?: string, id_github_provider?: string }): void {
        Auth.query().where('user_id', user_id).update({
            id_discord_provider: id_discord_provider,
            id_google_provider: id_google_provider,
            id_github_provider: id_github_provider
        })
    }

    public async exists(type_provider:string,id_provider:string): Promise<boolean> {
        return await true ? Auth.findBy(type_provider, id_provider) != null : false
    }

    public async token(user:User) {
        const token =  await User.accessTokens.create(user)
        return {
            type:'bearer',
            value: token.value!.release()
        }
    }

}

/*



*/