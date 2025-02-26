import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder';
import { Request } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import path from 'path';
import fs from 'fs';
import ExcelJS, { CellValue } from 'exceljs';
import db from '@adonisjs/lucid/services/db';
import string from '@adonisjs/core/helpers/string';

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
    return result.rows.filter(
      (row: ColumnInfo) =>
        row.column_name !== 'id' &&
        row.column_name !== 'updated_at' &&
        row.column_name !== 'des_contr' &&
        row.column_name !== 'status'
    );
  }

  /**
   * Verifica se o valor é compatível com o tipo esperado.
   */
  private isTypeCompatible(expectedType: string, value: unknown): boolean {
    // Se o valor for nulo ou indefinido, é considerado compatível (a validação de nulidade é feita antes)
    if (value === null || value === undefined) {
      return true;
    }

    switch (expectedType) {
      case 'integer':
      case 'bigint':
        // Se o valor for uma string, tenta converter para número
        if (typeof value === 'string') {
          // Verifica se a string representa um número inteiro válido
          if (!/^\d+$/.test(value)) {
            return false; // Não é um número inteiro válido
          }
          // Tenta converter para BigInt
          try {
            BigInt(value); // Tenta criar um BigInt
            return true; // Conversão bem-sucedida
          } catch {
            return false; // Falha na conversão
          }
        }
        // Se o valor já for um número, verifica se é inteiro
        return typeof value === 'number' && Number.isInteger(value);

      case 'numeric':
      case 'real':
      case 'double precision':
        return typeof value === 'number';

      case 'character varying':
      case 'text':
        // Aceita strings, números ou valores nulos/indefinidos
        return typeof value === 'string' || typeof value === 'number';

      case 'boolean':
        return typeof value === 'boolean';

      case 'date':
      case 'timestamp':
        return value instanceof Date;

      default:
        return true; // Ignora tipos não mapeados
    }
  }

  /**
   * Valida os tipos de dados de uma linha específica.
   */
  private validateRowTypes(
    row: unknown[],
    columnMapping: {
      dbColumn: string;
      xlsxIndex: number | null;
      expectedType: string;
      isNullable: boolean;
    }[],
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
          (cellValue === null || cellValue === undefined) &&
          column.isNullable
        ) {
          // Valor nulo ou indefinido é permitido para colunas não obrigatórias
          return;
        }

        // Verifica se o tipo do valor é compatível com o tipo esperado
        if (!this.isTypeCompatible(column.expectedType, cellValue)) {
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
   * Lê o arquivo XLSX e valida os tipos de dados das colunas.
   */
  public async validateXlsxTypes(
    filePath: string,
    schema: string,
    table: string
  ): Promise<ValidationResult[]> {
    // Recupera as colunas e tipos esperados do banco de dados
    const dbColumns = await this.getColumnsFromDatabase(schema, table);

    // Carrega o arquivo XLSX
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Assume que a primeira planilha é a correta
    const worksheet = workbook.worksheets[0];

    // Obtém todas as linhas do arquivo XLSX
    const rows = worksheet.getSheetValues() as unknown[][];

    // Extrai os nomes das colunas da primeira linha (cabeçalho)
    const firstRow = rows[1]; // Primeira linha (cabeçalho)

    // Verifica se a primeira linha existe
    if (!firstRow || !Array.isArray(firstRow)) {
      throw new Error(
        '❌ A primeira linha do arquivo XLSX está vazia ou mal formatada.'
      );
    }

    const presentColumns = firstRow.map(
      (cell) => cell && string.snakeCase(cell.toString()).toLowerCase().trim()
    );

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

    // Seleciona as 4 linhas para teste (ignorando a primeira linha de cabeçalho)
    const secondRow = rows[2]; // Segunda linha (primeira linha válida de dados)
    const lastRow = rows[rows.length - 2]; // Última linha
    const middleRow = rows[Math.floor((rows.length - 1) / 2) + 1]; // Linha mais próxima do meio
    const randomRow = rows[Math.floor(Math.random() * (rows.length - 2)) + 2]; // Linha aleatória

    // Valida os tipos das colunas para cada linha selecionada
    const results: ValidationResult[] = [];
    results.push(
      this.validateRowTypes(
        secondRow as unknown[],
        columnMapping,
        'Segunda linha'
      )
    );
    results.push(
      this.validateRowTypes(lastRow as unknown[], columnMapping, 'Última linha')
    );
    results.push(
      this.validateRowTypes(
        middleRow as unknown[],
        columnMapping,
        'Linha do meio'
      )
    );
    results.push(
      this.validateRowTypes(
        randomRow as unknown[],
        columnMapping,
        'Linha aleatória'
      )
    );

    // Retorna todos os resultados de validação
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
    const destinationPath = app.makePath('uploads/xlsx');
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
    const filePath = `${app.makePath('uploads')}/xlsx/${fileName}`;
    return filePath;
  }

  async checkColumns(fileName: string) {
    const filePath = this.getFilePath(fileName);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('Worksheet not found');
    }
    const firstRow = worksheet.getRow(1);

    if (!firstRow) {
      throw new Error('First row not found');
    }

    const presentColumns =
      firstRow.values && Array.isArray(firstRow.values)
        ? firstRow.values.map(
            (cell) =>
              cell && string.snakeCase(cell.toString()).toLowerCase().trim()
          )
        : [];

    const missingColumns = this.essentialColumns.filter(
      (col) => !presentColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      throw new Error(`Missing columns: ${missingColumns.join(', ')} `);
    }

    const extraColumns = presentColumns.filter(
      (col) =>
        typeof col === 'string' && !this.essentialColumns.includes(`${col}`)
    );

    if (extraColumns.length > 0) {
      this.addExtraColumns(extraColumns);
    }
  }

  private async addExtraColumns(colunas: CellValue[]) {
    if (colunas.length > 0) {
      const colunasExistentes = await this.getExistingColumns();
      const colunasNovas = colunas.filter(
        (coluna) => !colunasExistentes.includes(`${coluna}`)
      );

      if (colunasNovas.length > 0) {
        if (colunasNovas.length > 0) {
          const queries = colunasNovas.map((coluna) => {
            return `ALTER TABLE tbl_base_cliente ADD COLUMN \`${coluna}\` VARCHAR(255) NULL`;
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
