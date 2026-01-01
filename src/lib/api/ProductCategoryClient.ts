import { BaseClient } from '@sito/dashboard-app'
import { SupabaseAPIClient } from './SupabaseAPIClient'

// enum
import { Tables } from './types'

// types
import type {
  CommonProductCategoryDto,
  ProductCategoryDto,
  UpdateProductCategoryDto,
  FilterProductCategoryDto,
  AddProductCategoryDto,
} from 'lib/entities'

// config
import { config } from '../../config'

export default class ProductCategoryClient extends BaseClient<
  Tables,
  ProductCategoryDto,
  CommonProductCategoryDto,
  AddProductCategoryDto,
  UpdateProductCategoryDto,
  FilterProductCategoryDto
> {
  /**
   */
  constructor() {
    super(Tables.ProductCategories, config.apiUrl, config.auth.user)
    // swap transport to Supabase while keeping BaseClient API
    this.api = new SupabaseAPIClient(config.apiUrl, config.auth.user, true) as unknown as typeof this.api
  }
}
