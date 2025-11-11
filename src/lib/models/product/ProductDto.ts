import type { BaseEntityDto } from '@sito/dashboard-app'
import type { AddProductDto } from './AddProductDto'
import type { CommonChecklistDto } from '../checklist'

export interface ProductDto extends BaseEntityDto, AddProductDto {
  checklist: CommonChecklistDto | null
}

