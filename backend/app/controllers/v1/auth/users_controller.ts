import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { createUserValidator, updateUserValidator, updatePasswordValidator } from '#validators/user_validator';
import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import PasswordHistory from '#models/password_history';
import Module from '#models/module';


export default class UsersController {
    public async index({ request }: HttpContext) {
        const qs = request.qs();

        const pageNumber = qs.page || '1';
        const limit = qs.perPage || '10';
        const orderBy = qs.orderBy || 'id';
        const descending = qs.descending || 'true';

        const users = await User.query()
            .where((q) => {
                if (qs.keyword && qs.keyword.length > 3) {
                    q.whereILike('name', `%${qs.keyword}%`);
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
            await user.merge({ ...payload, passwordExpiresAt: dt }).save();
            return user;
        } catch (error) {
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

        const module = await Module.findBy('short_name', name);
        await module?.load('skills', (q) => {
            return q.preload('users');
        });
        let listUserId: any[] = [];

        if (module) {
            for (const skill of module.skills) {
                for (const user of skill.users) {
                    listUserId.push(user.id);
                }
            }

            listUserId = [...new Set(listUserId)];
            const users = await User.query()
                .select('id', 'name')
                .where((q) => {
                    if (qs.status) {
                        q.where('isActived', qs.status);
                    }
                    return q;
                })
                .whereIn('id', [...listUserId])
                .orderBy('name', 'asc');
            return users;
        }

        return [];
    }
}