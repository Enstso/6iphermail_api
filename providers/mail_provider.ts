import type { ApplicationService } from '@adonisjs/core/types'
import { auth as auth_gmail, gmail as gmail_ext } from '@googleapis/gmail';
import env from '#start/env';
import { Encryption } from '@adonisjs/core/encryption';
import { stat } from 'fs';

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

  authOauthGmailv2() {
    return new auth_gmail.OAuth2(
      env.get('GMAIL_CLIENT_ID'),
      env.get('GMAIL_CLIENT_SECRET'),
      'http://localhost:3333/api/gmail/6iphermail/mails'
    );
  }

  async getThreadsUnread(oauth_2_client: any, session: any) {
    const gmail = gmail_ext({ version: 'v1', auth: oauth_2_client });
    const threads = await gmail.users.threads.list({
      userId: session.get('gmail'),
      maxResults: session.get('nbMails'),
      q: 'is:unread',
    });

    return threads;
  }
  async getThreadsRead(oauth_2_client: any, session: any) {
    const gmail = gmail_ext({ version: 'v1', auth: oauth_2_client });
    const threads = await gmail.users.threads.list({
      userId: session.get('gmail'),
      maxResults: session.get('nbMails'),
      q: 'is:read',
    });

    return threads;
  }

  extratData(headers: any) {
    const headerNames = ["From", "Subject", "Date"];
    const extractedHeaders: { [key: string]: string } = {};
    headers.forEach(header => {
      if (headerNames.includes(header.name)) {
        extractedHeaders[header.name] = header.value;
      }
    });
    return extractedHeaders;
  }

  async getMail(oauth_2_client: any, session: any, id: string, is_read: boolean) {
    const gmail = gmail_ext({ version: 'v1', auth: oauth_2_client });
    const message = await gmail.users.threads.get({
      userId: session.get('gmail'),
      id: id,
    });

    const extractHeaders = this.extratData(message.data.messages[0].payload?.headers);

    const expeditor = extractHeaders["From"];
    const receiver = session.get('gmail');
    const subject = extractHeaders["Subject"];
    const date = extractHeaders["Date"];
    const name = this.getUsernameFromEmail(expeditor);
    const body64 = message.data.messages[0].payload?.body.data || message.data.messages[0].payload?.parts[1]?.body.data || 'contact the your hosting mails for more information';

    const res = await fetch('http://127.0.0.1:5000/treating_mail', {
      method: 'POST',
      body: JSON.stringify({ "base64_text": body64 }),
      headers: { 'Content-Type': 'application/json' },

    })

    let data = await res.json();
    let score_status = "";
    console.log(data);
    if (!res.ok) {
      data = "Errorr";
    }

    score_status = this.scoreMail(data.score);
    data = data.content;

    return { data: data, score: score_status, expeditor: expeditor, receiver: receiver, subject: subject, date: date, id: id, is_read: is_read, name: name };
  }

  getUsernameFromEmail(email: string): string | undefined | null {
    // Trouver l'index du caractère '@'
    const atIndex = email.indexOf('<');

    // Si l'index est inférieur à zéro, cela signifie que '@' n'a pas été trouvé dans l'email
    if (atIndex < 0) {
      return null; // Retourner null si l'email est invalide
    }

    // Extraire le nom d'utilisateur avant '@'
    const username = email.substring(0, atIndex);

    return username;
  }

  scoreMail(data: number) {
    let status: string = "";
    switch (true) {
      case data >= 0 && data < 4:
        status = "Potential Low risk";
        break;
      case data >= 4 && data < 8:
        status = "Potential Medium risk";
        break;
      case data >= 8:
        status = "Potential High risk";
        break;
      default:
        status = "Invalid";
        break;
    }
    return status;
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