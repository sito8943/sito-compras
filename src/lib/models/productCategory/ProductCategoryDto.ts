import type { BaseEntityDto, CommonUserDto } from '@sito/dashboard-app'

export interface ProductCategoryDto extends BaseEntityDto {
  name: string
  description: string
  user: CommonUserDto | null
}

