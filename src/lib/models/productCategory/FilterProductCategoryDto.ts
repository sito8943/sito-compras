import type { BaseFilterDto } from '@sito/dashboard-app'

export interface FilterProductCategoryDto extends BaseFilterDto {
  name?: string
  userId?: number
}

