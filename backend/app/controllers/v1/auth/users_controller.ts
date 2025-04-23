import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import {
  createUserValidator,
  updateUserValidator,
  updatePasswordValidator,
} from '#validators/user_validator';
import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import PasswordHistory from '#models/password_history';
import db from '@adonisjs/lucid/services/db';

export default class UsersController {
  public async index({ request }: HttpContext) {
    const qs = request.qs();

    const pageNumber = qs.page || '1';
    const limit = qs.perPage || '10';
    const orderBy = qs.orderBy || 'id';
    const descending = qs.descending || 'true';
    const keywordColumn = qs.keywordColumn || 'name';

    const users = await User.query()
      .where((q) => {
        if (qs.keyword && qs.keyword.length > 3) {
          q.whereILike(keywordColumn, `%${qs.keyword}%`);
        }

        if (qs.status) {
          const isActived = qs.status === 'true';
          q.where('isActived', isActived);
        }

        return q;
      })
      .preload('skills')
      .orderBy(orderBy, descending === 'true' ? 'desc' : 'asc')
      .paginate(pageNumber, limit);

    return users;
  }

  public async create({ request, response }: HttpContext) {
    try {
      const passwordExpires: number = process.env.PASSWORD_EXPIRES
        ? parseInt(process.env.PASSWORD_EXPIRES)
        : 7;
      const { skills } = request.only(['skills']);

      const data = request.all();
      const payload = await createUserValidator.validate(data);

      const dt: DateTime = DateTime.local().plus({ days: passwordExpires });
      const user = await User.create({ ...payload, passwordExpiresAt: dt });
      user.password = payload.password;
      user.save();

      if (skills) {
        await user.related('skills').sync(skills);
      }
      await user.load('skills');
      return user;
    } catch (error) {
      response.badRequest({ messages: error });
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params;
      const user = await User.findOrFail(id);
      await user.load('skills');
      return user;
    } catch (error) {
      response.badRequest({
        messages: {
          errors: ['Not user'],
        },
      });
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params;
      const user = await User.findOrFail(id);
      const { skills } = request.only(['skills']);
      const data = request.all();
      const payload = await updateUserValidator.validate(data);
      await user.merge(payload).save();
      if (skills) {
        await user.related('skills').sync(skills);
      }
      await user.load('skills');
      return user;
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }

  public async updatePassword({ params, request, response }: HttpContext) {
    try {
      const passwordExpires: number = process.env.PASSWORD_EXPIRES
        ? parseInt(process.env.PASSWORD_EXPIRES)
        : 7;
      const { id } = params;
      const user = await User.findOrFail(id);
      const data = request.all();
      const payload = await updatePasswordValidator.validate(data);

      const passwordHistories = await PasswordHistory.findBy(
        'password',
        await hash.make(user.password)
      );
      if (passwordHistories) {
        throw new Error('The password has already been used');
      }
      const dt: DateTime = DateTime.local().plus({ days: passwordExpires });
      user.password = payload.password;
      user.passwordExpiresAt = dt;
      await user.save();
      response.ok({ message: 'Password updated successfully' });
    } catch (error) {
      console.log(error);
      console.log('tivemos um erro');
      response.badRequest({ messages: error.messages });
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params;
      const user = await User.findOrFail(id);
      user.isActived = !user.isActived;
      user.save();
      return user;
    } catch (error) {
      response.badRequest({
        messages: {
          errors: ['Not user'],
        },
      });
    }
  }

  public async getByModule({ params, request }: HttpContext) {
    const { name } = params;
    const qs = request.qs();

    const users = await db
      .from('public.users as u')
      .distinct('u.id', 'u.name')
      .select('u.id', 'u.name')
      .join('public.skill_user as su', 'u.id', 'su.user_id')
      .join('public.skills as s', 'su.skill_id', 's.id')
      .join('public.modules as m', 's.module_id', 'm.id')
      .where('m.short_name', name)
      .where((q) => {
        if (qs.status === 'true') {
          q.where('u.is_actived', true);
        }
        return q;
      })
      .orderBy('name', 'asc');
    return users;
  }
}
