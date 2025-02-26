import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import Module from '#models/module';

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password']);

    try {
      const user = await User.verifyCredentials(email, password);
      //console.log(user);
      if (!user.isActived) {
        return response.unauthorized('Invalid credentials');
      }
      const abilities: string[] = [];

      await user.load('skills', (skills) => {
        skills.preload('module');
      });

      for (const skill of user.skills) {
        abilities.push(`${skill.module.shortName}:${skill.name}`);
      }

      const isAdminFull = user.skills.some(
        (skill) => `${skill.module.shortName}:${skill.name}` === 'admin:full'
      );

      if (isAdminFull) {
        abilities.push(`*`);
      }

      return await User.accessTokens.create(user, abilities, {
        name: 'easycob',
        expiresIn: '30 days',
      });
    } catch {
      return response.unauthorized('Invalid credentials');
    }
  }

  async logout({ auth }: HttpContext) {
    const user: User = auth.user!;
    const tokens = await User.accessTokens.all(user);
    for (const token of tokens) {
      await User.accessTokens.delete(auth.user!, token.identifier);
    }

    return {
      revoked: true,
    };
  }

  async refresh({ auth }: HttpContext) {
    const user: User = auth.user!;
    await User.accessTokens.delete(user!, user.currentAccessToken!.identifier);

    const abilities: string[] = [];

    await user.load('skills', (skills) => {
      skills.preload('module');
    });

    for (const skill of user.skills) {
      abilities.push(`${skill.module.shortName}:${skill.name}`);
    }

    const isAdminFull = user.skills.some(
      (skill) => `${skill.module.shortName}:${skill.name}` === 'admin:full'
    );

    if (isAdminFull) {
      abilities.push(`*`);
    }

    return await User.accessTokens.create(user, abilities, {
      name: 'easycob',
      expiresIn: '30 days',
    });
  }

  async me({ auth }: HttpContext) {
    const user: User = auth.user!;
    await user.load('skills', (skills) => {
      skills.preload('module');
    });
    return user;
  }

  public async module({ request }: HttpContext) {
    const qs = request.qs();

    if (qs.skill) {
      const modules = Module.query().preload('skills', (q) => {
        q.where('name', qs.skill);
      });
      return modules;
    }

    const modules = Module.query().preload('skills');
    return modules;
  }
}
