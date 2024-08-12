/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
//Routes CRM
import './routes/action.ts';
import './routes/auth.ts';
import './routes/campaign.ts';
import './routes/invoice.ts';
import './routes/negotiation.ts';
import './routes/promise.ts';
import './routes/templates.ts';

//Routes Recupera
import './routes/recovery/client.ts';
import './routes/recovery/contact.ts';
import './routes/recovery/contract.ts';
import './routes/recovery/invoice.ts';
import './routes/recovery/loyal.ts';



router.get('/', async () => {
  return {
    hello: 'world',
  };
});
