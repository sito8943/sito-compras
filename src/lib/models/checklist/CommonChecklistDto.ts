import type { BaseCommonEntityDto } from '@sito/dashboard-app'

export interface CommonChecklistDto extends BaseCommonEntityDto {
  name: string
  completed: boolean
}

