import type { BaseEntityDto, CommonUserDto } from '@sito/dashboard-app'
import type { CommonProductDto } from '../product'
import type { AddChecklistDto } from './AddChecklistDto'

export interface ChecklistDto extends BaseEntityDto, AddChecklistDto {
  completed: boolean
  user: CommonUserDto | null
  products: CommonProductDto[] | null
}
