/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import AuthController from '#controllers/auth_controller';
import SocialController from '#controllers/social_controller';
import router from '@adonisjs/core/services/router'

router.group(() => {
    router.post('/auth/register',[AuthController,'register']);
    router.post('/auth/login',[AuthController,'login']);
    /*
    router.get('/auth/linkedin/register', [SocialController, 'linkedinRedirect'])
    router.get('/auth/login/linkedin/callback', [SocialController, 'linkedinCallback'])
    */
    router.get('/auth/discord/register', [SocialController, 'discordRedirect'])
    router.get('/auth/login/discord/callback', [SocialController, 'discordCallback'])
    router.get('/auth/github/register', [SocialController, 'githubRedirect'])
    router.get('/auth/login/github/callback', [SocialController, 'githubCallback'])
    router.get('/auth/google/register', [SocialController, 'googleRedirect'])
    router.get('/auth/login/google/callback', [SocialController, 'googleCallback'])

}).prefix('/api/')

