/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import './routes/auth.ts';
import './routes/action.ts';
import './routes/campaign.js';

router.get('/', async () => {
  return {
    hello: 'world',
  };
});
