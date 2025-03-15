import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder';
import { Request } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import path from 'path';
import fs from 'fs';
import db from '@adonisjs/lucid/services/db';
import string from '@adonisjs/core/helpers/string';
import {
  extractTextInsideBrackets,
  removeAccentsAndSymbols,
} from '#utils/string';
import env from '#start/env';
import { exec } from 'child_process';

interface ColumnInfo {
  column_name: string;
  column_type: string;
  is_nullable: string;
}

interface ValidationResult {
  rowLabel: string;
  incompatibleColumns: {
    column: string;
    expectedType: string;
    actualValue: unknown;
    actualType: string;
  }[];
}

interface ColumnMapping {
  dbColumn: string;
  xlsxIndex: number | null;
  expectedType: string;
  isNullable: boolean;
}

export default class ExternalFileService {
  num_loja = 8;
  essentialColumns = [
    'emp_codigo',
    'chave_contrato',
    'num_ligacao',
    'seq_responsavel',
    'nom_cliente',
    'sit_lig',
    'ultimo_contrato',
    'sub_categoria',
    'comportamento_arrecadacao_6_m',
    //'status_adimplencia',
    'flag_grande_cliente',
    'maior_aging_vencimento',
    'data_ultimo_pagamento',
    'ref_nf',
    'dat_venc',
    'dias_venc',
    'num_nota',
    'vlr_sc',
    'tributo',
    'aging_vencimento',
    'tipo_doc_pri',
    'num_doc_1',
    'num_celular',
    'num_celular_2',
    'num_residencial',
    'num_comercial',
    'num_recado',
    'dsc_email',
    'dsc_email_2',
  ];

  /**
   * Recupera as colunas e tipos esperados do banco de dados.
   */
  private async getColumnsFromDatabase(
    schema: string,
    table: string
  ): Promise<ColumnInfo[]> {
    const sql = `
        SELECT column_name, data_type as column_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = '${schema}' AND table_name = '${table}';
      `;

    const result = await db.rawQuery(sql);
    if (!result || !result.rows.length) {
      throw new Error(`❌ Nenhuma coluna encontrada para ${schema}.${table}`);
    }
    // Remover colunas desnecessárias
    // Filtrar colunas desnecessárias e manter apenas as que estão em essentialColumns
    return result.rows.filter(
      (row: ColumnInfo) =>
        this.essentialColumns.includes(row.column_name) && // Mantém apenas colunas essenciais
        row.column_name !== 'id' && // Remove colunas específicas
        row.column_name !== 'updated_at' &&
        row.column_name !== 'des_contr' &&
        row.column_name !== 'status'
    );
  }

  /**
   * Valida os tipos de dados de uma linha específica.
   */
  private validateRowTypes(
    row: unknown[],
    columnMapping: ColumnMapping[],
    rowLabel: string
  ): ValidationResult {
    const incompatibleColumns: {
      column: string;
      expectedType: string;
      actualValue: unknown;
      actualType: string;
    }[] = [];

    columnMapping.forEach((column) => {
      if (column.xlsxIndex === null) {
        // Coluna do banco de dados não existe no XLSX
        incompatibleColumns.push({
          column: column.dbColumn,
          expectedType: column.expectedType,
          actualValue: null,
          actualType: 'undefined',
        });
      } else {
        const cellValue = row[column.xlsxIndex];
        const actualType = typeof cellValue;

        // Verifica se o valor é nulo ou indefinido e se a coluna permite valores nulos
        if (
          (cellValue === null || cellValue === undefined || cellValue === '') &&
          column.isNullable
        ) {
          // Valor nulo ou indefinido é permitido para colunas não obrigatórias
          return;
        }

        // Converte o valor para o tipo esperado
        const convertedValue = this.convertValue(
          cellValue,
          column.expectedType
        );

        // Verifica se o tipo do valor é compatível com o tipo esperado
        if (!this.isTypeCompatible(column.expectedType, convertedValue)) {
          incompatibleColumns.push({
            column: column.dbColumn,
            expectedType: column.expectedType,
            actualValue: cellValue,
            actualType,
          });
        }
      }
    });

    return {
      rowLabel,
      incompatibleColumns,
    };
  }

  /**
   * Verifica se o valor é compatível com o tipo esperado.
   */
  private isTypeCompatible(expectedType: string, value: unknown): boolean {
    if (value === null || value === undefined) {
      return false; // Valores nulos devem ser tratados separadamente
    }

    switch (expectedType.toLowerCase()) {
      case 'integer':
      case 'int':
      case 'smallint':
      case 'bigint':
        return Number.isInteger(Number(value));
      case 'numeric':
      case 'decimal':
      case 'real':
      case 'double precision':
        return typeof value === 'number' || !isNaN(Number(value));
      case 'boolean':
        return (
          typeof value === 'boolean' ||
          value === 'true' ||
          value === 'false' ||
          value === '1' ||
          value === '0'
        );
      case 'date':
      case 'timestamp':
      case 'timestamptz':
        return !isNaN(new Date(value as string).getTime());
      case 'text':
      case 'varchar':
      case 'char':
      default:
        return typeof value === 'string';
    }
  }

  /**
   * Converte o valor para o tipo esperado.
   */
  private convertValue(value: unknown, expectedType: string): unknown {
    if (value === null || value === undefined) {
      return null;
    }

    switch (expectedType.toLowerCase()) {
      case 'integer':
      case 'int':
      case 'smallint':
      case 'bigint':
        return parseInt(String(value), 10);
      case 'numeric':
      case 'decimal':
      case 'real':
      case 'double precision':
        return parseFloat(String(value));
      case 'boolean':
        return (
          value === 'true' || value === '1' || value === 'sim' || value === true
        );
      case 'date':
      case 'timestamp':
      case 'timestamptz':
        return new Date(value as string);
      case 'text':
      case 'varchar':
      case 'char':
      default:
        return String(value);
    }
  }

  /**
   * Corrige o cabeçalho da tabela no arquivo XLSX.
   */
  public fixTableHeader(linha: string[]): string[] {
    // Modifica os valores da primeira linha
    return linha.map((value) => {
      // Exemplo de correção: converte todas as células para maiúsculas
      if (value && typeof value === 'string') {
        let v = extractTextInsideBrackets(value);
        v = removeAccentsAndSymbols(v);
        return string.snakeCase(v).toLowerCase().trim();
      } else {
        throw new Error(`❌ A coluna ${value} deve ser uma string.`);
      }
    });
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

  public getOutputDir(filePath: string): string {
    // Obtém o diretório do arquivo
    const dir = path.dirname(filePath);

    // Obtém o nome do arquivo sem a extensão
    const fileName = path.basename(filePath, '.xlsx');

    // Combina o diretório e o nome do arquivo para formar o caminho da pasta
    return path.join(dir, fileName);
  }

  public getRecords(outputDir: string): {
    firstRecord: undefined;
    lastRecord: undefined;
    middleRecord: undefined;
    randomRecord: undefined;
  } {
    // Filtra apenas os arquivos JSON e ordena
    const jsonFiles = this.sortFiles(this.findJsonFiles(outputDir));

    if (jsonFiles.length === 0) {
      throw new Error('Nenhum arquivo JSON encontrado.');
    }

    // 1. Primeiro registro do primeiro arquivo
    const firstFileData = fs.readFileSync(jsonFiles[0], 'utf-8');
    const firstFileRecords = JSON.parse(firstFileData);
    const firstRecord = firstFileRecords[0];

    // 2. Último registro do último arquivo
    const lastFileData = fs.readFileSync(
      jsonFiles[jsonFiles.length - 1],
      'utf-8'
    );
    const lastFileRecords = JSON.parse(lastFileData);
    const lastRecord = lastFileRecords[lastFileRecords.length - 1];

    // 3. Registro mais próximo do meio do arquivo do meio
    const middleFileIndex = Math.floor(jsonFiles.length / 2);
    const middleFileData = fs.readFileSync(jsonFiles[middleFileIndex], 'utf-8');
    const middleFileRecords = JSON.parse(middleFileData);
    const middleRecordIndex = Math.floor(middleFileRecords.length / 2);
    const middleRecord = middleFileRecords[middleRecordIndex];

    // 4. Um registro aleatório de um arquivo aleatório
    const randomFileIndex = this.getRandomInt(0, jsonFiles.length - 1);
    const randomFileData = fs.readFileSync(jsonFiles[randomFileIndex], 'utf-8');
    const randomFileRecords = JSON.parse(randomFileData);
    const randomRecordIndex = this.getRandomInt(
      0,
      randomFileRecords.length - 1
    );
    const randomRecord = randomFileRecords[randomRecordIndex];

    return {
      firstRecord,
      lastRecord,
      middleRecord,
      randomRecord,
    };
  }

  public sortFiles(files: string[]): string[] {
    return files.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  }

  public getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Função para obter os nomes dos campos de um registro
  public getFieldNames(record: Record<string, unknown>): string[] {
    if (!record || typeof record !== 'object') {
      throw new Error('Registro inválido.');
    }
    return Object.keys(record);
  }

  public async validateXlsxTypes(
    filePath: string,
    schema: string,
    table: string
  ): Promise<ValidationResult[]> {
    await new Promise((resolve, reject) => {
      // Monta o comando

      const command = env.get('XLSX_TO_JSON') ? env.get('XLSX_TO_JSON') : '';
      const columnMapping = env.get('COLUMN_MAPPING')
        ? env.get('COLUMN_MAPPING')
        : '';
      if (!command || !columnMapping) {
        reject('O comando XLSX_TO_JSON não está definido.');
        return;
      }
      console.log(`${command} ${filePath} ${columnMapping}`);
      // Executa o comando
      exec(
        `${command} ${filePath} ${columnMapping}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Erro ao executar o programa Rust: ${stderr}`);
            reject(stderr);
          } else {
            console.log(`Saída do programa Rust: ${stdout}`);
            resolve(stdout);
          }
        }
      );
    });
    console.log('🟢 Fim da partição do arquivo');

    const outputDir = this.getOutputDir(filePath);

    const { firstRecord, lastRecord, middleRecord, randomRecord } =
      this.getRecords(outputDir);

    if (!firstRecord || !lastRecord || !middleRecord || !randomRecord) {
      throw new Error('Não foi possível obter os registros.');
    }

    // Recupera as colunas presentes no primeiro registro
    const presentColumns = this.getFieldNames(
      firstRecord as Record<string, unknown>
    );

    // Recupera as colunas e tipos esperados do banco de dados
    const dbColumns = await this.getColumnsFromDatabase(schema, table);

    // Mapeia as colunas do XLSX com as colunas do banco de dados
    const columnMapping = dbColumns.map((dbColumn) => {
      const xlsxIndex = presentColumns.indexOf(dbColumn.column_name);
      return {
        dbColumn: dbColumn.column_name,
        xlsxIndex: xlsxIndex !== -1 ? xlsxIndex : null, // null se a coluna não existir no XLSX
        expectedType: dbColumn.column_type,
        isNullable: dbColumn.is_nullable === 'YES', // 'YES' se a coluna permitir valores nulos
      };
    });

    const results: ValidationResult[] = [];
    results.push(
      this.validateRowTypes(firstRecord, columnMapping, 'Primeira linha')
    );
    results.push(
      this.validateRowTypes(lastRecord, columnMapping, 'Ultima linha')
    );
    results.push(
      this.validateRowTypes(middleRecord, columnMapping, 'linha do meio')
    );
    results.push(
      this.validateRowTypes(randomRecord, columnMapping, 'linha aleatoria')
    );
    return results;
  }

  public async validateXlsxAndGetMessages(
    filePath: string,
    schema: string,
    table: string
  ): Promise<{ success: boolean; messages: string[] }> {
    const results = await this.validateXlsxTypes(filePath, schema, table);

    const messages: string[] = [];

    results.forEach((result) => {
      if (result.incompatibleColumns.length > 0) {
        messages.push(`🔍 ${result.rowLabel}:`);
        result.incompatibleColumns.forEach((column) => {
          messages.push(
            `- Coluna: ${column.column} | Esperado: ${column.expectedType} | Valor: ${column.actualValue} (Tipo: ${column.actualType})`
          );
        });
      } else {
        messages.push(
          `✅ ${result.rowLabel}: Todos os campos estão compatíveis.`
        );
      }
    });

    const hasErrors = results.some(
      (result) => result.incompatibleColumns.length > 0
    );
    return {
      success: !hasErrors,
      messages, // Retorna as mensagens como um array
    };
  }

  generateWherePaginate(
    q: DatabaseQueryBuilderContract<unknown>,
    qs: {
      keywordColumn?: string;
      keyword?: string;
      startDate?: string;
      endDate?: string;
    }
  ) {
    if (qs.keywordColumn === 'name' && qs.keyword) {
      q.whereILike('ef.name', `%${qs.keyword}%`);
    }

    if (qs.startDate && qs.endDate) {
      q.whereBetween('ef.updated_at', [qs.startDate, qs.endDate]);
    }

    return q;
  }

  async handlerFile(request: Request): Promise<string> {
    const file = request.file('file', {
      extnames: ['xlsx'],
    });

    if (file && !file.isValid) {
      throw file.errors;
    } else if (!file) {
      throw [
        {
          fieldName: 'Not file',
          clientName: 'Not Client',
          message: 'File is not present',
          type: 'size',
        },
      ];
    }

    const dateTime = new Date().getTime();
    const newFileName = `${dateTime}.${file.extname}`;
    const nodeEnv = env.get('NODE_ENV') ? env.get('NODE_ENV') : 'production';
    let destinationPath = app.makePath('../uploads/xlsx');
    if (nodeEnv === 'development') {
      destinationPath = app.makePath('uploads/xlsx');
    }
    const fullPath = path.join(destinationPath, newFileName);

    // Tentar mover o arquivo uma vez
    try {
      await file.move(destinationPath, { name: newFileName });
    } catch (error) {
      throw new Error(`File could not be moved: ${error.message}`);
    }

    // Verificar se o arquivo foi salvo corretamente
    try {
      await fs.promises.access(fullPath);
    } catch (error) {
      // Se o arquivo não for encontrado, tentar mover novamente
      try {
        await file.move(destinationPath, { name: newFileName });
      } catch (secondError) {
        throw new Error(
          `Second attempt to move file failed: ${secondError.message}`
        );
      }
    }

    return newFileName;
  }

  getFilePath(fileName: string) {
    let filePath = `${app.makePath('../uploads')}/xlsx/${fileName}`;
    const nodeEnv = env.get('NODE_ENV') ? env.get('NODE_ENV') : 'production';
    if (nodeEnv === 'development') {
      filePath = `${app.makePath('uploads')}/xlsx/${fileName}`;
    }
    return filePath;
  }

  async checkColumns(fileName: string) {
    const filePath = this.getFilePath(fileName);
    const outputDir = this.getOutputDir(filePath);

    const { firstRecord } = this.getRecords(outputDir);

    // Recupera as colunas presentes no primeiro registro
    // colunas presentes no primeiro registro
    if (firstRecord === undefined) {
      throw new Error('Não foi possível recuperar o primeiro registro');
    }
    if (typeof firstRecord !== 'object') {
      throw new Error('Registro inválido.');
    }
    if (firstRecord === null) {
      throw new Error('Registro inválido.');
    }

    const presentColumns = this.getFieldNames(
      firstRecord as Record<string, unknown>
    );

    // Verifica se todas as colunas essenciais estão presentes
    const missingColumns = this.essentialColumns.filter(
      (col) => !presentColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      throw new Error(`Missing columns: ${missingColumns.join(', ')} `);
    }

    // Recupera as colunas extras
    const extraColumns = presentColumns.filter(
      (col) =>
        typeof col === 'string' && !this.essentialColumns.includes(`${col}`)
    );

    if (extraColumns.length > 0) {
      this.addExtraColumns(extraColumns);
    }
  }

  private async addExtraColumns(colunas: string[]) {
    if (colunas.length > 0) {
      const colunasExistentes = await this.getExistingColumns();
      const colunasNovas = colunas.filter(
        (coluna) => !colunasExistentes.includes(`${coluna}`)
      );

      if (colunasNovas.length > 0) {
        if (colunasNovas.length > 0) {
          const queries = colunasNovas.map((coluna) => {
            return `ALTER TABLE base_externa.tbl_base_dataset ADD COLUMN ${coluna} VARCHAR(255) NULL`;
          });

          for (const query of queries) {
            await db.rawQuery(query);
          }
        }
      }
    }
  }

  private async getExistingColumns(): Promise<string[]> {
    const sql = fs.readFileSync(
      'app/sql/external/col_base_clientes.sql',
      'utf8'
    );
    const colunas = await db.rawQuery(sql);

    if (!colunas || !colunas.rows || colunas.rows.length === 0) {
      throw new Error(
        'Não foi possível obter as colunas da tabela tbl_base_dataset.'
      );
    }

    return colunas.rows.map(
      (coluna: { column_name: string }) => coluna.column_name
    );
  }
}
