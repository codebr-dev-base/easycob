import db from '@adonisjs/lucid/services/db';
import sqlite3 from 'sqlite3';
import ExcelJS from 'exceljs';
import { Dictionary } from '@adonisjs/lucid/types/querybuilder';

export default class ClientSyncService {
  private dbSqlite: sqlite3.Database;

  constructor() {
    this.dbSqlite = new sqlite3.Database(':memory:');
  }

  public async syncClientsFromXlsx(filePath: string, table: string) {
    console.log('🔄 Iniciando sincronização de clientes...');

    // 1. Carregar XLSX para SQLite
    const { data: xlsxData, inferredTypes } = await this.loadXlsxData(filePath);

    // 2. Criar tabela no SQLite
    await this.createTableXlsxInSqlite('xlsx' + table, inferredTypes);

    // 3. Carregar dados do XLSX para SQLite
    await this.loadXlsxDataToSqlite(xlsxData, 'xlsx' + table, inferredTypes);

    // 4. Combinar dados da tabela original com os dados do XLSX
    await this.syncTables(table, 'xlsx' + table);

    // 5. Enviar dados para o PostgreSQL
    await this.syncToPostgres(table);

    console.log('✅ Sincronização concluída!');
  }

  /**
   * Inferir o tipo do valor lido do XLSX.
   */
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

      // Tenta converter para data
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        return 'TEXT'; // Armazena data como string ISO-8601
      }
    }

    return 'TEXT'; // Se não for nenhum dos tipos acima, mantém como texto
  }

  /**
   * Carrega os dados do XLSX e infere os tipos das colunas.
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
        inferredTypes = (row.values as string[])
          .slice(1)
          .reduce((acc: Record<string, string>, colName: string) => {
            acc[colName] = 'TEXT'; // Definido como padrão
            return acc;
          }, {});
      } else {
        // Linhas seguintes são os dados
        const rowData: Record<string, unknown> = {};
        row.eachCell((cell, colIndex) => {
          const columnName = Object.keys(inferredTypes)[colIndex - 1];
          const value = cell.value;

          if (columnName) {
            rowData[columnName] = value;

            // Inferir o tipo se ainda não foi definido
            if (inferredTypes[columnName] === 'TEXT') {
              inferredTypes[columnName] = this.inferType(value);
            }
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
   * Cria a tabela no SQLite.
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
          `CREATE TABLE ${tableName} (${columnDefinitions});`,
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
   * CARREGA OS DADOS DO XLSX PARA O SQLITE
   */
  private async loadXlsxDataToSqlite(
    xlsxData: Record<string, unknown>[],
    tableName: string,
    inferredTypes: Record<string, string>
  ) {
    console.log(`📥 Carregando XLSX para SQLite na tabela ${tableName}...`);

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
      row.status = 'ativo';

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
  }

  /**
   * COMBINAR DADOS DA TABELA ORIGINAL COM OS DADOS DO XLSX
   */
  public async syncTables(table: string, tableXlsx: string): Promise<void> {
    console.log(`🔄 Sincronizando tabelas: ${table} ⬅️ ${tableXlsx}`);

    return new Promise((resolve, reject) => {
      this.dbSqlite.serialize(() => {
        const queryUpsert = `
            INSERT INTO ${table} (
              des_contr, num_ligacao, seq_responsavel, nom_cliente, sit_lig, classificacao_agrupamento,
              num_doc_1, tipo_doc_pri, num_celular_2, num_celular, num_comercial, num_recado,
              num_residencial, dsc_email, dsc_email_2, referencianota, dat_venc, vlr_sc, tributo,
              dias_vencido, aging_nota, sub_categoria, priorizar, base_automatica, aging_referencia,
              comportamento_arrecadado, bairro, status, created_at, updated_at
            )
            SELECT
              des_contr, num_ligacao, seq_responsavel, nom_cliente, sit_lig, classificacao_agrupamento,
              num_doc_1, tipo_doc_pri, num_celular_2, num_celular, num_comercial, num_recado,
              num_residencial, dsc_email, dsc_email_2, referencianota, dat_venc, vlr_sc, tributo,
              dias_vencido, aging_nota, sub_categoria, priorizar, base_automatica, aging_referencia,
              comportamento_arrecadado, bairro, 'ativo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            FROM ${tableXlsx}
            ON CONFLICT(des_contr) DO UPDATE SET
              nom_cliente = excluded.nom_cliente,
              sit_lig = excluded.sit_lig,
              classificacao_agrupamento = excluded.classificacao_agrupamento,
              num_doc_1 = excluded.num_doc_1,
              tipo_doc_pri = excluded.tipo_doc_pri,
              num_celular_2 = excluded.num_celular_2,
              num_celular = excluded.num_celular,
              num_comercial = excluded.num_comercial,
              num_recado = excluded.num_recado,
              num_residencial = excluded.num_residencial,
              dsc_email = excluded.dsc_email,
              dsc_email_2 = excluded.dsc_email_2,
              referencianota = excluded.referencianota,
              dat_venc = excluded.dat_venc,
              vlr_sc = excluded.vlr_sc,
              tributo = excluded.tributo,
              dias_vencido = excluded.dias_vencido,
              aging_nota = excluded.aging_nota,
              sub_categoria = excluded.sub_categoria,
              priorizar = excluded.priorizar,
              base_automatica = excluded.base_automatica,
              aging_referencia = excluded.aging_referencia,
              comportamento_arrecadado = excluded.comportamento_arrecadado,
              bairro = excluded.bairro,
              status = 'ativo',
              updated_at = CURRENT_TIMESTAMP;
          `;

        const queryDeactivate = `
            UPDATE ${table}
            SET status = 'inativo'
            WHERE des_contr NOT IN (SELECT des_contr FROM ${tableXlsx});
          `;

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
   * ENVIA OS DADOS DO SQLITE PARA O POSTGRES
   */
  public async syncToPostgres(sourceTable: string): Promise<void> {
    const tempTable = `base_externa.${sourceTable}_new`;
    const oldTable = `base_externa.${sourceTable}_old`;
    const originalTable = `base_externa.${sourceTable}`;

    console.log(`🚀 Iniciando sincronização para ${sourceTable}...`);

    const trx = await db.transaction(); // Iniciar transação para garantir atomicidade
    try {
      // 1️⃣ Verificar se a tabela original existe
      const tableExists = await trx.rawQuery(
        `SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'base_externa' AND tablename = '${sourceTable}');`
      );
      if (!tableExists.rows[0].exists) {
        throw new Error(`Tabela ${originalTable} não existe.`);
      }

      // 2️⃣ Criar a nova tabela baseada na original
      await trx.rawQuery(
        `CREATE TABLE ${tempTable} (LIKE ${originalTable} INCLUDING ALL);`
      );
      console.log(`✅ Criada tabela temporária ${tempTable}.`);

      // 3️⃣ Ler dados do SQLite em memória
      const rows = await new Promise<Dictionary<unknown, string>[]>(
        (resolve, reject) => {
          this.dbSqlite.all(`SELECT * FROM ${sourceTable}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows as Dictionary<unknown, string>[]);
            }
          });
        }
      );

      // 4️⃣ Inserir os dados na tabela temporária do PostgreSQL
      if (rows.length > 0) {
        await trx.table(tempTable).multiInsert(rows); // Inserir em lote
        console.log(
          `✅ Dados inseridos em ${tempTable}. Linhas afetadas: ${rows.length}.`
        );
      } else {
        console.log('ℹ️ Nenhum dado para inserir.');
      }

      console.log(`✅ Dados lidos do SQLite. Total de linhas: ${rows.length}.`);
      // 5️⃣ Inserir os dados na tabela temporária (bulk insert)
      const insertResult = await trx.rawQuery(`
          INSERT INTO ${tempTable}
          SELECT * FROM sqlite_memory.${sourceTable};
        `);
      console.log(
        `✅ Dados inseridos em ${tempTable}. Linhas afetadas: ${insertResult.rowCount}.`
      );

      // 6️⃣ Renomear a tabela original para `_old`
      await trx.rawQuery(`ALTER TABLE ${originalTable} RENAME TO ${oldTable};`);
      console.log(`🔄 Renomeado ${originalTable} para ${oldTable}.`);

      // 7️⃣ Renomear a nova tabela para o nome original
      await trx.rawQuery(
        `ALTER TABLE ${tempTable} RENAME TO ${originalTable};`
      );
      console.log(`🔄 Renomeado ${tempTable} para ${originalTable}.`);

      // 8️⃣ Dropar a tabela antiga
      await trx.rawQuery(`DROP TABLE IF EXISTS ${oldTable};`);
      console.log(`🗑️ Tabela ${oldTable} removida.`);

      await trx.commit();
      console.log(`🎉 Sincronização concluída com sucesso! 💋`);
    } catch (error) {
      await trx.rollback();
      console.error(`❌ Erro durante a sincronização:`, error);
      throw error; // Rejeitar a promise para que o chamador saiba que houve um erro
    }
  }
}
