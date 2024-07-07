import User from '#models/user'
import AuthPlatform from '#models/auth_platform'
import hash from '@adonisjs/core/services/hash'
export default class UserProvider {

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

  async create({ username, email, password }: { username?: string, email?: string, password?: string }, oauth?: boolean): Promise<void> {
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
  async exists(email: string): Promise<boolean> {
    return true ? await User.findBy('email', email) != null : false
  }

  generateRandomNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async codeExists(code: number): Promise<boolean> {
    return true ? await AuthPlatform.findBy('code', code) != null : false
  }

  async getCodeByUserId(user_id: number): Promise<number> {
    const auth = await AuthPlatform.findBy('user_id', user_id);
    return auth?.code ? auth.code : 0;
  }

  async verifyAuthCode(code: number, email: string): Promise<boolean> {
    const user = await User.findBy('email', email);
    if (user) {
      const auth = await AuthPlatform.findBy('user_id', user.id);
      if (auth) {
        return Number(auth.code) === Number(code);
      }
    }
    return false;
  }

  async codeUserExists(user_id: number): Promise<boolean> {
    return true ? await AuthPlatform.findBy('user_id', user_id) != null : false
  }

  async generateAuthCode(id: number) {
    let auth_code = this.generateRandomNumber();
    while (await this.codeExists(auth_code)) {
      auth_code = this.generateRandomNumber();
    }
    await AuthPlatform.create({ user_id: id, code: auth_code });
    return auth_code;
  }
  // Update the user's information

  async updateAccountUser(id: number|undefined, username: string, password: string, oldPassword: string) {
    const user = await User.findOrFail(id);
    if (await hash.verify(await user?.$attributes?.password, oldPassword)) {
      user.username = username;
      user.password =  password;
      await user.save();
      return true;
    }
    return false;
  }

}

