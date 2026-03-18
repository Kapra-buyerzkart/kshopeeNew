import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { mySchema } from './schema'
import Order from './models/Order'
import OrderItem from './models/OrderItem'
import Client from './models/Client'
import User from './models/User'
import Product from './models/Product'
import SpecialItem from './models/SpecialItems'
import Employee from './models/Employee'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema: mySchema,
  // (You might want to comment out the following line if you want to support existing data)
  // migrations, 
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true, /* Platform.OS === 'ios' */
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
    console.error("Database setup error:", error)
  }
})

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    Order,
    OrderItem,
    Client,
    User,
    Product,
    SpecialItem,
    Employee,
  ],
})

export default database
