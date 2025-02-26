import ExternalFile from '#models/external/external_file';
import ExternalFileService from '#services/external/external_file_service';
import { serializeKeysCamelCase } from '#utils/serialize';
import string from '@adonisjs/core/helpers/string';
import { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import { inject } from '@adonisjs/core';
import User from '#models/user';
import LoadXlsxExternal from '#jobs/load_xlsx_external';
import { promises as fs } from 'fs';

// import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class ExternalFilesController {
  constructor(protected service: ExternalFileService) {}

  public async index({ request }: HttpContext) {
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    let orderBy = 'ef.id';
    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        orderBy = `u.name`;
      } else {
        orderBy = `ef.${string.snakeCase(qs.orderBy)}`;
      }
    }
    const descending = qs.descending || 'true';

    const campaigns = await db
      .from('base_externa.external_files as ef')
      .select('ef.*')
      .select('u.name as user')
      .innerJoin('users as u', 'u.id', '=', 'ef.user_id')
      .where((q) => {
        return this.service.generateWherePaginate(q, qs);
      })
      .orderBy(`${orderBy}`, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return serializeKeysCamelCase(campaigns.toJSON());
  }

  public async create({ auth, request, response }: HttpContext) {
    const user: User = auth.user!;
    let newFileName: string | null = null;

    try {
      newFileName = await this.service.handlerFile(request);

      // Valida o arquivo XLSX e obtém as mensagens
      const validationResult = await this.service.validateXlsxAndGetMessages(
        this.service.getFilePath(newFileName),
        'base_externa',
        'tbl_base_dataset'
      );

      // Se houver erros de validação, retorna as mensagens
      if (!validationResult.success) {
        if (newFileName) {
          await fs.unlink(this.service.getFilePath(newFileName));
        }

        return response.status(400).send({
          error: 'Erros de validação encontrados:',
          details: validationResult.messages, // Concatena as mensagens em uma única string
        });
      }

      await this.service.checkColumns(newFileName);

      const externalFile = await ExternalFile.create({
        fileName: `${newFileName}`,
        filePath: this.service.getFilePath(newFileName),
        userId: user.id,
      });

      await LoadXlsxExternal.dispatch(
        {
          externalFile_id: externalFile.id,
          user_id: user.id,
        },
        {
          queueName: 'LoadXlsx',
        }
      );

      return externalFile;
    } catch (error) {
      if (newFileName) {
        await fs.unlink(this.service.getFilePath(newFileName));
      }

      if (error.code === 'E_INVALID_FILE_EXTENSION') {
        return response
          .status(400)
          .send({ error: 'Arquivo inválido. Deve ser um arquivo XLSX.' });
      }

      if (error.message) {
        return response.status(400).send({ error: error.message });
      }

      return response.badRequest({
        errors: error,
      });
    }
  }
}
