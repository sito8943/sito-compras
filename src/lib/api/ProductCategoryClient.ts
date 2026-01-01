import { BaseClient } from '@sito/dashboard-app'

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
  }
}
