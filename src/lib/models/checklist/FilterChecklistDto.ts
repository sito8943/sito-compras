import type { BaseFilterDto } from '@sito/dashboard-app'

export interface FilterChecklistDto extends BaseFilterDto {
  name?: string
  completed?: boolean
  userId?: number
  products?: number[]
}

