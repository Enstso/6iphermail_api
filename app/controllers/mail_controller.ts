import AuthMail from '#models/auth_mail';
import User from '#models/user';
import env from '#start/env'
import { auth, gmail, gmail_v1 } from '@googleapis/gmail';
import requestHelper from '../utils.js';
import { scope } from '@adonisjs/lucid/orm';


export default class MailController {
    private access_token: string = '';
    private refresh_token: string = '';

    async getMails({ request, response }: HttpContext) {


        const oauth2Client = new auth.OAuth2(
            env.get('GMAIL_CLIENT_ID'),
            env.get('GMAIL_CLIENT_SECRET'),
            'http://localhost:3333/api/gmail/6iphermail/mails'
        );

        const scopes = [
            'https://mail.google.com',
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,

        });

        if (request.input('code')) {
            const { tokens } = await oauth2Client.getToken(request.input('code'));
            oauth2Client.setCredentials(tokens);
            console.log(tokens);
            oauth2Client.on('tokens', (tokens) => {
                if (tokens.refresh_token) {
                    // store the refresh_token in my database!
                    console.log(tokens.refresh_token);
                }
                console.log(tokens.access_token);
            });
            const gmaili = gmail({ version: 'v1', auth: oauth2Client });
            const res = await gmaili.users.messages.list({
                userId: 'me',
            });
            return response.safeStatus(200).json({ message: "Mails", data: res.data })

        } else {

            return response.redirect(url);
        }

    }




    async getAuthorizationCode({ request, response }: HttpContext) {
        this.access_token = 'fdf';
        const oauth2Client = new auth.OAuth2(
            env.get('GMAIL_CLIENT_ID'),
            env.get('GMAIL_CLIENT_SECRET'),
            'http://localhost:3333/api/gmail/6iphermail/authorization/callback'
        );

        const scopes = [
            'https://mail.google.com'
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });
        console.log(url);

        response.redirect(url);
    }
    async authorizationCallback({ request, response }: HttpContext) {

        console.log(this.access_token);
        console.log(request.input('code'));
        console.log(request);
        return response.safeStatus(200).json({ message: "Authorization callback!", data: request.all() })
    }


}


