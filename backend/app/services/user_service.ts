import db from '@adonisjs/lucid/services/db';

export default class UserService {
  async checkUserModule(moduleName: string, userId: number) {
    const user = await db
      .from('public.users as u')
      .distinct('u.id', 'u.name')
      .select('u.id', 'u.name')
      .join('public.skill_user as su', 'u.id', 'su.user_id')
      .join('public.skills as s', 'su.skill_id', 's.id')
      .join('public.modules as m', 's.module_id', 'm.id')
      .where('s.name', 'full')
      .where('m.short_name', moduleName)
      .where('u.id', userId)
      .orderBy('name', 'asc')
      .first();

    console.log(user);
    return !!user;
  }
}
