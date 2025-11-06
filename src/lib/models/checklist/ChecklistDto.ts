import type { BaseEntityDto } from '@sito/dashboard-app'
import type { CommonProductDto } from '../product'
import type { AddChecklistDto } from './AddChecklistDto'

export interface ChecklistDto extends BaseEntityDto, AddChecklistDto {
  completed: boolean
  products: CommonProductDto[]
}
