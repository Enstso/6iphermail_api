import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AuthMail extends BaseModel {
  static table = 'auth_mails'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare email: string

  @column()
  declare refresh_token: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}