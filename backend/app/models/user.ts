import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, beforeSave, hasMany, manyToMany } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { DbAccessTokensProvider, AccessToken } from '@adonisjs/auth/access_tokens';
import Action from '#models/action';
import Skill from '#models/skill';
import PasswordHistory from '#models/password_history';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare email: string;

  @column()
  declare name: string;

  @column()
  declare cpf: string | null;

  @column()
  declare phone: string | null;

  @column({ serializeAs: null })
  declare password: string;

  @column()
  declare isActived: boolean;

  @column()
  declare rememberMeToken: string | null;

  @column.dateTime()
  declare passwordExpiresAt: DateTime;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @hasMany(() => Action)
  declare actions: HasMany<typeof Action>;

  @hasMany(() => PasswordHistory)
  declare passwordHistories: HasMany<typeof PasswordHistory>;

  declare currentAccessToken?: AccessToken;

  @manyToMany(() => Skill, {
    pivotTable: 'skill_user',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'skill_id',
  })
  declare skills: ManyToMany<typeof Skill>;

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password);
    }
  }

  static accessTokens = DbAccessTokensProvider.forModel(User);

}
