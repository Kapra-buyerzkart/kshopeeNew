import { Model } from '@nozbe/watermelondb'
import { field, date, children, readonly } from '@nozbe/watermelondb/decorators'
import OrderItem from './OrderItem'

export default class Order extends Model {
  static table = 'orders'
  static associations = {
    order_items: { type: 'has_many', foreignKey: 'order_id' },
  } as const

  @field('status') status!: string
  @field('total_amount') totalAmount!: number
  @field('payment_method') paymentMethod!: string
  @readonly @date('created_at') createdAt!: number

  @children('order_items') orderItems!: any
}
