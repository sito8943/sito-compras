import { BaseClient } from '@sito/dashboard-app'

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
  }
}
