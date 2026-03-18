import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 8, // Added initial_password to employees
  tables: [
    tableSchema({
      name: 'products',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'price', type: 'number' },
        { name: 'image', type: 'string', isOptional: true },
        { name: 'category_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'special_items',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'price', type: 'number' },
        { name: 'image', type: 'string', isOptional: true },
        { name: 'category_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'mobile', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
        { name: 'otp_method', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'clients',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'mobile', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'address', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'employees',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'mobile', type: 'string' },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'address', type: 'string', isOptional: true },
        { name: 'employee_id', type: 'string', isOptional: true },
        { name: 'id_proof_type', type: 'string', isOptional: true },
        { name: 'gender', type: 'string', isOptional: true },
        { name: 'age', type: 'string', isOptional: true },
        { name: 'father_name', type: 'string', isOptional: true },
        { name: 'initial_password', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'status', type: 'string' },
        { name: 'total_amount', type: 'number' },
        { name: 'payment_method', type: 'string' },
        { name: 'created_at', type: 'number' },
        // Add other fields as needed
      ],
    }),
    tableSchema({
      name: 'order_items',
      columns: [
        { name: 'order_id', type: 'string', isIndexed: true },
        { name: 'product_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' },
      ],
    }),
  ]
})
