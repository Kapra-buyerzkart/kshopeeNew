import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'

  @text('name') name!: string
  @text('mobile') mobile!: string
  @text('email') email!: string
  @text('password') password!: string
  @text('otp_method') otpMethod!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
