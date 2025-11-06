import type { DeleteDto } from '@sito/dashboard-app'

export interface UpdateProductCategoryDto extends DeleteDto {
  name: string
  description: string
  userId: number
}

