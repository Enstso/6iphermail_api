import type { ApplicationService } from '@adonisjs/core/types'
import { auth as auth_gmail, gmail as gmail_ext } from '@googleapis/gmail';
import env from '#start/env';
import { Encryption } from '@adonisjs/core/encryption';

export default class MailProvider {

  /**
   * Register bindings to the container
   */
  register() { }

  /**
   * The container bindings have booted
   */
  async boot() { }

  /**
   * The application has been booted
   */
  async start() { }

  /**
   * The process has been started
   */
  async ready() { }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() { }

  encryptData(data: string) {
    const encryption = new Encryption({
      secret: env.get('ENCRYPT_KEY'),
    });
    return encryption.encrypt(data);
  }

  decryptData(data: string): string | null {
    const encryption = new Encryption({
      secret: env.get('ENCRYPT_KEY'),
    });
    return encryption.decrypt(data);
  }

  authOauthGmail() {
    return new auth_gmail.OAuth2(
      env.get('GMAIL_CLIENT_ID'),
      env.get('GMAIL_CLIENT_SECRET'),
      'http://localhost:3333/api/gmail/6iphermail/mails'
    );
  }

  async getThreads(oauth_2_client: any, session: any) {
    const gmail = gmail_ext({ version: 'v1', auth: oauth_2_client });
    const threads = await gmail.users.threads.list({
      userId: session.get('gmail'),
    });

    return threads;
  }

  async getMail(oauth_2_client: any, session: any, id: string) {
    const gmail = gmail_ext({ version: 'v1', auth: oauth_2_client });
    const message = await gmail.users.threads.get({
      userId: session.get('gmail'),
      id: id,
    });

    return message;
  }

  generateAuthUrl(oauth_2_client: any) {
    const scopes = [
      'https://mail.google.com',
    ];

    return oauth_2_client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }


}