import { Model } from '@nozbe/watermelondb'
import { field, date, text, readonly } from '@nozbe/watermelondb/decorators'

export default class Client extends Model {
  static table = 'clients'

  @text('name') name!: string
  @text('mobile') mobile!: string
  @text('email') email?: string
  @text('address') address?: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}
