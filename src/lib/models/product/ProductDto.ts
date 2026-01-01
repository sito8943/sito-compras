import type { BaseEntityDto } from '@sito/dashboard-app'
import type { AddProductDto } from './AddProductDto'
import type { CommonChecklistDto } from '../checklist'
import type { CommonProductCategoryDto } from '../productCategory'

export interface ProductDto extends BaseEntityDto, AddProductDto {
  checklists: CommonChecklistDto[] | null
  categories: CommonProductCategoryDto[] | null
}

