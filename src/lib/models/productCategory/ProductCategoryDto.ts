import type { BaseEntityDto, CommonUserDto } from '@sito/dashboard-app'

export interface ProductCategoryDto extends BaseEntityDto {
  name: string
  initial: boolean
  description: string
  user: CommonUserDto | null
}

