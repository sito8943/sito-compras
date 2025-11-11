import type { BaseCommonEntityDto } from '@sito/dashboard-app'
import type { CommonCurrencyDto } from '../currency'

export interface CommonChecklistDto extends BaseCommonEntityDto {
  name: string
  currency: CommonCurrencyDto | null
}

