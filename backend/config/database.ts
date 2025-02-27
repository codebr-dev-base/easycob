import env from '#start/env';
import { defineConfig } from '@adonisjs/lucid';

const dbConfig = defineConfig({
  prettyPrintDebugQueries: true,
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: false,
    },
    sqlite: {
      client: 'sqlite3',
      connection: {
        filename: ':memory:', // Utiliza o modo memória
      },
      useNullAsDefault: true,
      debug: false,
    },
  },
});

export default dbConfig;
