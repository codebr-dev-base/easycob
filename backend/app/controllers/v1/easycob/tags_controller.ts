import type { HttpContext } from '@adonisjs/core/http';
import Tag from '#models/tag';
import {
  createTagValidator,
  updateTagValidator,
} from '#validators/tag_validator';
//import db from '@adonisjs/lucid/services/db';
import ClientService from '#services/client_service';
import Client from '#models/recovery/client';
import string from '@adonisjs/core/helpers/string';
import { inject } from '@adonisjs/core';

@inject()
export default class TagsController {
  constructor(protected clientService: ClientService) {}

  public async index() {
    const tags = await Tag.all();
    return tags;
  }

  public async show({ params }: HttpContext) {
    const { id } = params;
    const tag = await Tag.findOrFail(id);
    return tag;
  }

  public async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTagValidator);
    const tag = await Tag.create(payload);
    return response.created({
      success: true,
      data: tag,
    });
  }

  public async update({ params, request }: HttpContext) {
    const { id } = params;
    const tag = await Tag.findOrFail(id);
    const payload = await request.validateUsing(updateTagValidator);
    tag.merge(payload);
    await tag.save();
    return tag;
  }

  public async destroy({ params }: HttpContext) {
    const { id } = params;
    const tag = await Tag.findOrFail(id);
    await tag.delete();
    return tag;
  }

  public async clients({ request, auth }: HttpContext) {
    if (!auth || !auth.user || !auth.user.id) return;
    const userId = auth.user.id;
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = qs.orderBy || 'id';
    const descending = qs.descending || 'true';
    const tagId = qs.tagId || undefined;

    if (!tagId) {
      return {
        success: false,
        message: 'tagId is required',
      };
    }

    const tag = await Tag.findOrFail(tagId);

    const listOutColumn = ['phone', 'email', 'desContr'];

    let selected = null;
    if (listOutColumn.includes(qs.keywordColumn)) {
      selected = await this.clientService.generateWhereInPaginate(qs);
    }

    let keyword: string | undefined = undefined;
    let keywordColumn: string | undefined = undefined;
    if (qs.keyword && qs.keywordColumn) {
      keyword = qs.keyword;
      keywordColumn = string.snakeCase(qs.keywordColumn);
    }

    const clients = await Client.query()
      .select(
        'recupera.tbl_arquivos_clientes.id as id',
        'nom_clien',
        'des_cpf',
        'des_regis',
        'recupera.tbl_arquivos_clientes.cod_credor_des_regis as cod_credor_des_regis',
        'status',
        'is_fixa',
        'is_var'
      )
      .joinRaw(
        'INNER JOIN clients_tags_users as ctu  ON recupera.tbl_arquivos_clientes.cod_credor_des_regis = ctu.cod_credor_des_regis'
      )
      .where((q) => {
        q.where('ctu.user_id', userId);

        if (tagId) {
          q.where('ctu.tag_id', tagId);
        }

        if (selected) {
          q.whereIn(selected.column, selected.list);
        } else if (keyword && keyword.length > 3 && keywordColumn) {
          q.whereILike(keywordColumn, `%${keyword}%`);
        }

        if (qs.desRegis && qs.desRegis.length > 3) {
          q.where('des_regis', qs.desRegis);
        }

        if (qs.status) {
          if (qs.status !== 'null') {
            q.where('status', `${qs.status}`.toUpperCase());
          }
        }

        if (qs.isFixa && qs.isFixa === 'true') {
          q.where('is_fixa', true);
        }

        if (qs.isVar && qs.isVar === 'true') {
          q.where('is_var', true);
        }
      })
      .whereRaw(
        `ctu.updated_at >= NOW() - (${tag.validity} || ' days')::INTERVAL`
      )
      .preload('phones', (q) => {
        q.select('contato', 'percentual_atender').where(
          'tipo_contato',
          'TELEFONE'
        );
      })
      .preload('emails', (q) => {
        q.select('contato').where('tipo_contato', 'EMAIL');
      })
      .preload('contracts', (q) => {
        q.select('des_contr').where('status', 'ATIVO');
      })
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return clients;
  }
}
