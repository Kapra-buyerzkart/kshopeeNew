import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Employee extends Model {
  static table = 'employees'

  @field('name') name!: string
  @field('mobile') mobile!: string
  @field('email') email!: string
  @field('address') address!: string
  @field('employee_id') employeeId!: string
  @field('id_proof_type') idProofType!: string
  @field('gender') gender!: string
  @field('age') age!: string
  @field('father_name') fatherName!: string
  @field('initial_password') initialPassword!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
