import { BaseClient } from '@sito/dashboard-app'
import { SupabaseAPIClient } from './SupabaseAPIClient'

// enum
import { Tables } from './types'

// types
import type {
  CommonProductDto,
  ProductDto,
  UpdateProductDto,
  FilterProductDto,
  AddProductDto,
} from 'lib/entities'

// utils
import { config } from '../../config'

export default class ProductClient extends BaseClient<
  Tables,
  ProductDto,
  CommonProductDto,
  AddProductDto,
  UpdateProductDto,
  FilterProductDto
> {
  /**
   */
  constructor() {
    super(Tables.Products, config.apiUrl, config.auth.user)
    // swap transport to Supabase while keeping BaseClient API
    this.api = new SupabaseAPIClient(config.apiUrl, config.auth.user, true) as unknown as typeof this.api
  }
}
