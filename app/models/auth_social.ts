import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'



export default class AuthSocial extends BaseModel {
  static table = 'auth_providers'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare id_discord_provider: string

  @column()
  declare id_google_provider: string

  @column()
  declare id_github_provider: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

}