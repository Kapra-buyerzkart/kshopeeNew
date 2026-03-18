import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'
import Order from './Order'

export default class OrderItem extends Model {
  static table = 'order_items'
  static associations = {
    orders: { type: 'belongs_to', key: 'order_id' },
  } as const

  @field('product_id') productId!: string
  @field('name') name!: string
  @field('quantity') quantity!: number
  @field('price') price!: number
  
  @relation('orders', 'order_id') order!: any
}
