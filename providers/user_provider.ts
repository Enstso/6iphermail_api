import User from '#models/user'

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
}

