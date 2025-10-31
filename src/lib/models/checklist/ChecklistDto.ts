import type { BaseDto } from '@sito/dashboard'
import type { CommonProductDto } from '../product'

export interface ChecklistDto extends BaseDto {
  name: string
  completed: boolean
  products: CommonProductDto[]
}
