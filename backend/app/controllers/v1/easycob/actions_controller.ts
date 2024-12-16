/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import Action from '#models/action';
import ActionService from '#services/action_service';
import { createActionValidator } from '#validators/action_validator';
import User from '#models/user';
import db from '@adonisjs/lucid/services/db';
import fs from 'fs';
import TypeAction from '#models/type_action';
import { dispatchToRecupera } from '#services/utils/recupera';
import { serializeKeysCamelCase } from '#utils/serialize';
import string from '@adonisjs/core/helpers/string';
import { generateColorClasses } from '#utils/colors';
import ActionExternal from '#models/action_external';
import SendMailExternalJob, {
  IActionExternal,
} from '#jobs/send_mail_external_job';

@inject()
export default class ActionsController {
  constructor(protected service: ActionService) {}

  async index({ request }: HttpContext) {
    const qs = request.qs();
    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    let orderBy = 'a.id';
    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        orderBy = `u.name`;
      } else if (qs.orderBy === 'cliente') {
        orderBy = `cls.nom_clien`;
      } else if (qs.orderBy === 'typeAction') {
        orderBy = `ta.name`;
      } else {
        orderBy = `a.${string.snakeCase(qs.orderBy)}`;
      }
    }
    const descending = qs.descending || 'true';

    const selected = await this.service.generateWhereInPaginate(qs);
    const actions = await db
      .from('public.actions AS a')
      .joinRaw(
        'LEFT JOIN recupera.tbl_arquivos_clientes AS cls ON a.cod_credor_des_regis = cls.cod_credor_des_regis'
      )
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id')
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      )
      .select(
        'a.id',
        'a.retorno',
        'a.unification_check',
        'a.retornotexto',
        'a.created_at',
        'a.day_late',
        'a.val_princ',
        'a.pecld',
        'cls.nom_clien AS cliente',
        'u.name AS user',
        'ta.name As type_action'
      )
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list);
        }

        if (qs.wallet) {
          q.whereIn('wallet', qs.wallet);
        }

        return this.service.generateWherePaginate(q, qs);
      })
      .orderBy(`${orderBy}`, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return serializeKeysCamelCase(actions.toJSON());
  }

  public async byClient({ params }: HttpContext) {
    const { codCredorDesRegis } = params;

    const actions = await Action.query()
      .where((q) => {
        if (codCredorDesRegis) {
          q.where('cod_credor_des_regis', `${codCredorDesRegis}`);
        }
      })
      .preload('typeAction')
      .preload('promises')
      .preload('negotiations', (negotiationQuery) => {
        negotiationQuery.preload('invoices');
      })
      .preload('user')
      .orderBy('created_at', 'desc')
      .limit(10);

    return actions;
  }

  public async create({ auth, request, response }: HttpContext) {
    const user: User = auth.user!;
    try {
      const data = request.all();

      const payload = await request.validateUsing(createActionValidator);

      if (user.id) {
        if (await this.service.checkDuplicate(data)) {
          if (await this.service.checkExisteContract(payload.desContr)) {
            const aggregation = await this.service.getAggregationContract(
              payload.desContr
            );

            const action = await Action.create({
              ...aggregation,
              ...payload,
              userId: user.id,
            });

            return this.service.afterCreate(action, data);
          } else {
            return response.badRequest({
              success: false,
              message: 'Contrato Inativo',
              error: 'Contrato Inativo',
              data,
            });
          }
        } else {
          return response.badRequest({
            success: false,
            message: 'Acionamento duplicado',
            error: 'Acionamento duplicado',
            data: { ...data, double: true },
          });
        }
      } else {
        return response.badRequest({
          success: false,
          data,
          message: 'Usuario não existe',
          error: 'Usuario não existe',
        });
      }
    } catch (error) {
      return response.badRequest({
        success: false,
        data: request.all(),
        message: 'Usuario não existe',
        error: 'Usuario não existe',
      });
    }
  }

  public async send({ params }: HttpContext) {
    try {
      const { id } = params;
      const action = await Action.find(id);
      if (action) {
        await dispatchToRecupera(action);
        return true;
      }
    } catch (error) {
      return error;
    }
  }

  public async getReturnTypeSync() {
    const sql = fs.readFileSync(
      'app/sql/action/get_return_type_sync.sql',
      'utf8'
    );
    const results = await db.rawQuery(sql);

    return results.rows;
  }

  public async setUnificationCheck({ params, response }: HttpContext) {
    try {
      const { id } = params;
      const action = await Action.findOrFail(id);
      action.unificationCheck = !action.unificationCheck;
      action.save();
      return action;
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }

  public async getTypeAction() {
    const typeActions = TypeAction.query().orderBy('name');
    return typeActions;
  }

  async categorizeByTypeAction({ request }: HttpContext) {
    const qs = request.qs();
    const selected = await this.service.generateWhereInPaginate(qs);

    const actionsByType = await db
      .from('public.actions AS a')
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      )
      .select('ta.name AS type_action')
      .select('ta.abbreviation AS abbreviation')
      .count('a.id AS total')
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list);
        }
        return this.service.generateWherePaginate(q, qs);
      })
      .whereNotIn('ta.abbreviation', ['EME', 'SMS']) // Excluindo 'EME' e 'SMS'
      .groupBy(['ta.name', 'ta.abbreviation'])
      .orderBy('total', 'desc') // Ordena pelo total de forma decrescente
      .limit(10); // Limita a 5 registros

    const colors = generateColorClasses(); // Gera as 5 variações de cor

    // Ordena os resultados pela quantidade para aplicar as cores corretamente
    const sortedActions = actionsByType.sort(
      (a, b) => Number(b.total) - Number(a.total)
    );

    // Geração do chartData
    const chartData = sortedActions.map((action, index) => ({
      name: action.type_action || 'Unknown', // Garante que existe um tipo ou um 'Unknown'
      abbreviation: action.abbreviation,
      commissioned: action.commissioned,
      total: Number(action.total),
      fill: colors[index % colors.length], // Aplica a cor da mais forte à mais fraca
    }));

    // Geração do chartConfig
    const chartConfig = sortedActions.reduce(
      (config, action, index) => {
        const typeAction = action.type_action
          ? action.type_action.toLowerCase()
          : 'unknown';
        config[typeAction] = {
          label: action.type_action || 'Unknown', // Garante que existe um tipo ou um 'Unknown'
          color: colors[index % colors.length],
        };
        return config;
      },
      {
        total: { label: 'Total' },
      }
    );

    return {
      chartData,
      chartConfig,
    };
  }

  async categorizeByUser({ request }: HttpContext) {
    const qs = request.qs();

    // Gera o where com paginação, caso seja necessário
    const selected = await this.service.generateWhereInPaginate(qs);

    // Consulta ao banco de dados para agrupar por usuários e contar acionamentos, excluindo SMS e EME
    const actionsByUser = await db
      .from('public.actions AS a')
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id') // Relacionando ações com usuários
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      ) // Relacionando com os tipos de ações
      .select('u.name AS user_name') // Seleciona o nome do usuário
      .count('a.id AS total') // Conta o número total de acionamentos por usuário
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list); // Filtros dinâmicos, se houver
        }
        return this.service.generateWherePaginate(q, qs); // Gerar o paginate dinamicamente
      })
      .whereNotIn('ta.abbreviation', ['EME', 'SMS']) // Excluindo os tipos de ação 'EME' e 'SMS'
      .groupBy('u.name') // Agrupa pelos usuários
      .orderBy('total', 'desc') // Ordena pelo total de acionamentos de forma decrescente
      .limit(10); // Limita a 5 registros

    const colors = generateColorClasses(); // Gera as cores para a visualização

    // Ordena os resultados pela quantidade de acionamentos
    const sortedActions = actionsByUser.sort(
      (a, b) => Number(b.total) - Number(a.total)
    );

    // Geração do chartData com a classificação por usuário
    const chartData = sortedActions.map((action, index) => ({
      name: action.user_name || 'Unknown', // Garante que existe um nome de usuário ou 'Unknown'
      total: Number(action.total),
      fill: colors[index % colors.length], // Aplica as cores ciclicamente
    }));

    // Geração do chartConfig
    const chartConfig = sortedActions.reduce(
      (config, action, index) => {
        const userName = action.user_name
          ? action.user_name.toLowerCase().replace(/\s+/g, '_') // Gera uma chave válida
          : 'unknown';
        config[userName] = {
          label: action.user_name || 'Unknown', // Nome do usuário para o gráfico
          color: colors[index % colors.length], // Cor correspondente
        };
        return config;
      },
      {
        total: { label: 'Total' }, // Configuração base para o total
      }
    );

    return {
      chartData,
      chartConfig,
    };
  }

  async chartByUserAndTypeAction({ request }: HttpContext) {
    const qs = request.qs();

    // Gera o where com paginação, caso seja necessário
    const selected = await this.service.generateWhereInPaginate(qs);

    // Obtenção dos usuários e seus acionamentos
    const userActions = await db
      .from('public.actions AS a')
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      ) // Relacionando ações com tipos
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id') // Relacionando ações com usuários
      .select('u.name AS user_name') // Seleciona o nome do usuário
      .select('a.user_id') // Seleciona o ID do usuário
      .select('ta.abbreviation AS type_action') // Seleciona o tipo de acionamento
      .count('a.id AS total') // Conta o total de acionamentos por tipo
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list); // Filtros dinâmicos, se houver
        }
        return this.service.generateWherePaginate(q, qs); // Gerar o paginate dinamicamente
      })
      .whereNotIn('ta.abbreviation', ['SMS', 'EME']) // Excluir acionamentos de SMS e EME
      .groupBy(['a.user_id', 'u.name', 'ta.abbreviation']) // Agrupa por usuário, nome do usuário, e tipo de acionamento
      .orderBy('total', 'desc'); // Ordena pelo total de acionamentos

    // Gera os dados para o chartData
    const chartData: Record<string, any>[] = [];
    const chartConfig: Record<string, any> = {};
    const colors = generateColorClasses(); // Usa a função de cores

    // Estruturação dos dados e config por acionamento
    userActions.forEach((action, index) => {
      const typeAction = action.type_action.toLowerCase();

      // Verifica se o usuário já está no chartData
      const existingUser = chartData.find(
        (data) => data.userId === action.user_id
      );

      if (existingUser) {
        existingUser[typeAction] = Number(action.total); // Acrescenta o total para o tipo de acionamento existente
        existingUser.total += Number(action.total); // Atualiza o total geral de acionamentos
      } else {
        chartData.push({
          userId: action.user_id,
          name: action.user_name, // Inclui o nome do usuário
          total: Number(action.total), // Inicia o total geral de acionamentos
          [typeAction]: Number(action.total), // Inicia o total para o tipo de acionamento
        });
      }

      // Adiciona ao chartConfig
      if (!chartConfig[typeAction]) {
        chartConfig[typeAction] = {
          label: action.type_action || 'Unknown', // Usar 'Unknown' se não houver type_action
          color: colors[index % colors.length], // Atribuir cores sequencialmente
        };
      }
    });

    // Ordena o chartData pelo total de acionamentos de cada usuário
    chartData.sort((a, b) => b.total - a.total);

    // Limita o chartData a 10 linhas
    const limitedChartData = chartData.slice(0, 10);

    return {
      chartData: limitedChartData,
      chartConfig,
    };
  }

  async categorizeByUserAndCpc({ request }: HttpContext) {
    const qs = request.qs();

    // Gera o where com paginação, caso seja necessário
    const selected = await this.service.generateWhereInPaginate(qs);

    // Consulta ao banco de dados para agrupar por usuários e contar acionamentos separados por CPC e NCPC
    const actionsByUser = await db
      .from('public.actions AS a')
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id') // Relacionando ações com usuários
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      ) // Relacionando com os tipos de ações
      .joinRaw(
        'LEFT JOIN recupera.tbl_arquivos_cliente_numero n ON a.cod_credor_des_regis = n.cod_credor_des_regis AND a.contato = n.contato'
      ) // Relaciona para verificar se é CPC ou NCPC
      .select('u.name AS user_name') // Seleciona o nome do usuário
      .count('a.id AS total') // Conta o número total de acionamentos por usuário
      .count({ CPC: db.raw('CASE WHEN n.cpc = true THEN a.id END') }) // Contagem de CPC
      .count({ NCPC: db.raw('CASE WHEN n.cpc = false THEN a.id END') }) // Contagem de NCPC
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list); // Filtros dinâmicos, se houver
        }
        return this.service.generateWherePaginate(q, qs); // Gerar o paginate dinamicamente
      })
      .whereNotIn('ta.abbreviation', ['EME', 'SMS']) // Excluindo os tipos de ação 'EME' e 'SMS'
      .groupBy('u.name') // Agrupa pelos usuários
      .orderBy('total', 'desc') // Ordena pelo total de acionamentos de forma decrescente
      .limit(10); // Limita a 10 registros

    // Ordena os resultados pela quantidade total de acionamentos
    const sortedActions = actionsByUser.sort(
      (a, b) => Number(b.total) - Number(a.total)
    );

    // Geração do chartData com a classificação por usuário
    const chartData = sortedActions.map((action) => ({
      name: action.user_name || 'Unknown', // Garante que existe um nome de usuário ou 'Unknown'
      total: Number(action.total),
      CPC: Number(action.CPC) || 0,
      NCPC: Number(action.NCPC) || 0,
    }));

    // Geração do chartConfig para personalizar as cores e rótulos
    const chartConfig = sortedActions.reduce(
      (config, action) => {
        const userName = action.user_name
          ? action.user_name.toLowerCase().replace(/\s+/g, '_') // Gera uma chave válida
          : 'unknown';
        config[userName] = {
          label: action.user_name || 'Unknown', // Nome do usuário para o gráfico
        };
        return config;
      },
      {
        total: { label: 'Total' }, // Configuração base para o total
        CPC: { label: 'CPC' },
        NCPC: { label: 'NCPC' },
      }
    );

    return {
      chartData,
      chartConfig,
    };
  }

  async listByUserAndTypeAction({ request }: HttpContext) {
    const qs = request.qs();

    let orderBy = 'u.id';
    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        orderBy = `u.name`;
      } else if (qs.orderBy === 'id') {
        orderBy = `u.id`;
      } else if (qs.orderBy === 'typeAction') {
        orderBy = `ta.name`;
      } else {
        orderBy = `a.${string.snakeCase(qs.orderBy)}`;
      }
    }
    const descending = qs.descending || 'true';

    // Gera o where com paginação, caso seja necessário
    const selected = await this.service.generateWhereInPaginate(qs);

    // Obtenção dos usuários e seus acionamentos
    const userActions = await db
      .from('public.actions AS a')
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      ) // Relacionando ações com tipos
      .joinRaw(
        'LEFT JOIN recupera.tbl_arquivos_cliente_numero n ON a.cod_credor_des_regis = n.cod_credor_des_regis AND a.contato = n.contato'
      ) // Relaciona para verificar se é CPC ou NCPC
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id') // Relacionando ações com usuários
      .select('u.name AS userName') // Seleciona o nome do usuário
      .select('a.user_id as id') // Seleciona o ID do usuário
      .select('ta.id AS typeActionId') // Seleciona o tipo de acionamento
      .select('ta.abbreviation AS abbreviation') // Seleciona o tipo de acionamento
      .select('ta.name AS name') // Seleciona o tipo de acionamento
      .select('ta.commissioned AS commissioned')
      .count('a.id AS quant') // Conta o total de acionamentos por tipo
      .count({ CPC: db.raw('CASE WHEN n.cpc = true THEN a.id END') }) // Contagem de CPC
      .count({ NCPC: db.raw('CASE WHEN n.cpc = false THEN a.id END') }) // Contagem de NCPC
      .count({
        active: db.raw("CASE WHEN a.channel = 'active' THEN 1 ELSE NULL END"),
      }) // Contagem de `active`
      .count({
        dialer: db.raw("CASE WHEN a.channel = 'dialer' THEN 1 ELSE NULL END"),
      }) // Contagem de `dialer`
      .count({
        whatsapp: db.raw(
          "CASE WHEN a.channel = 'whatsapp' THEN 1 ELSE NULL END"
        ),
      }) // Contagem de `whatsapp`
      .count({
        nullChannel: db.raw('CASE WHEN a.channel IS NULL THEN 1 ELSE NULL END'),
      }) // Contagem de valores `NULL`
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list); // Filtros dinâmicos, se houver
        }
        return this.service.generateWherePaginate(q, qs); // Gerar o paginate dinamicamente
      })
      .whereNotIn('ta.abbreviation', ['SMS', 'EME']) // Excluir acionamentos de SMS e EME
      .whereRaw('ta.commissioned > 0')
      .groupBy([
        'u.id',
        'a.user_id',
        'u.name',
        'ta.id',
        'ta.abbreviation',
        'ta.name',
      ]) // Agrupa por usuário, nome do usuário, e tipo de acionamento
      .orderBy(`${orderBy}`, descending === 'true' ? 'desc' : 'asc');

    return this.service.transformUserActions(
      serializeKeysCamelCase(userActions)
    );
  }

  async listByUserAndCpc({ request }: HttpContext) {
    const qs = request.qs();

    let orderBy = 'u.id';
    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        orderBy = `u.name`;
      } else if (qs.orderBy === 'userId') {
        orderBy = `u.id`;
      } else if (qs.orderBy === 'typeAction') {
        orderBy = `ta.name`;
      }
    }
    const descending = qs.descending || 'true';

    // Gera o where com paginação, caso seja necessário
    const selected = await this.service.generateWhereInPaginate(qs);

    // Consulta ao banco de dados para agrupar por usuários e contar acionamentos separados por CPC e NCPC
    const actionsByUser = await db
      .from('public.actions AS a')
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id') // Relacionando ações com usuários
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      ) // Relacionando com os tipos de ações
      .joinRaw(
        'LEFT JOIN recupera.tbl_arquivos_cliente_numero n ON a.cod_credor_des_regis = n.cod_credor_des_regis AND a.contato = n.contato'
      ) // Relaciona para verificar se é CPC ou NCPC
      .select('u.name AS userName') // Seleciona o nome do usuário
      .select('u.id AS userId')
      .count('a.id AS total') // Conta o número total de acionamentos por usuário
      .count({ CPC: db.raw('CASE WHEN n.cpc = true THEN a.id END') }) // Contagem de CPC
      .count({ NCPC: db.raw('CASE WHEN n.cpc = false THEN a.id END') }) // Contagem de NCPC
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list); // Filtros dinâmicos, se houver
        }
        return this.service.generateWherePaginate(q, qs); // Gerar o paginate dinamicamente
      })
      .whereNotIn('ta.abbreviation', ['EME', 'SMS']) // Excluindo os tipos de ação 'EME' e 'SMS'
      .groupBy(['u.id', 'u.name'])
      .orderBy(`${orderBy}`, descending === 'true' ? 'desc' : 'asc');

    return serializeKeysCamelCase(actionsByUser);
  }

  async listByUserAndChannel({ request }: HttpContext) {
    const qs = request.qs();

    let orderBy = 'u.id';
    if (qs.orderBy) {
      if (qs.orderBy === 'user') {
        orderBy = `u.name`;
      } else if (qs.orderBy === 'userId') {
        orderBy = `u.id`;
      } else if (qs.orderBy === 'channelActive') {
        orderBy = `activeCount`;
      } else if (qs.orderBy === 'channelDialer') {
        orderBy = `dialerCount`;
      } else if (qs.orderBy === 'channelWhatsapp') {
        orderBy = `whatsappCount`;
      } else if (qs.orderBy === 'channelNull') {
        orderBy = `nullCount`;
      }
    }
    const descending = qs.descending || 'true';

    // Gera o where com paginação, caso seja necessário
    const selected = await this.service.generateWhereInPaginate(qs);

    // Consulta ao banco de dados para agrupar por usuários e contar acionamentos separados por valores de `channel`
    const actionsByUser = await db
      .from('public.actions AS a')
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id') // Relacionando ações com usuários
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      ) // Relacionando com os tipos de ações
      .select('u.name AS userName') // Seleciona o nome do usuário
      .select('u.id AS userId')
      .count('a.id AS total') // Conta o número total de acionamentos por usuário
      .count({
        activeCount: db.raw(
          "CASE WHEN a.channel = 'active' THEN 1 ELSE NULL END"
        ),
      }) // Contagem de `active`
      .count({
        dialerCount: db.raw(
          "CASE WHEN a.channel = 'dialer' THEN 1 ELSE NULL END"
        ),
      }) // Contagem de `dialer`
      .count({
        whatsappCount: db.raw(
          "CASE WHEN a.channel = 'whatsapp' THEN 1 ELSE NULL END"
        ),
      }) // Contagem de `whatsapp`
      .count({
        nullCount: db.raw('CASE WHEN a.channel IS NULL THEN 1 ELSE NULL END'),
      }) // Contagem de `NULL`
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list); // Filtros dinâmicos, se houver
        }
        return this.service.generateWherePaginate(q, qs); // Gerar o paginate dinamicamente
      })
      .whereNotIn('ta.abbreviation', ['EME', 'SMS']) // Excluindo os tipos de ação 'EME' e 'SMS'
      .groupBy(['u.id', 'u.name'])
      .orderBy(`${orderBy}`, descending === 'true' ? 'desc' : 'asc');

    return serializeKeysCamelCase(actionsByUser);
  }

  async categorizeByUserAndChannel({ request }: HttpContext) {
    const qs = request.qs();

    // Gera o where com paginação, caso seja necessário
    const selected = await this.service.generateWhereInPaginate(qs);

    // Consulta ao banco de dados para agrupar por usuários e contar acionamentos por valores da coluna channel
    const actionsByUser = await db
      .from('public.actions AS a')
      .joinRaw('LEFT JOIN public.users AS u ON a.user_id = u.id') // Relacionando ações com usuários
      .joinRaw(
        'LEFT JOIN public.type_actions AS ta ON a.type_action_id = ta.id'
      ) // Relacionando com os tipos de ações
      .select('u.name AS user_name') // Seleciona o nome do usuário
      .count('a.id AS total') // Conta o número total de acionamentos por usuário
      .count({
        active: db.raw("CASE WHEN a.channel = 'active' THEN 1 ELSE NULL END"),
      }) // Contagem de `active`
      .count({
        dialer: db.raw("CASE WHEN a.channel = 'dialer' THEN 1 ELSE NULL END"),
      }) // Contagem de `dialer`
      .count({
        whatsapp: db.raw(
          "CASE WHEN a.channel = 'whatsapp' THEN 1 ELSE NULL END"
        ),
      }) // Contagem de `whatsapp`
      .count({
        nullChannel: db.raw('CASE WHEN a.channel IS NULL THEN 1 ELSE NULL END'),
      }) // Contagem de valores `NULL`
      .where((q) => {
        if (selected) {
          q.whereIn(selected.column, selected.list); // Filtros dinâmicos, se houver
        }
        return this.service.generateWherePaginate(q, qs); // Gerar o paginate dinamicamente
      })
      .whereNotIn('ta.abbreviation', ['EME', 'SMS']) // Excluindo os tipos de ação 'EME' e 'SMS'
      .groupBy('u.name') // Agrupa pelos usuários
      .orderBy('total', 'desc') // Ordena pelo total de acionamentos de forma decrescente
      .limit(10); // Limita a 10 registros

    // Ordena os resultados pela quantidade total de acionamentos
    const sortedActions = actionsByUser.sort(
      (a, b) => Number(b.total) - Number(a.total)
    );

    // Geração do chartData com a classificação por usuário
    const chartData = sortedActions.map((action) => ({
      name: action.user_name || 'Unknown', // Garante que existe um nome de usuário ou 'Unknown'
      total: Number(action.total),
      active: Number(action.active) || 0,
      dialer: Number(action.dialer) || 0,
      whatsapp: Number(action.whatsapp) || 0,
      nullChannel: Number(action.nullChannel) || 0,
    }));

    // Geração do chartConfig para personalizar as cores e rótulos
    const chartConfig = sortedActions.reduce(
      (config, action) => {
        const userName = action.user_name
          ? action.user_name.toLowerCase().replace(/\s+/g, '_') // Gera uma chave válida
          : 'unknown';
        config[userName] = {
          label: action.user_name || 'Unknown', // Nome do usuário para o gráfico
        };
        return config;
      },
      {
        total: { label: 'Total' }, // Configuração base para o total
        active: { label: 'Active' },
        dialer: { label: 'Dialer' },
        whatsapp: { label: 'Whatsapp' },
        nullChannel: { label: 'Null' },
      }
    );

    return {
      chartData,
      chartConfig,
    };
  }

  async createExternalActions({ request, response }: HttpContext) {
    try {
      // Obtém os dados do corpo da requisição
      const data = request.input('actions');

      // Valida se é um objeto ou array
      if (!data || (typeof data !== 'object' && !Array.isArray(data))) {
        return response
          .status(400)
          .send({ message: 'Os dados fornecidos são inválidos.' });
      }

      // Criação das ações
      let createdActions;
      if (Array.isArray(data)) {
        createdActions = await ActionExternal.createMany(data);

        for (const action of createdActions) {
          await SendMailExternalJob.dispatch(
            action.toJSON() as IActionExternal,
            {
              queueName: 'SendEmailExternal',
            }
          );
        }
      } else {
        createdActions = await ActionExternal.create(data);

        await SendMailExternalJob.dispatch(
          createdActions.toJSON() as IActionExternal,
          {
            queueName: 'SendEmailExternal',
          }
        );
      }

      // Retorna as ações criadas
      return response.status(201).send({
        message: 'Ações criadas com sucesso!',
        data: createdActions,
      });
    } catch (error) {
      console.error('Erro ao criar ações:', error);
      return response.status(500).send({
        message: 'Erro ao criar ações.',
        error: error.message,
      });
    }
  }

  async externalCreate({ request, response }: HttpContext) {
    const data = request.all();

    // Garante que o payload é sempre um array (único item é transformado em array)
    const payloads = Array.isArray(data) ? data : [data];

    // Resultado das operações
    const results = [];

    for (const item of payloads) {
      try {
        // Valida cada item do array
        const payload = await request.validateUsing(createActionValidator, {
          data: item,
        });

        // Verifica duplicidade
        if (await this.service.checkDuplicate(item)) {
          // Verifica se o contrato existe
          if (await this.service.checkExisteContract(payload.desContr)) {
            const aggregation = await this.service.getAggregationContract(
              payload.desContr
            );

            // Cria a ação
            const action = await Action.create({
              ...aggregation,
              ...payload,
              userId: 2,
            });

            // Pós-criação (ex.: envio de notificações, etc.)
            const afterCreateResult = await this.service.afterCreate(
              action,
              item
            );

            results.push({
              success: true,
              message: 'Ação criada com sucesso',
              data: afterCreateResult,
            });
          } else {
            results.push({
              success: false,
              message: 'Contrato Inativo',
              error: 'Contrato Inativo',
              data: item,
            });
          }
        } else {
          results.push({
            success: false,
            message: 'Acionamento duplicado',
            error: 'Acionamento duplicado',
            data: { ...item, double: true },
          });
        }
      } catch (error) {
        results.push({
          success: false,
          message: 'Erro ao processar o item',
          error: error.message,
          data: item,
        });
      }
    }

    // Retorna a resposta com o resultado de todas as operações
    return response.status(207).json({
      message: 'Operação concluída',
      results,
    });
  }
}
