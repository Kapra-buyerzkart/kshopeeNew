import { Model } from '@nozbe/watermelondb'
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators'

export default class SpecialItems extends Model {
  static table = 'special_items'

  @text('name') name!: string
  @text('description') description?: string
  @field('price') price!: number
  @text('image') image?: string
  @text('category_id') categoryId!: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}
