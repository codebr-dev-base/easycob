import db from '@adonisjs/lucid/services/db';
import sqlite3 from 'sqlite3';
import ExcelJS from 'exceljs';
import { Dictionary } from '@adonisjs/lucid/types/querybuilder';
import string from '@adonisjs/core/helpers/string';
import { chunks } from '#utils/array';
import ExternalFile from '#models/external/external_file';
import { DateTime } from 'luxon';

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
  is_whatsapp: boolean;
  is_celular: boolean;
  dt_import: DateTime;
  peso: number;
  block: boolean;
  block_all: boolean;
  priority: number;
  cpc: boolean;
  criado_automatico: boolean;
  block_tactium: boolean;
  block_tactium_dt: DateTime | null;
  formato_correto: boolean;
  block_otima: boolean;
  block_otima_dt: DateTime | null;
  valido_sms: boolean;
  percentual_atender: number;
  count_atender: number;
  dominio_valido: boolean;
  dt_block_tactium: DateTime | null;
  enviar_sms: boolean;
  is_domain_valid: boolean;
  created_at: DateTime;
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

  /**
   * Inferir o tipo do valor lido do XLSX.
   */
  /*
  private inferType(value: unknown): string {
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'INTEGER' : 'REAL';
    }

    if (typeof value === 'boolean') {
      return 'INTEGER'; // SQLite não tem BOOLEAN, então armazenamos como 0 e 1
    }

    if (typeof value === 'string') {
      // Tenta converter para número
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        return Number.isInteger(numValue) ? 'INTEGER' : 'REAL';
      }
    }

    return 'TEXT'; // Se não for nenhum dos tipos acima, mantém como texto
  }
 */

  /**
   * Criar contatos a partir de um objeto DatasetRow
   */
  private generateContacts(row: DatasetRow): Contact[] {
    const contacts: Contact[] = [];

    // Função para adicionar um contato ao array
    const addContact = (
      tipo_contato: 'TELEFONE' | 'EMAIL',
      contato: string | null,
      is_celular = false,
      is_whatsapp = false
    ) => {
      if (contato) {
        contacts.push({
          des_contr: row.des_contr, // Relaciona o contato ao contrato original
          tipo_contato,
          contato,
          is_whatsapp,
          is_celular,
          dt_import: DateTime.now(),
          peso: 1, // Valor padrão para peso
          block: false, // Valor padrão para block
          block_all: false, // Valor padrão para block_all
          priority: 0, // Valor padrão para priority
          cpc: false, // Valor padrão para cpc
          criado_automatico: true, // Indica que o registro foi criado automaticamente
          block_tactium: false, // Valor padrão para block_tactium
          block_tactium_dt: null, // Valor padrão para block_tactium_dt
          formato_correto: true, // Assumindo que o formato está correto
          block_otima: false, // Valor padrão para block_otima
          block_otima_dt: null, // Valor padrão para block_otima_dt
          valido_sms: true, // Assumindo que o número é válido para SMS
          percentual_atender: 100, // Valor padrão para percentual_atender
          count_atender: 0, // Valor padrão para count_atender
          dominio_valido: true, // Assumindo que o domínio é válido
          dt_block_tactium: null, // Valor padrão para dt_block_tactium
          enviar_sms: true, // Valor padrão para enviar_sms
          is_domain_valid: true, // Assumindo que o domínio é válido
          created_at: DateTime.now(),
          updated_at: DateTime.now(),
        });
      }
    };

    // Celular 1
    addContact('TELEFONE', row.num_celular, true, true); // Celular e WhatsApp

    // Celular 2
    addContact('TELEFONE', row.num_celular_2, true, true); // Celular e WhatsApp

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
    columns: { column_name: string; column_type: string }[]
  ): Promise<void> {
    const columnDefs = columns
      .map(
        (col) =>
          `${col.column_name} ${this.mapPostgresToSqliteType(col.column_type)}`
      )
      .join(', ');

    return new Promise((resolve, reject) => {
      this.dbSqlite.run(
        `CREATE TABLE ${table} (${columnDefs}, PRIMARY KEY (des_contr, num_nota));`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
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

        /*
        const columnNames = Object.keys(result.rows[0]).join(', ');
        const placeholders = Object.keys(result.rows[0])
          .map(() => '?')
          .join(',');
        */

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
   * 5️⃣ - Carrega os dados do XLSX e infere os tipos das colunas.
   */
  private async loadXlsxData(filePath: string): Promise<{
    data: Record<string, unknown>[];
    inferredTypes: Record<string, string>;
  }> {
    console.log(`📥 Lendo arquivo XLSX: ${filePath}...`);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error('❌ Planilha XLSX inválida ou vazia.');
    }

    const rows: Record<string, unknown>[] = [];
    let inferredTypes: Record<string, string> = {};

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) {
        // Primeira linha contém os nomes das colunas
        inferredTypes = (row.values as string[]).reduce(
          (acc: Record<string, string>, colName: string) => {
            const colNameClean = string
              .snakeCase(colName.toString())
              .toLowerCase()
              .trim();
            acc[colNameClean] = 'TEXT'; // Definido como padrão
            return acc;
          },
          {}
        );
      } else {
        // Linhas seguintes são os dados
        const rowData: Record<string, unknown> = {};
        row.eachCell((cell, colIndex) => {
          const columnName = Object.keys(inferredTypes)[colIndex - 1];
          let value = cell.value;

          if (value instanceof Date) {
            value = value.toISOString().split('T')[0]; // Pega apenas a parte antes do 'T'
          }

          if (columnName) {
            rowData[columnName] =
              typeof value === 'string' ? value.trim() : value;

            // Inferir o tipo se ainda não foi definido
            /*             if (inferredTypes[columnName] === 'TEXT') {
              inferredTypes[columnName] = this.inferType(value);
            } */
          }
        });

        if (Object.keys(rowData).length > 0) {
          rows.push(rowData);
        }
      }
    });

    console.log('✅ XLSX lido com sucesso.');
    return { data: rows, inferredTypes };
  }

  /**
   * 6️⃣ - Cria a tabela no SQLite.
   */
  private async createTableXlsxInSqlite(
    tableName: string,
    inferredTypes: Record<string, string>
  ) {
    console.log(`🛠 Criando a tabela ${tableName} no SQLite...`);

    const columns = Object.keys(inferredTypes);
    if (!columns.includes('des_contr')) columns.push('des_contr');
    if (!columns.includes('status')) columns.push('status');

    const columnDefinitions = columns
      .map((col) => `${col} ${inferredTypes[col] || 'TEXT'}`)
      .join(', ');

    return new Promise((resolve, reject) => {
      this.dbSqlite.run(`DROP TABLE IF EXISTS ${tableName};`, (err) => {
        if (err) reject(err);
        this.dbSqlite.run(
          `CREATE TABLE ${tableName} (${columnDefinitions}, PRIMARY KEY (des_contr, num_nota));`,
          (err) => {
            if (err) reject(err);
            console.log(`✅ Tabela ${tableName} criada no SQLite.`);
            resolve(true);
          }
        );
      });
    });
  }

  /**
   * 7️⃣ - CARREGA OS DADOS DO XLSX PARA O SQLITE
   */
  private async loadXlsxDataToSqlite(
    xlsxData: Record<string, unknown>[],
    tableName: string,
    inferredTypes: Record<string, string>
  ) {
    console.log(`📥 Carregando XLSX para SQLite na tabela ${tableName}...`);
    let val_total = 0;
    if (xlsxData.length === 0) {
      console.log('⚠️ Nenhum dado encontrado para inserir.');
      return;
    }
    const columns = Object.keys(inferredTypes);
    if (!columns.includes('des_contr')) columns.push('des_contr');
    if (!columns.includes('status')) columns.push('status');

    const placeholders = columns.map(() => '?').join(', ');
    const columnNames = columns.join(', ');

    const stmt = this.dbSqlite.prepare(
      `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`
    );

    for (const row of xlsxData) {
      const num_ligacao = row.num_ligacao as string;
      const seq_responsavel = row.seq_responsavel as string;
      row.des_contr = `${num_ligacao}-${seq_responsavel}-8`;
      //row.status = 'ativo';
      if (row.vlr_sc) val_total = parseFloat(`${row.vlr_sc}`) + val_total;

      const values = columns.map((col) => {
        const value = row[col];

        if (value === undefined || value === null) return null;

        const inferredType = inferredTypes[col];

        if (inferredType === 'INTEGER')
          return parseInt(value as string, 10) || null;
        if (inferredType === 'REAL') return parseFloat(value as string) || null;
        if (inferredType === 'TEXT') return value.toString();

        return value;
      });

      stmt.run(values);
    }

    stmt.finalize();

    console.log(
      `✅ XLSX carregado no SQLite com ${xlsxData.length} registros.`
    );
    return val_total;
  }

  /**
   * 8️⃣ - COMBINAR DADOS DA TABELA ORIGINAL COM OS DADOS DO XLSX
   */

  public async syncTables(
    table: string,
    tableXlsx: string,
    inferredTypes: Record<string, string>
  ): Promise<void> {
    console.log(`🔄 Sincronizando tabelas: ${table} ⬅️ ${tableXlsx}`);

    const columns = Object.keys(inferredTypes);
    if (!columns.includes('des_contr')) columns.push('des_contr');

    const columnNames = columns.join(', ');
    //const conflictColumns = ['des_contr', 'num_nota']; // Colunas de conflito
    // Gera a cláusula SET dinamicamente
    /* const setClause = columns
      .filter((col) => !conflictColumns.includes(col)) // Ignora as colunas de conflito
      .map((col) => `${col} = excluded.${col}`) // Formata como "coluna = excluded.coluna"
      .join(', '); // Junta tudo com vírgulas */

    // Criando dinamicamente a query de UPSERT
    const queryUpsert = `
      INSERT OR REPLACE INTO ${table} (${columnNames}, status, updated_at)
      SELECT ${columnNames}, 'ativo', CURRENT_TIMESTAMP
      FROM ${tableXlsx};
    `;

    /*
    // Constrói a query de UPSERT
    const queryUpsert = `
      INSERT INTO ${table} (${columnNames}, status, updated_at)
      SELECT ${columnNames}, 'ativo', CURRENT_TIMESTAMP
      FROM ${tableXlsx}
      ON CONFLICT (${conflictColumns.join(', ')}) DO UPDATE
      SET ${setClause}, status = excluded.status, updated_at = excluded.updated_at;
    `;
     */

    // Query para desativar registros que não foram atualizados
    const queryDeactivate = `
      UPDATE ${table}
      SET status = 'inativo'
      WHERE des_contr NOT IN (SELECT des_contr FROM ${tableXlsx});
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

  /*
  public async syncTables(
    table: string,
    tableXlsx: string,
    inferredTypes: Record<string, string>
  ): Promise<void> {
    console.log(`🔄 Sincronizando tabelas: ${table} ⬅️ ${tableXlsx}`);

    const columns = Object.keys(inferredTypes);
    if (!columns.includes('des_contr')) columns.push('des_contr');

    const columnNames = columns.join(', ');
    const updateAssignments = columns
      .map(
        (col) =>
          `${col} = (SELECT ${col} FROM ${tableXlsx} WHERE ${tableXlsx}.des_contr = ${table}.des_contr)`
      )
      .join(', ');

    return new Promise((resolve, reject) => {
      this.dbSqlite.serialize(() => {
        // 1️⃣ Primeiro, tenta atualizar os registros existentes
        const updateQuery = `
          UPDATE ${table}
          SET ${updateAssignments},
          status = 'ativo',
          updated_at = CURRENT_TIMESTAMP
          WHERE EXISTS (SELECT 1 FROM ${tableXlsx} WHERE ${tableXlsx}.des_contr = ${table}.des_contr);
        `;

        this.dbSqlite.run(updateQuery, (err) => {
          if (err) {
            console.error('❌ Erro no UPDATE:', err);
            return reject(err);
          }
          console.log('✅ Registros existentes atualizados!');

          // 2️⃣ Agora, insere novos registros que não existem
          const insertQuery = `
            INSERT INTO ${table} (${columnNames}, status, updated_at)
            SELECT ${columnNames}, 'ativo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM ${tableXlsx}
            WHERE NOT EXISTS (SELECT 1 FROM ${table} WHERE ${table}.des_contr = ${tableXlsx}.des_contr);
          `;

          this.dbSqlite.run(insertQuery, (err) => {
            if (err) {
              console.error('❌ Erro no INSERT:', err);
              return reject(err);
            }
            console.log('✅ Novos registros inseridos!');

            // 3️⃣ Desativar registros que não foram atualizados
            const deactivateQuery = `
              UPDATE ${table}
              SET status = 'inativo'
              WHERE des_contr NOT IN (SELECT des_contr FROM ${tableXlsx});
            `;

            this.dbSqlite.run(deactivateQuery, (err) => {
              if (err) {
                console.error('❌ Erro ao desativar registros:', err);
                return reject(err);
              }
              console.log('✅ Registros inativos atualizados!');
              resolve();
            });
          });
        });
      });
    });
  }
 */
  /**
   * 9️⃣ - ENVIA OS DADOS DO SQLITE PARA O POSTGRES
   */

  public async syncToPostgres(
    schema: string,
    sourceTable: string,
    inferredTypes: Record<string, string>
  ): Promise<void> {
    const tempTable = `${sourceTable}_new`;
    const oldTable = `${sourceTable}_old`;
    const originalTable = `${sourceTable}`;

    const columns = Object.keys(inferredTypes);
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
        if (rows.length > 10000) {
          const rowsChunked = chunks(rows, 1000);
          for (const chunk of rowsChunked) {
            await trx.table(`${schema}.${tempTable}`).multiInsert(chunk);
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
   * 🔟 - Alimentar base contratos
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
   * 1️⃣1️⃣ - Alimentar base de prestações
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
   * 1️⃣2️⃣ - Alimentar base de contatos
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
            des_contr, tipo_contato, contato, is_whatsapp, is_celular, dt_import,
            peso, block, block_all, priority, cpc, criado_automatico, block_tactium,
            block_tactium_dt, formato_correto, block_otima, block_otima_dt, valido_sms,
            percentual_atender, count_atender, dominio_valido, dt_block_tactium,
            enviar_sms, is_domain_valid, created_at, updated_at
          )
          SELECT * FROM UNNEST(
            :des_contr::text[],
            :tipo_contato::text[],
            :contato::text[],
            :is_whatsapp::boolean[],
            :is_celular::boolean[],
            :dt_import::timestamptz[],
            :peso::int[],
            :block::boolean[],
            :block_all::boolean[],
            :priority::int[],
            :cpc::boolean[],
            :criado_automatico::boolean[],
            :block_tactium::boolean[],
            :block_tactium_dt::timestamptz[],
            :formato_correto::boolean[],
            :block_otima::boolean[],
            :block_otima_dt::timestamptz[],
            :valido_sms::boolean[],
            :percentual_atender::int[],
            :count_atender::int[],
            :dominio_valido::boolean[],
            :dt_block_tactium::timestamptz[],
            :enviar_sms::boolean[],
            :is_domain_valid::boolean[],
            :created_at::timestamptz[],
            :updated_at::timestamptz[]
          )
          ON CONFLICT (des_contr, tipo_contato, contato)
          DO UPDATE SET
            is_whatsapp = EXCLUDED.is_whatsapp,
            is_celular = EXCLUDED.is_celular,
            dt_import = EXCLUDED.dt_import,
            peso = EXCLUDED.peso,
            block = EXCLUDED.block,
            block_all = EXCLUDED.block_all,
            priority = EXCLUDED.priority,
            cpc = EXCLUDED.cpc,
            criado_automatico = EXCLUDED.criado_automatico,
            block_tactium = EXCLUDED.block_tactium,
            block_tactium_dt = EXCLUDED.block_tactium_dt,
            formato_correto = EXCLUDED.formato_correto,
            block_otima = EXCLUDED.block_otima,
            block_otima_dt = EXCLUDED.block_otima_dt,
            valido_sms = EXCLUDED.valido_sms,
            percentual_atender = EXCLUDED.percentual_atender,
            count_atender = EXCLUDED.count_atender,
            dominio_valido = EXCLUDED.dominio_valido,
            dt_block_tactium = EXCLUDED.dt_block_tactium,
            enviar_sms = EXCLUDED.enviar_sms,
            is_domain_valid = EXCLUDED.is_domain_valid,
            updated_at = EXCLUDED.updated_at
        `,
            {
              des_contr: contacts.map((c: Contact) => c.des_contr),
              tipo_contato: contacts.map((c: Contact) => c.tipo_contato),
              contato: contacts.map((c: Contact) => c.contato),
              is_whatsapp: contacts.map((c: Contact) => c.is_whatsapp),
              is_celular: contacts.map((c: Contact) => c.is_celular),
              dt_import: contacts.map((c: Contact) => c.dt_import.toSQL()),
              peso: contacts.map((c: Contact) => c.peso),
              block: contacts.map((c: Contact) => c.block),
              block_all: contacts.map((c: Contact) => c.block_all),
              priority: contacts.map((c: Contact) => c.priority),
              cpc: contacts.map((c: Contact) => c.cpc),
              criado_automatico: contacts.map(
                (c: Contact) => c.criado_automatico
              ),
              block_tactium: contacts.map((c: Contact) => c.block_tactium),
              block_tactium_dt: contacts.map(
                (c: Contact) => c.block_tactium_dt?.toSQL() || null
              ),
              formato_correto: contacts.map((c: Contact) => c.formato_correto),
              block_otima: contacts.map((c: Contact) => c.block_otima),
              block_otima_dt: contacts.map(
                (c: Contact) => c.block_otima_dt?.toSQL() || null
              ),
              valido_sms: contacts.map((c: Contact) => c.valido_sms),
              percentual_atender: contacts.map(
                (c: Contact) => c.percentual_atender
              ),
              count_atender: contacts.map((c: Contact) => c.count_atender),
              dominio_valido: contacts.map((c: Contact) => c.dominio_valido),
              dt_block_tactium: contacts.map(
                (c: Contact) => c.dt_block_tactium?.toSQL() || null
              ),
              enviar_sms: contacts.map((c: Contact) => c.enviar_sms),
              is_domain_valid: contacts.map((c: Contact) => c.is_domain_valid),
              created_at: contacts.map((c: Contact) => c.created_at.toSQL()),
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
    console.log(`✅ Tabela ${table} removida do SQLite (se existia).`);

    // 3️⃣ - Cria a nova tabela no SQLite
    await this.createTableInSqlite(table, columns);
    console.log(`✅ Tabela ${table} recriada no SQLite.`);

    // 4️⃣ - Copia os dados do PostgreSQL para o SQLite
    await this.copyDataToSqlite(schema, table, columns);
    console.log(`✅ Dados copiados de ${schema}.${table} para SQLite.`);

    // 5️⃣ - Carregar XLSX para SQLite
    const { data: xlsxData, inferredTypes } = await this.loadXlsxData(
      externalFile.filePath
    );

    // 6️⃣ - Criar tabela no SQLite
    await this.createTableXlsxInSqlite('xlsx' + table, inferredTypes);

    // 7️⃣ - Carregar dados do XLSX para SQLite
    const val_total = await this.loadXlsxDataToSqlite(
      xlsxData,
      'xlsx' + table,
      inferredTypes
    );

    // 8️⃣ - Combinar dados da tabela original com os dados do XLSX
    await this.syncTables(table, 'xlsx' + table, inferredTypes);

    // 9️⃣ - Enviar dados para o PostgreSQL
    await this.syncToPostgres(schema, table, inferredTypes);
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
      xlsxData.length,
      initialInativoCount,
      val_total ? val_total : 0
    );

    console.log(`🎉 Sincronização concluída! 🥳 🍾`);
  }
}
