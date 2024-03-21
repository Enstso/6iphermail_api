import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID'),
    clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/api/auth/login/google/callback',
  }),
  linkedin: services.linkedin({
    clientId: env.get('LINKEDIN_CLIENT_ID'),
    clientSecret: env.get('LINKEDIN_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/api/auth/login/linkedin/callback',
    scopes: ['openid', 'profile','email'],
  }),
  github: services.github({
    clientId: env.get('GITHUB_CLIENT_ID'),
    clientSecret: env.get('GITHUB_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/api/auth/login/github/callback',
  }),
  discord: services.discord({
    clientId: env.get('DISCORD_CLIENT_ID'),
    clientSecret: env.get('DISCORD_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/api/auth/login/discord/callback',
  }),

})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}