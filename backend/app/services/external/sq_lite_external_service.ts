import db from '@adonisjs/lucid/services/db';
import sqlite3 from 'sqlite3';
import { Dictionary } from '@adonisjs/lucid/types/querybuilder';
import { chunks } from '#utils/array';
import ExternalFile from '#models/external/external_file';
import { DateTime } from 'luxon';
import path from 'path';
import fs from 'fs';

interface DatasetRow {
  des_contr: string;
  num_celular: string | null;
  num_celular_2: string | null;
  num_residencial: string | null;
  num_comercial: string | null;
  num_recado: string | null;
  dsc_email: string | null;
  dsc_email_2: string | null;
}

interface Contact {
  des_contr: string;
  tipo_contato: 'TELEFONE' | 'EMAIL';
  contato: string;
  is_whatsapp?: boolean;
  is_celular?: boolean;
  dt_import?: DateTime;
  peso?: number;
  block?: boolean;
  block_all?: boolean;
  priority?: number;
  cpc?: boolean;
  criado_automatico?: boolean;
  block_tactium?: boolean;
  block_tactium_dt?: DateTime | null;
  formato_correto?: boolean;
  block_otima?: boolean;
  block_otima_dt?: DateTime | null;
  valido_sms?: boolean;
  percentual_atender?: number;
  count_atender?: number;
  dominio_valido?: boolean;
  dt_block_tactium?: DateTime | null;
  enviar_sms?: boolean;
  is_domain_valid?: boolean;
  created_at?: DateTime;
  updated_at: DateTime;
}

/**
 * Autor: 🦖 🦖 🦖
 */

export default class SqLiteExternalService {
  private dbSqlite: sqlite3.Database;

  constructor() {
    this.dbSqlite = new sqlite3.Database(':memory:'); // Ou um arquivo SQLite
    this.optimizeDatabase();
  }

  /**
   * Encontra todos os arquivos JSON em um diretório e suas subpastas.
   * @param dir - Diretório inicial para busca.
   * @returns Array de caminhos completos para os arquivos JSON encontrados.
   */
  private findJsonFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        // Recursão para subdiretórios
        results = results.concat(this.findJsonFiles(filePath));
      } else if (file.endsWith('.json')) {
        results.push(filePath);
      }
    });

    return results;
  }

  /**
   * OTIMIZA O BANCO DE DADOS SQLITE
   */
  private optimizeDatabase() {
    //this.dbSqlite.run('PRAGMA synchronous = OFF;');
    //this.dbSqlite.run('PRAGMA journal_mode = MEMORY;');
    this.dbSqlite.run('PRAGMA journal_mode = OFF;');
    this.dbSqlite.run('PRAGMA synchronous = OFF;');
    this.dbSqlite.run('PRAGMA cache_size = -10000;');
    this.dbSqlite.run('PRAGMA foreign_keys = OFF;');
    this.dbSqlite.run('PRAGMA locking_mode = EXCLUSIVE;');
  }

  public sortFiles(files: string[]): string[] {
    return files.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  }

  /**
   * #############################################################################
   * Métodos utilitários
   * #############################################################################
   */

  /**
   * RETORNA O BANCO DE DADOS SQLITE
   */
  public getDb(): sqlite3.Database {
    return this.dbSqlite;
  }

  /**
   * Mapeia o tipo do PostgreSQL para o SQLite
   */
  private mapPostgresToSqliteType(pgType: string): string {
    const typeMap: Record<string, string> = {
      integer: 'INTEGER',
      bigint: 'INTEGER',
      smallint: 'INTEGER',
      serial: 'INTEGER',
      uuid: 'TEXT',
      text: 'TEXT',
      varchar: 'TEXT',
      char: 'TEXT',
      boolean: 'INTEGER',
      timestamp: 'TEXT',
      date: 'TEXT',
      numeric: 'REAL',
      double: 'REAL',
      real: 'REAL',
      json: 'TEXT',
      jsonb: 'TEXT',
    };
    return typeMap[pgType] || 'TEXT'; // Se o tipo não for mapeado, usa TEXT por padrão
  }

  private handleEmail(email: string): string {
    if (!email) {
      return email;
    }

    let emailCorrigido = email.toLowerCase();

    // Correções usando expressões regulares
    emailCorrigido = emailCorrigido.replace(
      /@[a-z0-9]*hotm(a|i|o|u|e|l|r|t|p)[a-z0-9]*\.com(\.br)?$/,
      '@hotmail.com'
    );
    emailCorrigido = emailCorrigido.replace(
      /@[a-z0-9]*outl(o|u|i|e|a|k|l|t)[a-z0-9]*\.com(\.br)?$/,
      '@outlook.com'
    );
    emailCorrigido = emailCorrigido.replace(
      /@[a-z0-9]*gm(a|i|e|l|s|y|o|u|t)[a-z0-9]*\.com(\.br)?$/,
      '@gmail.com'
    );
    emailCorrigido = emailCorrigido.replace(
      /@[a-z0-9]*y(a|h)[a-z0-9]*\.com(\.br)?$/,
      '@yahoo.com'
    );
    emailCorrigido = emailCorrigido.replace(
      /@[a-z0-9]*icl(o|u|i|e|a|k|l|t)[a-z0-9]*\.com(\.br)?$/,
      '@icloud.com'
    );
    emailCorrigido = emailCorrigido.replace(
      /@[a-z0-9]*b(o|u|i|e|a|k|l|t)[a-z0-9]*\.com(\.br)?$/,
      '@bol.com.br'
    );
    emailCorrigido = emailCorrigido.replace(
      /@[a-z0-9]*u(o|u|i|e|a|k|l|t)[a-z0-9]*\.com(\.br)?$/,
      '@uol.com.br'
    );

    //Correção de outros erros
    emailCorrigido = emailCorrigido.replace('@gmeil.com', '@gmail.com');
    emailCorrigido = emailCorrigido.replace('@outllok.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@outolook.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@rotmail.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@hotmaol.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@hotmaiil.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@hotmaul.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@gma.com', '@gmail.com');
    emailCorrigido = emailCorrigido.replace('@outloook.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@gtmail.com', '@gmail.com');
    emailCorrigido = emailCorrigido.replace('@outlokk.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@holtmail.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@hootmail.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@oultlook.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@gmaisl.com', '@gmail.com');
    emailCorrigido = emailCorrigido.replace('@hoitmail.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@hotrmail.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@homtial.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@hotmal.com.br', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@outelook.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@outilook.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@outoolk.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@hptmail.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@totmail.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@gmaol.com', '@gmail.com');
    emailCorrigido = emailCorrigido.replace('@outllok.com.br', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@hotimal.com', '@hotmail.com');
    emailCorrigido = emailCorrigido.replace('@outlkoo.com', '@outlook.com');
    emailCorrigido = emailCorrigido.replace('@yaroo.com', '@yahoo.com');
    emailCorrigido = emailCorrigido.replace('@yhoo.com', '@yahoo.com');
    emailCorrigido = emailCorrigido.replace('@gemail.com', '@gmail.com');
    emailCorrigido = emailCorrigido.replace('@gml.com', '@gmail.com');

    return emailCorrigido;
  }

  private allDigitsRepeated(number: string): boolean {
    if (number == null || number.length === 0) {
      return false; // Returns false if the string is null or empty
    }

    const firstDigit = number[0];
    for (let i = 1; i < number.length; i++) {
      if (number[i] !== firstDigit) {
        return false; // Returns false if a different digit is found
      }
    }

    return true; // Returns true if all digits are the same
  }

  private handlePhone(phone: string | null | undefined): string {
    if (!phone) {
      return ''; // Retorna uma string vazia se o telefone for nulo ou indefinido
    }

    // Remove todos os caracteres não numéricos
    const cleanedPhone = phone.replace(/\D/g, '');

    return cleanedPhone;
  }

  /**
   * Criar contatos a partir de um objeto DatasetRow
   */
  private generateContacts(row: DatasetRow): Contact[] {
    const contacts: Contact[] = [];

    // Função para adicionar um contato ao array
    const addContact = (
      tipo_contato: 'TELEFONE' | 'EMAIL',
      contato: string | null
    ) => {
      if (!contato) return;
      if (contato === null) return;
      contato = contato?.trim();

      if (tipo_contato === 'TELEFONE') {
        if (this.allDigitsRepeated(contato)) return;
        contato = this.handlePhone(contato);
      }

      if (tipo_contato === 'EMAIL') {
        contato = this.handleEmail(`${contato}`);
      }

      if (contato === '') return;

      contacts.push({
        des_contr: row.des_contr, // Relaciona o contato ao contrato original
        tipo_contato,
        contato,
        updated_at: DateTime.now(),
      });
    };

    // Celular 1
    addContact('TELEFONE', row.num_celular); // Celular e WhatsApp

    // Celular 2
    addContact('TELEFONE', row.num_celular_2); // Celular e WhatsApp

    // Residencial
    addContact('TELEFONE', row.num_residencial);

    // Comercial
    addContact('TELEFONE', row.num_comercial);

    // Recado
    addContact('TELEFONE', row.num_recado);

    // Email 1
    addContact('EMAIL', row.dsc_email);

    // Email 2
    addContact('EMAIL', row.dsc_email_2);

    return contacts;
  }

  private async handleExternalFile(
    externalFile: ExternalFile,
    finalCount: number,
    initialCount: number,
    countInactive: number,
    xlsxDataCount: number,
    initialInativoCount: number,
    val_total: number
  ) {
    externalFile.newContract = finalCount - initialCount;

    externalFile.updateContract = xlsxDataCount - externalFile.newContract;

    externalFile.disableContract = countInactive - initialInativoCount;

    externalFile.lines = xlsxDataCount;

    externalFile.monetary = val_total ? val_total : 0;

    await externalFile.save();
  }

  public getOutputDir(filePath: string): string {
    // Obtém o diretório do arquivo
    const dir = path.dirname(filePath);

    // Obtém o nome do arquivo sem a extensão
    const fileName = path.basename(filePath, '.xlsx');

    // Combina o diretório e o nome do arquivo para formar o caminho da pasta
    return path.join(dir, fileName);
  }

  public getRecord(outputDir: string) {
    // Filtra apenas os arquivos JSON e ordena
    const jsonFiles = this.sortFiles(this.findJsonFiles(outputDir));

    if (jsonFiles.length === 0) {
      throw new Error('Nenhum arquivo JSON encontrado.');
    }

    // 1. Primeiro registro do primeiro arquivo
    const firstFileData = fs.readFileSync(jsonFiles[0], 'utf-8');
    const firstFileRecords = JSON.parse(firstFileData);
    const firstRecord = firstFileRecords[0];

    return firstRecord;
  }

  // Método para inserção em lote (um arquivo de cada vez)
  private async insertBatch(
    table: string,
    records: Record<string, unknown>[],
    columnsJson: string[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Inicia uma transação
      this.dbSqlite.run('BEGIN TRANSACTION', (err) => {
        if (err) return reject(err);

        // Prepara a query de inserção
        const columns = columnsJson.join(', ');
        const placeholders = Object.keys(records[0])
          .map(() => '?')
          .join(', ');
        const query = `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`;

        // Itera sobre cada registro e insere na tabela
        records.forEach((record) => {
          const values = Object.values(record);

          this.dbSqlite.run(query, values, (err) => {
            if (err) {
              // Em caso de erro, faz rollback da transação
              this.dbSqlite.run('ROLLBACK', () => reject(err));
            }
          });
          //const values = Object.values(record);

          this.dbSqlite.run(query, values, (err) => {
            if (err) {
              // Em caso de erro, faz rollback da transação
              this.dbSqlite.run('ROLLBACK', () => reject(err));
            }
          });
        });

        // Finaliza a transação
        this.dbSqlite.run('COMMIT', (err) => {
          if (err) {
            this.dbSqlite.run('ROLLBACK', () => reject(err));
          } else {
            resolve();
          }
        });
      });
    });
  }

  // Função de normalização
  private normalizarObjeto(
    objeto: { [x: string]: unknown },
    sequenciaColunas: string[]
  ) {
    const objetoNormalizado: { [x: string]: unknown } = {};

    for (const coluna of sequenciaColunas) {
      if (Object.prototype.hasOwnProperty.call(objeto, coluna)) {
        objetoNormalizado[coluna] = objeto[coluna];
      } else {
        objetoNormalizado[coluna] = null; // Ou outro valor padrão
      }
    }

    return objetoNormalizado;
  }

  /**
   * ##############################################################################
   * Métodos utilitários
   * ##############################################################################
   * /


  /**
   * 1️⃣ - Obtém as colunas da tabela com types do PostgreSQL
   */
  private async getColumnsFromDatabase(
    schema: string,
    table: string
  ): Promise<{ column_name: string; column_type: string }[]> {
    const sql = `
      SELECT column_name, data_type as column_type
      FROM information_schema.columns
      WHERE table_schema = '${schema}' AND table_name = '${table}';
    `;

    const result = await db.rawQuery(sql);
    if (!result || !result.rows.length) {
      throw new Error(`❌ Nenhuma coluna encontrada para ${schema}.${table}`);
    }

    // Remover a coluna "id"
    return result.rows.filter(
      (row: { column_name: string; column_type: string }) =>
        row.column_name !== 'id'
    );
  }

  /**
   * 2️⃣ - VERIFICA SE A TABELA EXISTE NO SQLITE E DELETA SE EXISTIR
   */
  private async dropTableIfExists(table: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dbSqlite.run(`DROP TABLE IF EXISTS ${table};`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * 3️⃣ - CRIA A TABELA NO SQLITE
   */
  private async createTableInSqlite(
    table: string,
    columns: { column_name: string; column_type: string }[],
    filePath: string
  ): Promise<{
    columns: {
      column_name: string;
      column_type: string;
    }[];
    columnsJson: string[];
  }> {
    const outputDir = this.getOutputDir(filePath);
    const firstRecord = this.getRecord(outputDir);

    const columnDefs = columns
      .map(
        (col) =>
          `${col.column_name} ${this.mapPostgresToSqliteType(col.column_type)}`
      )
      .join(', ');

    await new Promise<void>((resolve, reject) => {
      this.dbSqlite.run(
        `CREATE TABLE ${table} (${columnDefs}, PRIMARY KEY (des_contr, num_nota));`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // 2. Criar a tabela para Json
    const columnsJson = Object.keys(firstRecord);
    if (!columnsJson.includes('des_contr')) columnsJson.push('des_contr');
    if (!columnsJson.includes('status')) columnsJson.push('status');

    const columnDefsReduced = columns
      .filter((col) => columnsJson.includes(col.column_name)) // Filtra colunas presentes no firstRecord
      .map(
        (col) =>
          `${col.column_name} ${this.mapPostgresToSqliteType(col.column_type)}`
      )
      .join(', ');

    await new Promise<void>((resolve, reject) => {
      this.dbSqlite.run(
        `CREATE TABLE ${table}_json (${columnDefsReduced}, PRIMARY KEY (des_contr, num_nota));`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return { columns, columnsJson };
  }

  /**
   * 4️⃣ - CARREGA OS DADOS DO POSTGRES PARA O SQLITE
   */
  private async copyDataToSqlite(
    schema: string,
    table: string,
    columns: { column_name: string; column_type: string }[]
  ): Promise<void> {
    const columnNames = columns.map((col) => col.column_name).join(', ');
    const placeholders = columns.map(() => '?').join(', ');

    // Identificar colunas que precisam de conversão
    const dateColumns = new Set(
      columns
        .filter((col) =>
          [
            'date',
            'datetime',
            'timestamp',
            'timestamp with time zone',
          ].includes(col.column_type.toLowerCase())
        )
        .map((col) => col.column_name)
    );

    const sql = `SELECT ${columnNames} FROM ${schema}.${table};`;
    const result = await db.rawQuery(sql);

    if (!result.rows.length) {
      console.warn(`⚠️ Nenhum dado encontrado em ${schema}.${table}`);
      return;
    }

    // Percorrer os resultados e converter as datas
    const formattedRows = result.rows.map((row: Record<string, unknown>) => {
      const formattedRow: Record<string, unknown> = {};

      for (const key in row) {
        if (dateColumns.has(key) && row[key]) {
          //const date = new Date(`${row[key]}`);
          formattedRow[key] = (row[key] as Date).toISOString().split('T')[0];
        } else {
          formattedRow[key] = row[key];
        }
      }

      return formattedRow;
    });

    return new Promise((resolve, reject) => {
      this.dbSqlite.serialize(() => {
        this.dbSqlite.run('BEGIN TRANSACTION;');

        const stmt = this.dbSqlite.prepare(
          `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`
        );

        for (const row of formattedRows) {
          stmt.run(Object.values(row), (err) => {
            if (err) reject(err);
          });
        }

        stmt.finalize((err) => {
          if (err) {
            reject(err);
          } else {
            this.dbSqlite.run('COMMIT;', resolve);
          }
        });
      });
    });
  }

  /**
   * 5️⃣ - CARREGA OS DADOS DO JSON PARA O SQLITE
   */
  private async loadJsonToSqlite(
    table: string,
    filePath: string,
    columnsJson: string[]
  ): Promise<{ totalValTotal: number; countTotal: number }> {
    const outputDir = this.getOutputDir(filePath);
    const jsonFiles = this.sortFiles(this.findJsonFiles(outputDir));

    if (jsonFiles.length === 0) {
      throw new Error('Nenhum arquivo JSON reduzido encontrado.');
    }

    let countTotal = 0;
    let totalValTotal = 0;
    const uniqueCombinations = new Set<string>(); // Set para rastrear combinações únicas

    for (const file of jsonFiles) {
      const data = fs.readFileSync(file, 'utf-8');
      const jsonData = JSON.parse(data);

      const processedRecords = jsonData
        .map((row: { [x: string]: unknown }) => {
          const num_ligacao = row.num_ligacao as string;
          const seq_responsavel = row.seq_responsavel as string;
          const emp_codigo = row.emp_codigo as string;
          const des_contr = `${num_ligacao}-${seq_responsavel}-${emp_codigo}`;

          if (row.vlr_sc) {
            totalValTotal += parseFloat(`${row.vlr_sc}`);
          }
          countTotal++;

          return this.normalizarObjeto({ ...row, des_contr }, columnsJson); // Adiciona num_nota ao objeto
        })
        .filter((row: { [x: string]: unknown }) => {
          const combinationKey = `${row.des_contr}-${row.num_nota}`; // Cria chave de combinação
          if (uniqueCombinations.has(combinationKey)) {
            return false; // Combinação duplicada, filtra
          }
          uniqueCombinations.add(combinationKey); // Marca combinação como única
          return true; // Combinação única, mantém
        });

      try {
        await this.insertBatch(table, processedRecords, columnsJson);
      } catch (error) {
        console.error(
          `Erro ao inserir em lote no arquivo ${file}:`,
          error,
          processedRecords
        );
      }
    }

    return { totalValTotal, countTotal };
  }

  /**
   * 6️⃣ - COMBINAR DADOS DA TABELA ORIGINAL COM OS DADOS DO JSON
   */

  public async syncTables(
    table: string,
    tableJSon: string,
    columnsJson: string[]
  ): Promise<void> {
    console.log(`🔄 Sincronizando tabelas: ${table} ⬅️ ${tableJSon}`);

    if (!columnsJson.includes('des_contr')) columnsJson.push('des_contr');

    const columnNames = columnsJson.join(', ');

    // Criando dinamicamente a query de UPSERT
    const queryUpsert = `
      INSERT OR REPLACE INTO ${table} (${columnNames}, status, updated_at)
      SELECT ${columnNames}, 'ativo', CURRENT_TIMESTAMP
      FROM ${tableJSon};
    `;

    // Query para desativar registros que não foram atualizados
    const queryDeactivate = `
      UPDATE ${table}
      SET status = 'inativo'
      WHERE DATE(updated_at) < DATE('now');
    `;

    return new Promise((resolve, reject) => {
      this.dbSqlite.serialize(() => {
        this.dbSqlite.run(queryUpsert, (err) => {
          if (err) {
            console.error('❌ Erro no UPSERT:', err);
            reject(err);
          } else {
            console.log('✅ UPSERT concluído!');

            this.dbSqlite.run(queryDeactivate, (err) => {
              if (err) {
                console.error('❌ Erro ao desativar registros:', err);
                reject(err);
              } else {
                console.log('✅ Registros inativos atualizados!');
                resolve();
              }
            });
          }
        });
      });
    });
  }

  /**
   * 7️⃣ - ENVIA OS DADOS DO SQLITE PARA O POSTGRES
   */

  public async syncToPostgres(
    schema: string,
    sourceTable: string,
    columnsAndTypes: { column_name: string; column_type: string }[]
  ): Promise<void> {
    const tempTable = `${sourceTable}_new`;
    const oldTable = `${sourceTable}_old`;
    const originalTable = `${sourceTable}`;

    const columns = columnsAndTypes.map((column) => column.column_name);
    if (!columns.includes('des_contr')) columns.push('des_contr');

    const columnNames = columns.join(', ');

    console.log(`🚀 Iniciando sincronização para ${sourceTable}...`);

    const trx = await db.transaction(); // Iniciar transação para garantir atomicidade
    try {
      // 1️⃣ Verificar se a tabela original existe
      const tableExists = await trx.rawQuery(
        `SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = '${schema}' AND tablename = '${originalTable}');`
      );
      if (!tableExists.rows[0].exists) {
        throw new Error(`Tabela ${originalTable} não existe.`);
      }

      // 2️⃣ Criar a nova tabela baseada na original
      await trx.rawQuery(
        `CREATE TABLE ${schema}.${tempTable} (LIKE ${schema}.${originalTable} INCLUDING ALL);`
      );

      await trx.rawQuery(
        `CREATE SEQUENCE "${schema}"."${tempTable}_id_seq"
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;`
      );

      await trx.rawQuery(
        `ALTER TABLE "${schema}"."${tempTable}"
        ALTER COLUMN id SET DEFAULT nextval('"${schema}"."${tempTable}_id_seq"');`
      );

      console.log(`✅ Criada tabela temporária ${tempTable}.`);

      // 3️⃣ Ler dados do SQLite em memória
      const rows = await new Promise<Dictionary<unknown, string>[]>(
        (resolve, reject) => {
          this.dbSqlite.all(
            `SELECT ${columnNames}, status, updated_at FROM ${sourceTable}`,
            (err, rows) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows as Dictionary<unknown, string>[]);
              }
            }
          );
        }
      );

      console.log(`✅ Dados lidos do SQLite. Total de linhas: ${rows.length}.`);

      // 4️⃣ Inserir os dados na tabela temporária do PostgreSQL
      if (rows.length > 0) {
        if (rows.length > 1000) {
          const rowsChunked = chunks(rows, 1000);
          for (const chunk of rowsChunked) {
            await trx.table(`${schema}.${tempTable}`).multiInsert(chunk);
            /*
            try {
              await trx.table(`${schema}.${tempTable}`).multiInsert(chunk);
            } catch (error) {
              console.error(
                `Erro ao inserir dados em ${tempTable}:
                  Dados: ${JSON.stringify(chunk)},
                Erro: ${JSON.stringify(error)}`
              );
            }
             */
          }
        } else {
          await trx.table(`${schema}.${tempTable}`).multiInsert(rows);
        }

        console.log(
          `✅ Dados inseridos em ${tempTable}. Linhas afetadas: ${rows.length}.`
        );
      } else {
        console.log('ℹ️ Nenhum dado para inserir.');
      }

      // 5️⃣ Renomear a tabela original para `_old`
      await trx.rawQuery(`
        ALTER TABLE ${schema}.${originalTable} RENAME TO ${oldTable};
        ALTER SEQUENCE "${schema}"."${originalTable}_id_seq" RENAME TO "${oldTable}_id_seq";
        `);

      console.log(`🔄 Renomeado ${originalTable} para ${oldTable}.`);

      // 6️⃣ Renomear a nova tabela para o nome original
      await trx.rawQuery(`
        ALTER TABLE ${schema}.${tempTable} RENAME TO ${originalTable};
        ALTER SEQUENCE "${schema}"."${tempTable}_id_seq" RENAME TO "${originalTable}_id_seq";
      `);
      console.log(`🔄 Renomeado ${tempTable} para ${originalTable}.`);

      // 7️⃣ Dropar a tabela antiga
      await trx.rawQuery(`
        ALTER TABLE ${schema}.${oldTable} ALTER COLUMN id DROP DEFAULT;
        DROP SEQUENCE IF EXISTS ${schema}.${oldTable}_id_seq;
        DROP TABLE IF EXISTS ${schema}.${oldTable} CASCADE;
      `);
      console.log(`🗑️ Tabela ${oldTable} removida.`);

      await trx.commit();
      console.log(`🎉 Sincronização concluída com sucesso! 💋`);
    } catch (error) {
      await trx.rollback();
      console.error(`❌ Erro durante a sincronização:`, error);
      throw error; // Rejeitar a promise para que o chamador saiba que houve um erro
    }
  }

  /*
   * 8️⃣ - Alimentar base contratos
   */
  public async syncContratos(
    schema: string,
    sourceTable: string,
    destinationTable: string
  ): Promise<void> {
    const sql = `INSERT INTO ${schema}.${destinationTable} (
    des_contr,
    emp_codigo,
    chave_contrato,
    num_ligacao,
    seq_responsavel,
    nom_cliente,
    sit_lig,
    ultimo_contrato,
    sub_categoria,
    comportamento_arrecadacao_6_m,
    status_adimplencia,
    flag_grande_cliente,
    maior_aging_vencimento,
    tipo_doc_pri,
    num_doc_1,
    status,
    created_at,
    updated_at
    )
    SELECT DISTINCT ON (des_contr)
        des_contr,
        emp_codigo,
        chave_contrato,
        num_ligacao,
        seq_responsavel,
        nom_cliente,
        sit_lig,
        ultimo_contrato,
        sub_categoria,
        comportamento_arrecadacao_6_m,
        status_adimplencia,
        flag_grande_cliente,
        maior_aging_vencimento,
        tipo_doc_pri,
        num_doc_1,
        status,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    FROM ${schema}.${sourceTable}
    ORDER BY des_contr, id -- Ordena por des_contr e id para definir qual registro será mantido
    ON CONFLICT (des_contr)
    DO UPDATE SET
        emp_codigo = EXCLUDED.emp_codigo,
        chave_contrato = EXCLUDED.chave_contrato,
        num_ligacao = EXCLUDED.num_ligacao,
        seq_responsavel = EXCLUDED.seq_responsavel,
        nom_cliente = EXCLUDED.nom_cliente,
        sit_lig = EXCLUDED.sit_lig,
        ultimo_contrato = EXCLUDED.ultimo_contrato,
        sub_categoria = EXCLUDED.sub_categoria,
        comportamento_arrecadacao_6_m = EXCLUDED.comportamento_arrecadacao_6_m,
        status_adimplencia = EXCLUDED.status_adimplencia,
        flag_grande_cliente = EXCLUDED.flag_grande_cliente,
        maior_aging_vencimento = EXCLUDED.maior_aging_vencimento,
        tipo_doc_pri = EXCLUDED.tipo_doc_pri,
        num_doc_1 = EXCLUDED.num_doc_1,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP`;

    await db.rawQuery(sql);
  }

  /**
   * 9️⃣ - Alimentar base de prestações
   */
  public async syncPrestacoes(
    schema: string,
    sourceTable: string,
    destinationTable: string
  ): Promise<void> {
    const sql = `INSERT INTO ${schema}.${destinationTable} (
    des_contr,
    data_ultimo_pagamento,
    ref_nf,
    dat_venc,
    dias_venc,
    num_nota,
    vlr_sc,
    tributo,
    aging_vencimento,
    status,
    created_at,
    updated_at
    )
    SELECT DISTINCT ON (des_contr, num_nota, vlr_sc)
        des_contr,
        data_ultimo_pagamento,
        ref_nf,
        dat_venc,
        dias_venc,
        num_nota,
        vlr_sc, -- Incluindo a coluna vlr_sc
        tributo,
        aging_vencimento,
        status,
        CURRENT_TIMESTAMP, -- created_at
        CURRENT_TIMESTAMP  -- updated_at
    FROM ${schema}.${sourceTable}
    ORDER BY des_contr, num_nota, vlr_sc, id -- Ordena para garantir qual registro será mantido
    ON CONFLICT (des_contr, num_nota, vlr_sc) -- Conflito na combinação de des_contr e num_nota
    DO UPDATE SET
        data_ultimo_pagamento = EXCLUDED.data_ultimo_pagamento,
        ref_nf = EXCLUDED.ref_nf,
        dat_venc = EXCLUDED.dat_venc,
        dias_venc = EXCLUDED.dias_venc,
        vlr_sc = EXCLUDED.vlr_sc,
        tributo = EXCLUDED.tributo,
        aging_vencimento = EXCLUDED.aging_vencimento,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP; -- Atualiza o updated_at`;

    await db.rawQuery(sql);
  }

  /**
   * 1️⃣0️⃣- Alimentar base de contatos
   */
  public async syncContatos(
    schema: string,
    sourceTable: string,
    destinationTable: string
  ): Promise<void> {
    try {
      // Passo 1: Ler os dados da tabela tbl_base_dataset com DISTINCT em des_contr
      const dt: DatasetRow[] = await db
        .from(`${schema}.${sourceTable}`)
        .distinct('des_contr')
        .select('*')
        .where('updated_at', '>=', DateTime.now().startOf('day').toSQL()) // Filtra registros atualizados hoje
        .andWhere('updated_at', '<', DateTime.now().endOf('day').toSQL());

      // Passo 2: Dividir o dataset em pedaços de 1000 linhas
      const chunk = chunks(dt, 1000);

      for (const dataset of chunk) {
        // Passo 3: Para cada linha do dataset, gerar os contatos
        const cts = dataset.flatMap((row: DatasetRow) =>
          this.generateContacts(row)
        );

        const contacts: Contact[] = Array.from(
          new Map<string, Contact>(
            cts.map((c: Contact) => [
              `${c.des_contr}-${c.tipo_contato}-${c.contato}`,
              c,
            ])
          ).values()
        );

        // Passo 4: Inserir ou atualizar os contatos na tabela destinationTable usando rawQuery em massa
        if (contacts.length > 0) {
          await db.rawQuery(
            `
          INSERT INTO ${schema}.${destinationTable} (
            des_contr, tipo_contato, contato, updated_at
          )
          SELECT * FROM UNNEST(
            :des_contr::text[],
            :tipo_contato::text[],
            :contato::text[],
            :updated_at::timestamptz[]
          )
          ON CONFLICT (des_contr, tipo_contato, contato)
          DO NOTHING
        `,
            {
              des_contr: contacts.map((c: Contact) => c.des_contr),
              tipo_contato: contacts.map((c: Contact) => c.tipo_contato),
              contato: contacts.map((c: Contact) => c.contato),
              updated_at: contacts.map((c: Contact) => c.updated_at.toSQL()),
            }
          );
        }
      }

      console.info('Transformação de contatos concluída com sucesso!');
    } catch (error) {
      console.error(`Erro ao transformar contatos: ${error.message}`);
    }
  }

  /**
   * Método principal que sincroniza a tabela.
   */
  public async syncTable(
    schema: string,
    table: string,
    externalFile_id: number | string
  ): Promise<void> {
    console.log(`🔄 Sincronizando a tabela ${schema}.${table} com SQLite...`);
    const externalFile = await ExternalFile.findOrFail(externalFile_id);
    const initialCount = (
      await db
        .from(`${schema}.tbl_base_contratos`)
        .where('status', 'ativo')
        .count('*')
    )[0]['count'];

    const initialInativoCount = (
      await db
        .from(`${schema}.tbl_base_contratos`)
        .where('status', 'inativo')
        .count('*')
    )[0]['count'];

    /*     const interval = setInterval(() => {
      const memoryUsage = process.memoryUsage();
      console.log(`Uso de memória: RSS ${memoryUsage.rss / 1024 / 1024} MB`);
    }, 1000); */

    // 1️⃣ - Obtém colunas do PostgreSQL
    console.log(`🔄 Obtendo colunas do PostgreSQL...`);
    const columns = await this.getColumnsFromDatabase(schema, table);

    // 2️⃣ - Remove a tabela se já existir no SQLite
    console.log(`🔄 Removendo a tabela ${table} do SQLite (se existir)...`);
    await this.dropTableIfExists(table);
    await this.dropTableIfExists(`${table}_json`);
    console.log(`✅ Tabela ${table} removida do SQLite (se existia).`);

    // 3️⃣ - Cria a nova tabela no SQLite
    const { columnsJson } = await this.createTableInSqlite(
      table,
      columns,
      externalFile.filePath
    );
    console.log(`✅ Tabela ${table} recriada no SQLite.`);

    // 4️⃣ - Copia os dados do PostgreSQL para o SQLite
    await this.copyDataToSqlite(schema, table, columns);
    console.log(`✅ Dados copiados de ${schema}.${table} para SQLite.`);

    // 7️⃣ - Carregar dados do XLSX para SQLite
    const { totalValTotal: val_total, countTotal } =
      await this.loadJsonToSqlite(
        `${table}_json`,
        externalFile.filePath,
        columnsJson
      );

    // 8️⃣ - Combinar dados da tabela original com os dados do JSON
    await this.syncTables(table, `${table}_json`, columnsJson);

    // 9️⃣ - Enviar dados para o PostgreSQL
    await this.syncToPostgres(schema, table, columns);
    //clearInterval(interval);

    console.log('🔟 - Alimentar base contratos');
    await this.syncContratos(schema, table, 'tbl_base_contratos');

    console.log('1️⃣ 1️⃣ - Alimentar base prestações');
    await this.syncPrestacoes(schema, table, 'tbl_base_prestacoes');

    console.log('1️⃣ 2️⃣ - Alimentar base contatos');
    await this.syncContatos(schema, table, 'tbl_base_contatos');

    const finalCount = (
      await db
        .from(`${schema}.tbl_base_contratos`)
        .where('status', 'ativo')
        .count('*')
    )[0]['count'];

    const countInactive = (
      await db
        .from(`${schema}.tbl_base_contratos`)
        .where('status', 'inativo')
        .count('*')
    )[0]['count'];

    await this.handleExternalFile(
      externalFile,
      finalCount,
      initialCount,
      countInactive,
      countTotal,
      initialInativoCount,
      val_total ? val_total : 0
    );

    console.log(`🎉 Sincronização concluída! 🥳 🍾`);
  }
}
