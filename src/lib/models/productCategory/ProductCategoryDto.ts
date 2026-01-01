import type { BaseEntityDto, CommonUserDto } from '@sito/dashboard-app'
import type { CommonProductDto } from '../product'

export interface ProductCategoryDto extends BaseEntityDto {
  name: string
  description: string
  user: CommonUserDto | null
  products?: CommonProductDto[] | null
}
