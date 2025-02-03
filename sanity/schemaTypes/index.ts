import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import { categorySchema } from './categories'
import { sellerSchema } from './sellerSchema'
import { orderSchema } from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, categorySchema, sellerSchema, orderSchema],
}
