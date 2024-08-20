import env from '#start/env';
import { defineConfig, transports } from '@adonisjs/mail';

function createMailTransport(suffix: string, domain: string = '') {

  // Verifica se o domínio é ".br" para ajustar o host
  const hostEnvVariable = domain === '.br'
    ? `SMTP_HOST_COM_BR`
    : `SMTP_HOST_COM`;

  return transports.smtp({
    host: env.get(hostEnvVariable) || '',
    port: env.get('SMTP_PORT'),
    secure: false,

    auth: {
      type: 'login',
      user: `${env.get(`SMTP_USERNAME_${suffix.toUpperCase()}`)}@yuansolucoes.com${domain}`,
      pass: env.get('SMTP_PASSWORD') || '',
    },
    /* 
        tls: {},
    
        ignoreTLS: false,
        requireTLS: false,
    
        pool: false,
        maxConnections: 5,
        maxMessages: 100, 
      */
  });
}

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
  */


  mailers: {
    /*     
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),

      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME'),
        pass: env.get('SMTP_PASSWORD'),
      },
    }), 
    */

    // Configuração padrão SMTP
    smtp: transports.smtp({
      host: env.get('SMTP_HOST') || '',
      port: env.get('SMTP_PORT'),
      secure: false,
      /*   
      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME') || '',
        pass: env.get('SMTP_PASSWORD') || '',
      },
  
      tls: {},
  
      ignoreTLS: false,
      requireTLS: false,
  
      pool: false,
      maxConnections: 5,
      maxMessages: 100, 
      */

    }),

    // Configurações para diferentes regiões
    manaus_com: createMailTransport('manaus'),
    saoFancisco_com: createMailTransport('sao_francisco'),
    teresina_com: createMailTransport('teresina'),
    timon_com: createMailTransport('timon'),
    prolagos_com: createMailTransport('prolagos'),
    rondonia_com: createMailTransport('rondonia'),
    buritis_com: createMailTransport('buritis'),
    pimentaBueno_com: createMailTransport('pimenta_bueno'),
    ariquemes_com: createMailTransport('ariquemes'),
    rolimDeMoura_com: createMailTransport('rolim_de_moura'),

    // Configurações com domínio ".br"
    manaus_com_br: createMailTransport('manaus', '.br'),
    saoFancisco_com_br: createMailTransport('sao_francisco', '.br'),
    teresina_com_br: createMailTransport('teresina', '.br'),
    timon_com_br: createMailTransport('timon', '.br'),
    prolagos_com_br: createMailTransport('prolagos', '.br'),
    rondonia_com_br: createMailTransport('rondonia', '.br'),
    buritis_com_br: createMailTransport('buritis', '.br'),
    pimentaBueno_com_br: createMailTransport('pimenta_bueno', '.br'),
    ariquemes_com_br: createMailTransport('ariquemes', '.br'),
    rolimDeMoura_com_br: createMailTransport('rolim_de_moura', '.br'),

  },
});

export default mailConfig;

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> { }
}