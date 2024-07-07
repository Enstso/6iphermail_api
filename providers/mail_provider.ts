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

  // Send a message to the support team

  async sendToSupport(email: string, username: string, message: string) {
    fetch(env.get('URL_BOT_DISCORD'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, username: username, message: message })
    })
      .then((res) => res.json())
      .then((response) => {
        console.log('Success:', response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Gmail API
  authOauthGmail() {
    return new auth_gmail.OAuth2(
      env.get('GMAIL_CLIENT_ID'),
      env.get('GMAIL_CLIENT_SECRET'),
      'http://localhost:3333/api/gmail/6iphermail/mails'
    );
  }


// Get the unread threads

  async getThreadsUnread(oauth_2_client: any, session: any) {
    const gmail = gmail_ext({ version: 'v1', auth: oauth_2_client });
    const threads = await gmail.users.threads.list({
      userId: session.get('gmail'),
      maxResults: session.get('nbMails'),
      q: 'is:unread',
    });
    return threads;
  }

  // Get the read threads

  async getThreadsRead(oauth_2_client: any, session: any) {
    const gmail = gmail_ext({ version: 'v1', auth: oauth_2_client });
    const threads = await gmail.users.threads.list({
      userId: session.get('gmail'),
      maxResults: session.get('nbMails'),
      q: 'is:read',
    });
    return threads;
  }

  // Extract the data from the headers

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

  // Get the mail in web

  async getMail(oauth_2_client: any, session: any, id: string, is_read: boolean) {
    let score_status = "";
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

    });
    let data = await res.json();
    score_status = this.scoreMail(data.score);
    data = data.content;
    return { data: data, score: score_status, expeditor: expeditor, receiver: receiver, subject: subject, date: date, id: id, is_read: is_read, name: name };
  }

  getUsernameFromEmail(email: string): string | undefined | null {
    const atIndex = email.indexOf('<');
    if (atIndex < 0) {
      return null;
    }
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

  // Generate the URL for the user grant access to the app to get his mails

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