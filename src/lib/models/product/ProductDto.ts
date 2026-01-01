import type { BaseEntityDto } from '@sito/dashboard-app'
import type { AddProductDto } from './AddProductDto'
import type { CommonCurrencyDto } from '../currency'
import type { CommonProductCategoryDto } from '../productCategory'

export interface ProductDto extends BaseEntityDto, AddProductDto {
  currency: CommonCurrencyDto | null
  categories?: CommonProductCategoryDto[] | null
}
