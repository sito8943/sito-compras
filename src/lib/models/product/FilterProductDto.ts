import type { BaseFilterDto } from '@sito/dashboard-app'

export interface FilterProductDto extends BaseFilterDto {
  name?: string
  price?: number
  count?: number
  userId?: number
  checklistId?: number
  description?: string
}

