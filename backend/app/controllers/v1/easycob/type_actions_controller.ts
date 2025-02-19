import type { HttpContext } from '@adonisjs/core/http';
import TypeAction from '#models/type_action';
import {
  createTypeActionValidator,
  updateTypeActionValidator,
} from '#validators/type_action';

export default class TypeActionsController {
  public async index() {
    const typeActions = await TypeAction.query().where('active', true);
    return typeActions;
  }
  public async create({ request }: HttpContext) {
    const payload = await request.validateUsing(createTypeActionValidator);
    const typeAction = await TypeAction.create(payload);
    return typeAction;
  }

  public async update({ request, params }: HttpContext) {
    const { id } = params;
    const typeAction = await TypeAction.findOrFail(id);
    const payload = await request.validateUsing(updateTypeActionValidator);
    typeAction.merge(payload);
    await typeAction.save();
    return typeAction;
  }

  public async show({ params }: HttpContext) {
    const { id } = params;
    const typeAction = await TypeAction.findOrFail(id);
    return typeAction;
  }

  public async destroy({ params }: HttpContext) {
    const { id } = params;
    const typeAction = await TypeAction.findOrFail(id);
    typeAction.active = false;
    await typeAction.save();
    return {
      message: `Tipo de ação ${typeAction.name} desativado com sucesso`,
    };
  }
}
