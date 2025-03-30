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
import action from '#routes/action';
import auth from '#routes/auth';
import campaign from '#routes/campaign';
import invoice from '#routes/invoice';
import promise from '#routes/promise';
import negotiation from '#routes/negotiation';
import templates from '#routes/templates';
import client from '#routes/recovery/client';
import contact from '#routes/recovery/contact';
import contract from '#routes/recovery/contract';
import recoveryInvoice from '#routes/recovery/invoice';
import loyal from '#routes/recovery/loyal';
import tag from '#routes/tag';
import externalFile from '#routes/external/file';
import externalAction from '#routes/external/action';
import externalContract from '#routes/external/contract';
import externalContact from '#routes/external/contact';
import externalInvoice from '#routes/external/invoice';
import webhook from './routes/tactium/webhook.js';

router.get('/', async () => {
  return {
    hello: 'world',
  };
});

router.group(() => {
  action;
  auth;
  campaign;
  invoice;
  promise;
  negotiation;
  templates;
  client;
  contact;
  contract;
  recoveryInvoice;
  loyal;
  tag;
  externalFile;
  externalAction;
  externalContract;
  externalContact;
  externalInvoice;
  webhook;
});

router.jobs();
