/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller';
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';
import SocialController from '#controllers/social_controller';
import MailController from '#controllers/mail_controller';

router.group(() => {
  router.post('/register', [AuthController, 'register']);
  router.post('/login', [AuthController, 'login']);
  router.get('/discord', [SocialController, 'discordRedirect'])
  router.get('/discord/callback', [SocialController, 'discordCallback'])
  router.get('/github', [SocialController, 'githubRedirect'])
  router.get('/github/callback', [SocialController, 'githubCallback'])
  router.get('/google', [SocialController, 'googleRedirect'])
  router.get('/google/callback', [SocialController, 'googleCallback'])
  router.get('/logout', [AuthController, 'logout']);
}).prefix('/api/auth')

router.group(() => {
  router.get('/mails', [MailController, 'getGmail'])
  router.post('/mail/identifier', [MailController, 'identifierGmail'])
  router.get('/mail/:id', [MailController, 'getMail'])
  router.get('/threads', [MailController, 'getThreads'])
}).prefix('/api/gmail/6iphermail').middleware(middleware.auth())

router.group(() => {
  router.get('/generateAuthCode', [AuthController, 'generateAuthCode'])
  router.post('/verifyAuthCode', [AuthController, 'verifyAuthCode'])
  router.get('/me', [AuthController, 'me'])
}).prefix('/api/6iphermail').middleware(middleware.auth())

