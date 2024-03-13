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

router.group(()=>{
router.post('/auth/register',[AuthController,'register']);
router.post('/auth/login',[AuthController,'login']);
}).prefix('/api/');

