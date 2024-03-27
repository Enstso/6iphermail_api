import Auth from "#models/auth";

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

}

/*



*/