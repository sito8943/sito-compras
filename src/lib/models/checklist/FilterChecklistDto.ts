import type { BaseFilterDto } from '@sito/dashboard-app'

export interface FilterChecklistDto extends BaseFilterDto {
  name?: string
  completed?: boolean
  products?: number[]
}

